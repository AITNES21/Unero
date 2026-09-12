/**
 * Capturas de pantalla para la revisión visual.
 *
 * Uso:
 *   node scripts/capturas.mjs /ruta /otra-ruta
 *   node scripts/capturas.mjs --pliegue /            (solo primera pantalla)
 *   node scripts/capturas.mjs --vista=movil /        (un solo ancho)
 *
 * Sirve `dist/`, acepta las cookies para que el aviso no tape
 * la página, recorre la página hasta el final para que se resuelvan las
 * imágenes diferidas, y guarda las capturas en `.capturas/`.
 */
import { chromium } from 'playwright';
import { mkdir } from 'node:fs/promises';
import path from 'node:path';
import { servir } from './servidor-dist.mjs';

const SALIDA = '.capturas';

const TODAS_LAS_VISTAS = [
  { nombre: 'movil', width: 390, height: 844, deviceScaleFactor: 2, isMobile: true },
  { nombre: 'movil-xs', width: 320, height: 680, deviceScaleFactor: 2, isMobile: true },
  { nombre: 'tablet', width: 820, height: 1180, deviceScaleFactor: 2, isMobile: true },
  { nombre: 'escritorio', width: 1440, height: 900, deviceScaleFactor: 1, isMobile: false },
  { nombre: 'escritorio-xl', width: 1920, height: 1080, deviceScaleFactor: 1, isMobile: false },
];

const argumentos = process.argv.slice(2);
const soloPliegue = argumentos.includes('--pliegue');
/* Modo barrido: recorre muchas páginas comprobando desbordes, imágenes
   roto y errores de consola, sin guardar las capturas. */
const sinCapturas = argumentos.includes('--sin-capturas');
/* Solo desborde: no recorre la página ni espera imágenes. El
   desbordamiento horizontal lo determina el CSS —las cajas reservan su
   sitio con aspect-ratio— así que no hace falta cargar las fotografías.
   Además evita que Chromium se quede sin memoria en anchos pequeños,
   donde las páginas miden quince mil píxeles de alto. */
const soloDesborde = argumentos.includes('--solo-desborde');
const filtroVista = argumentos.find((a) => a.startsWith('--vista='))?.split('=')[1];
const rutas = argumentos.filter((a) => !a.startsWith('--'));
if (!rutas.length) rutas.push('/');

const vistas = filtroVista
  ? TODAS_LAS_VISTAS.filter((v) => filtroVista.split(',').includes(v.nombre))
  : TODAS_LAS_VISTAS.filter((v) => ['movil', 'tablet', 'escritorio'].includes(v.nombre));


let navegador;
const incidencias = [];
const { url: BASE, cerrar } = await servir('dist');

try {
  await mkdir(SALIDA, { recursive: true });
  navegador = await chromium.launch();

  for (const vista of vistas) {
    const contexto = await navegador.newContext({
      viewport: { width: vista.width, height: vista.height },
      deviceScaleFactor: vista.deviceScaleFactor,
      isMobile: vista.isMobile,
      hasTouch: vista.isMobile,
      locale: 'es-ES',
      reducedMotion: 'reduce',
    });

    // Decisión de cookies ya tomada: el aviso no aparece en las capturas.
    await contexto.addInitScript(() => {
      try {
        localStorage.setItem(
          'unero_consentimiento',
          JSON.stringify({ analiticas: false, fecha: new Date().toISOString(), v: 1 })
        );
      } catch {
        /* sin almacenamiento */
      }
    });

    const pagina = await contexto.newPage();
    pagina.on('console', (m) => {
      if (m.type() === 'error') incidencias.push(`[${vista.nombre}] consola: ${m.text()}`);
    });
    pagina.on('pageerror', (e) => incidencias.push(`[${vista.nombre}] error: ${e}`));
    pagina.on('requestfailed', (r) =>
      incidencias.push(`[${vista.nombre}] recurso fallido: ${r.url().slice(0, 120)}`)
    );

    for (const ruta of rutas) {
      await pagina.goto(BASE + ruta, { waitUntil: 'domcontentloaded' });

      // Recorre la página para que las imágenes diferidas se resuelvan
      // y los bloques con revelado entren en pantalla de verdad.
      // El recorrido va por pasos y no de un salto al final: saltar
      // dispara de golpe todas las imágenes diferidas de una página
      // larga y Chromium se queda sin memoria (probado: se cae).
      if (!soloDesborde) {
      await pagina.evaluate(async (rapido) => {
        const espera = rapido ? 45 : 90;
        const paso = window.innerHeight * 0.8;
        for (let y = 0; y < document.body.scrollHeight; y += paso) {
          window.scrollTo(0, y);
          await new Promise((r) => setTimeout(r, espera));
        }
        window.scrollTo(0, document.body.scrollHeight);
        await new Promise((r) => setTimeout(r, 350));
        window.scrollTo(0, 0);
      }, sinCapturas);

      await pagina
        .evaluate(async () => {
          await Promise.all(
            Array.from(document.images)
              .filter((i) => !i.complete)
              .map((i) => new Promise((r) => {
                i.addEventListener('load', r, { once: true });
                i.addEventListener('error', r, { once: true });
              }))
          );
        })
        .catch(() => {});
      }

      await pagina.waitForTimeout(sinCapturas ? 120 : 300);

      // Aviso de imágenes que no han cargado: distingue un fallo real
      // de un simple diferido no disparado.
      const roturas = soloDesborde ? [] : await pagina.evaluate(() =>
        Array.from(document.images)
          // La imagen del lightbox no tiene src hasta que se abre.
          .filter((i) => !i.hasAttribute('data-imagen'))
          .filter((i) => !i.complete || i.naturalWidth === 0)
          .map((i) => i.currentSrc || i.src)
      );
      for (const r of roturas) {
        incidencias.push(`[${vista.nombre}] ${ruta} imagen sin cargar: ${r.slice(0, 110)}`);
      }

      // Desbordamiento horizontal: el fallo más común en móvil.
      const desborde = await pagina.evaluate(() => {
        const de = document.documentElement;
        if (de.scrollWidth <= de.clientWidth + 1) return null;
        const culpables = [];
        const candidatos = Array.from(document.querySelectorAll('body *')).slice(0, 1500);
        for (const el of candidatos) {
          const c = el.getBoundingClientRect();
          if (c.width > 0 && (c.right > de.clientWidth + 1 || c.left < -1)) {
            culpables.push(
              `${el.tagName.toLowerCase()}.${(el.className || '').toString().split(' ')[0]}` +
                ` (${Math.round(c.left)}→${Math.round(c.right)})`
            );
          }
        }
        return { scrollWidth: de.scrollWidth, clientWidth: de.clientWidth, culpables: culpables.slice(0, 6) };
      });
      if (desborde) {
        incidencias.push(
          `[${vista.nombre}] ${ruta} DESBORDE horizontal ${desborde.scrollWidth}>${desborde.clientWidth}: ${desborde.culpables.join(', ')}`
        );
      }

      if (sinCapturas || soloDesborde) {
        console.log('·', vista.nombre, ruta);
        continue;
      }

      const base = ruta === '/' ? 'home' : ruta.replace(/^\/|\/$/g, '').replace(/\//g, '_');
      const nombre = `${base}--${vista.nombre}${soloPliegue ? '-pliegue' : ''}.png`;
      await pagina.screenshot({
        path: path.join(SALIDA, nombre),
        fullPage: !soloPliegue,
      });
      console.log('✓', nombre);
    }

    await contexto.close();
  }
} finally {
  await navegador?.close();
  await cerrar();
}

if (incidencias.length) {
  console.log('\n--- INCIDENCIAS ---');
  for (const i of [...new Set(incidencias)]) console.log(' ·', i);
} else {
  console.log('\nSin incidencias.');
}
