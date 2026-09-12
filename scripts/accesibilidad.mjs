/**
 * Auditoría de accesibilidad con axe-core.
 *
 * Uso:  node scripts/accesibilidad.mjs [/ruta …]
 *
 * Pasa axe (WCAG 2.1 A y AA) sobre cada página en móvil y en escritorio,
 * y además comprueba a mano tres cosas que axe no puede ver:
 *   · que el menú móvil se abra, atrape el foco y cierre con Escape,
 *   · que el lightbox de la galería se abra y se cierre con teclado,
 *   · que el formulario avise de los errores con texto y no solo con color.
 */
import { chromium } from 'playwright';
import { readFile } from 'node:fs/promises';
import { createRequire } from 'node:module';
import { servir } from './servidor-dist.mjs';

const require = createRequire(import.meta.url);
const axePath = require.resolve('axe-core/axe.min.js');
const axeFuente = await readFile(axePath, 'utf8');

const rutas = process.argv.slice(2).filter((a) => !a.startsWith('--'));
if (!rutas.length) {
  rutas.push(
    '/',
    '/proyectos/',
    '/proyectos/ses-torres-ii/',
    '/servicios/',
    '/servicios/construccion-de-casas-en-ibiza/',
    '/cuaderno/',
    '/cuaderno/cuanto-cuesta-construir-una-casa-en-ibiza/',
    '/contacto/',
    '/estudio/',
    '/como-trabajamos/',
    '/propiedades/alquiler/',
    '/trasteros-mostoles/',
    '/privacidad/',
    '/404.html',
    '/en/'
  );
}

const VISTAS = [
  { nombre: 'movil', width: 390, height: 844, isMobile: true },
  { nombre: 'escritorio', width: 1440, height: 900, isMobile: false },
];

const fallos = [];
const { url: BASE, cerrar } = await servir('dist');
let navegador;

try {
  navegador = await chromium.launch();

  for (const vista of VISTAS) {
    const contexto = await navegador.newContext({
      viewport: { width: vista.width, height: vista.height },
      isMobile: vista.isMobile,
      hasTouch: vista.isMobile,
      locale: 'es-ES',
      // Sin animaciones: de lo contrario axe mide el contraste a mitad
      // de la transición de opacidad de los bloques con revelado y
      // reporta falsos positivos de color.
      reducedMotion: 'reduce',
    });
    // Decisión de cookies tomada: el aviso no interfiere en el análisis.
    await contexto.addInitScript(() => {
      try {
        localStorage.setItem(
          'unero_consentimiento',
          JSON.stringify({ analiticas: false, fecha: '2026-01-01', v: 1 })
        );
      } catch {}
    });

    const pagina = await contexto.newPage();
    await pagina.route('**://*.googletagmanager.com/**', (r) => r.abort());
    await pagina.route('**://*.google-analytics.com/**', (r) => r.abort());

    for (const ruta of rutas) {
      await pagina.goto(BASE + ruta, { waitUntil: 'load' });
      // Los bloques con revelado empiezan a opacidad 0. Se fuerzan a
      // visibles y sin transición, para que axe mida el color final.
      await pagina.addStyleTag({
        content:
          '.revelar,.revelar *{opacity:1 !important;translate:none !important;' +
          'transition:none !important;animation:none !important}',
      });
      await pagina.evaluate(() =>
        document.querySelectorAll('.revelar').forEach((el) => el.classList.add('es-visible'))
      );
      await pagina.waitForTimeout(120);
      await pagina.addScriptTag({ content: axeFuente });

      const resultado = await pagina.evaluate(async () =>
        // @ts-ignore — axe se inyecta en tiempo de ejecución
        await window.axe.run(document, {
          runOnly: { type: 'tag', values: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'] },
          resultTypes: ['violations'],
        })
      );

      for (const v of resultado.violations) {
        fallos.push({
          vista: vista.nombre,
          ruta,
          id: v.id,
          impacto: v.impact,
          descripcion: v.help,
          nodos: v.nodes.slice(0, 3).map((n) => {
            const d = n.any?.[0]?.data;
            // Para el contraste conviene ver los colores y la relación
            // medida: es la diferencia entre adivinar y corregir.
            const medida = d?.contrastRatio
              ? `  [texto ${d.fgColor} sobre ${d.bgColor} = ${d.contrastRatio}:1, exige ${d.expectedContrastRatio}:1, ${d.fontSize}]`
              : '';
            return n.html.slice(0, 110) + medida;
          }),
        });
      }
    }

    await contexto.close();
  }

  /* ==================================================================
     Comprobaciones manuales de teclado
     ================================================================== */
  const notas = [];

  // --- Menú móvil ---
  {
    const contexto = await navegador.newContext({
      viewport: { width: 390, height: 844 },
      isMobile: true,
      hasTouch: true,
    });
    const pagina = await contexto.newPage();
    await pagina.route('**://*.googletagmanager.com/**', (r) => r.abort());
    await pagina.goto(BASE + '/', { waitUntil: 'load' });

    await pagina.click('#boton-menu');
    await pagina.waitForTimeout(250);
    const abierto = await pagina.getAttribute('#boton-menu', 'aria-expanded');
    const focoDentro = await pagina.evaluate(() =>
      document.getElementById('menu-movil')?.contains(document.activeElement)
    );
    const scrollBloqueado = await pagina.evaluate(() => document.body.style.overflow === 'hidden');

    await pagina.keyboard.press('Escape');
    await pagina.waitForTimeout(450);
    const cerradoTrasEscape = await pagina.getAttribute('#boton-menu', 'aria-expanded');
    const scrollRestaurado = await pagina.evaluate(() => document.body.style.overflow === '');

    notas.push(['menú móvil: aria-expanded al abrir', abierto === 'true']);
    notas.push(['menú móvil: el foco entra en la capa', focoDentro === true]);
    notas.push(['menú móvil: bloquea el scroll del fondo', scrollBloqueado === true]);
    notas.push(['menú móvil: Escape lo cierra', cerradoTrasEscape === 'false']);
    notas.push(['menú móvil: restaura el scroll al cerrar', scrollRestaurado === true]);

    await contexto.close();
  }

  // --- Lightbox de la galería ---
  {
    const contexto = await navegador.newContext({ viewport: { width: 1440, height: 900 } });
    const pagina = await contexto.newPage();
    await pagina.route('**://*.googletagmanager.com/**', (r) => r.abort());
    await pagina.goto(BASE + '/proyectos/ses-torres-ii/', { waitUntil: 'load' });

    await pagina.click('[data-indice="0"]');
    await pagina.waitForTimeout(250);
    const dialogoAbierto = await pagina.evaluate(
      () => document.querySelector('[data-lupa]')?.hasAttribute('open') ?? false
    );
    const imagenCargada = await pagina.evaluate(() => {
      const i = document.querySelector('[data-imagen]');
      return !!i && i.getAttribute('src')?.length > 0;
    });

    await pagina.keyboard.press('ArrowRight');
    await pagina.waitForTimeout(150);
    const contador = await pagina.textContent('[data-contador]');

    await pagina.keyboard.press('Escape');
    await pagina.waitForTimeout(250);
    const dialogoCerrado = await pagina.evaluate(
      () => !(document.querySelector('[data-lupa]')?.hasAttribute('open') ?? false)
    );

    notas.push(['galería: el lightbox se abre', dialogoAbierto]);
    notas.push(['galería: carga la imagen al abrir', imagenCargada]);
    notas.push(['galería: las flechas cambian de imagen', /2/.test(contador ?? '')]);
    notas.push(['galería: Escape lo cierra', dialogoCerrado]);

    await contexto.close();
  }

  // --- Formulario ---
  {
    const contexto = await navegador.newContext({ viewport: { width: 1440, height: 900 } });
    const pagina = await contexto.newPage();
    await pagina.route('**://*.googletagmanager.com/**', (r) => r.abort());
    await pagina.goto(BASE + '/contacto/', { waitUntil: 'load' });

    await pagina.click('[data-enviar]');
    await pagina.waitForTimeout(300);

    const mensajes = await pagina.$$eval('.campo__error', (nodos) =>
      nodos.map((n) => n.textContent?.trim()).filter(Boolean)
    );
    const invalidos = await pagina.$$eval('[aria-invalid="true"]', (n) => n.length);
    const focoEnPrimero = await pagina.evaluate(
      () => document.activeElement?.getAttribute('name')
    );

    notas.push(['formulario: muestra errores en texto', mensajes.length >= 3]);
    notas.push(['formulario: marca aria-invalid', invalidos >= 3]);
    notas.push(['formulario: lleva el foco al primer error', focoEnPrimero === 'nombre']);

    await contexto.close();
  }

  /* ==================================================================
     Informe
     ================================================================== */
  console.log('='.repeat(72));
  console.log('ACCESIBILIDAD — axe-core, WCAG 2.1 AA');
  console.log('='.repeat(72));
  console.log(`Páginas analizadas: ${rutas.length} × ${VISTAS.length} vistas\n`);

  if (!fallos.length) {
    console.log('Sin violaciones de axe.\n');
  } else {
    // Agrupa por regla: 40 apariciones de la misma regla son un arreglo.
    const porRegla = new Map();
    for (const f of fallos) {
      if (!porRegla.has(f.id)) porRegla.set(f.id, { ...f, rutas: new Set() });
      porRegla.get(f.id).rutas.add(`${f.ruta} [${f.vista}]`);
    }
    console.log(`VIOLACIONES (${porRegla.size} reglas, ${fallos.length} apariciones)\n`);
    for (const [id, f] of porRegla) {
      console.log(`✗ ${id} — ${f.impacto}`);
      console.log(`  ${f.descripcion}`);
      console.log(`  en: ${[...f.rutas].slice(0, 5).join(', ')}${f.rutas.size > 5 ? ` (+${f.rutas.size - 5})` : ''}`);
      for (const n of f.nodos) console.log(`  · ${n}`);
      console.log();
    }
  }

  console.log('COMPROBACIONES DE TECLADO E INTERACCIÓN');
  let fallosManuales = 0;
  for (const [etiqueta, ok] of notas) {
    console.log(`  ${ok ? '✓' : '✗'} ${etiqueta}`);
    if (!ok) fallosManuales++;
  }

  const total = fallos.length + fallosManuales;
  console.log(`\n${total === 0 ? 'Todo correcto.' : `${total} problemas.`}`);
  process.exitCode = total ? 1 : 0;
} finally {
  await navegador?.close();
  await cerrar();
}
