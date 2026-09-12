/**
 * Medición de rendimiento sobre el sitio construido.
 *
 * Uso:  node scripts/medir.mjs [/ruta …]
 *
 * Sirve `dist/` y carga cada página con la red limitada a algo
 * parecido a un 4G móvil y mide lo que de verdad importa: los tres Core
 * Web Vitals y el peso real de lo que se descarga, desglosado por tipo.
 *
 * No sustituye a PageSpeed Insights —que mide desde un servidor de
 * Google y con datos reales de usuarios— pero detecta regresiones sin
 * salir del portátil.
 */
import { chromium } from 'playwright';
import { servir } from './servidor-dist.mjs';

const rutas = process.argv.slice(2).filter((a) => !a.startsWith('--'));
if (!rutas.length) rutas.push('/', '/proyectos/', '/proyectos/ses-torres-ii/', '/contacto/');

// Perfil "4G rápido": el escenario habitual de un móvil en la isla.
const RED = {
  offline: false,
  downloadThroughput: (10 * 1024 * 1024) / 8,
  uploadThroughput: (3 * 1024 * 1024) / 8,
  latency: 60,
};


function kb(bytes) {
  return `${Math.round(bytes / 1024)} kB`;
}

let navegador;
const { url: BASE, cerrar } = await servir('dist');

try {
  navegador = await chromium.launch();

  console.log('Red simulada: 10 Mbps de bajada, 60 ms de latencia · viewport 390×844\n');
  console.log(
    'ruta'.padEnd(38),
    'LCP'.padStart(8),
    'CLS'.padStart(7),
    'TBT~'.padStart(7),
    'total'.padStart(9),
    'js'.padStart(8),
    'css'.padStart(8),
    'img'.padStart(9),
    'fuentes'.padStart(9)
  );
  console.log('-'.repeat(112));

  const resumen = [];

  for (const ruta of rutas) {
    const contexto = await navegador.newContext({
      viewport: { width: 390, height: 844 },
      deviceScaleFactor: 2,
      isMobile: true,
      hasTouch: true,
    });
    const pagina = await contexto.newPage();

    // Cookies ya decididas: se mide la carga habitual, no la primera
    // visita con el aviso encima.
    await contexto.addInitScript(() => {
      try {
        localStorage.setItem(
          'unero_consentimiento',
          JSON.stringify({ analiticas: false, fecha: '2026-01-01', v: 1 })
        );
      } catch {}
    });

    // Bloquea Google Analytics: es de tercero y su latencia falsearía
    // la medida de lo que controlamos.
    await pagina.route('**://*.googletagmanager.com/**', (r) => r.abort());
    await pagina.route('**://*.google-analytics.com/**', (r) => r.abort());

    const cliente = await contexto.newCDPSession(pagina);
    await cliente.send('Network.enable');
    await cliente.send('Network.emulateNetworkConditions', RED);
    // Estrangulamiento de CPU: un móvil de gama media no es un portátil.
    await cliente.send('Emulation.setCPUThrottlingRate', { rate: 4 });

    const porTipo = { js: 0, css: 0, img: 0, font: 0, html: 0, otro: 0 };
    let total = 0;

    pagina.on('response', async (respuesta) => {
      try {
        const cabeceras = respuesta.headers();
        const largo = Number(cabeceras['content-length'] ?? 0);
        const bytes = largo || (await respuesta.body().catch(() => Buffer.alloc(0))).length;
        total += bytes;
        const tipo = cabeceras['content-type'] ?? '';
        if (tipo.includes('javascript')) porTipo.js += bytes;
        else if (tipo.includes('css')) porTipo.css += bytes;
        else if (tipo.includes('image')) porTipo.img += bytes;
        else if (tipo.includes('font')) porTipo.font += bytes;
        else if (tipo.includes('html')) porTipo.html += bytes;
        else porTipo.otro += bytes;
      } catch {
        /* respuesta descartada */
      }
    });

    await pagina.goto(BASE + ruta, { waitUntil: 'load' });
    // Margen para que se registren LCP y los desplazamientos tardíos.
    await pagina.waitForTimeout(2500);

    const vitales = await pagina.evaluate(
      () =>
        new Promise((resolver) => {
          const salida = { lcp: 0, cls: 0, tbt: 0, dcl: 0 };

          for (const entrada of performance.getEntriesByType('largest-contentful-paint')) {
            salida.lcp = Math.max(salida.lcp, entrada.startTime);
          }
          new PerformanceObserver((lista) => {
            for (const e of lista.getEntries()) salida.lcp = Math.max(salida.lcp, e.startTime);
          }).observe({ type: 'largest-contentful-paint', buffered: true });

          new PerformanceObserver((lista) => {
            for (const e of lista.getEntries()) {
              if (!e.hadRecentInput) salida.cls += e.value;
            }
          }).observe({ type: 'layout-shift', buffered: true });

          // Aproximación al Total Blocking Time: la parte de cada tarea
          // larga que excede los 50 ms.
          new PerformanceObserver((lista) => {
            for (const e of lista.getEntries()) salida.tbt += Math.max(0, e.duration - 50);
          }).observe({ type: 'longtask', buffered: true });

          const nav = performance.getEntriesByType('navigation')[0];
          salida.dcl = nav ? nav.domContentLoadedEventEnd : 0;

          setTimeout(() => resolver(salida), 600);
        })
    );

    const fila = {
      ruta,
      lcp: vitales.lcp,
      cls: vitales.cls,
      tbt: vitales.tbt,
      total,
      ...porTipo,
    };
    resumen.push(fila);

    console.log(
      ruta.slice(0, 37).padEnd(38),
      `${(vitales.lcp / 1000).toFixed(2)}s`.padStart(8),
      vitales.cls.toFixed(3).padStart(7),
      `${Math.round(vitales.tbt)}ms`.padStart(7),
      kb(total).padStart(9),
      kb(porTipo.js).padStart(8),
      kb(porTipo.css).padStart(8),
      kb(porTipo.img).padStart(9),
      kb(porTipo.font).padStart(9)
    );

    await contexto.close();
  }

  // Umbrales de Core Web Vitals: LCP ≤ 2,5 s y CLS ≤ 0,1 es "bueno".
  console.log('\nUmbral "bueno" de Google: LCP ≤ 2,50 s · CLS ≤ 0,100 · TBT ≤ 200 ms');
  const malos = resumen.filter((f) => f.lcp > 2500 || f.cls > 0.1 || f.tbt > 200);
  if (malos.length) {
    console.log('\nPáginas fuera de umbral:');
    for (const f of malos) {
      const motivos = [];
      if (f.lcp > 2500) motivos.push(`LCP ${(f.lcp / 1000).toFixed(2)}s`);
      if (f.cls > 0.1) motivos.push(`CLS ${f.cls.toFixed(3)}`);
      if (f.tbt > 200) motivos.push(`TBT ${Math.round(f.tbt)}ms`);
      console.log(' ·', f.ruta, '→', motivos.join(', '));
    }
  } else {
    console.log('\nTodas las páginas medidas dentro de umbral.');
  }
} finally {
  await navegador?.close();
  await cerrar();
}
