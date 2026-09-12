/**
 * Comprueba que la web sigue siendo utilizable con JavaScript desactivado.
 *
 * Uso:  node scripts/sin-js.mjs
 *
 * No es un escenario frecuente, pero sí revelador: si el contenido solo
 * existe cuando el JavaScript se ejecuta, tampoco existe para un
 * rastreador que falle al renderizar, ni cuando un script se cae.
 */
import { chromium } from 'playwright';
import { servir } from './servidor-dist.mjs';

const { url: BASE, cerrar } = await servir('dist');
const navegador = await chromium.launch();
const contexto = await navegador.newContext({
  javaScriptEnabled: false,
  viewport: { width: 390, height: 844 },
  isMobile: true,
});
const pagina = await contexto.newPage();
const notas = [];

try {
  // --- Portada ---
  await pagina.goto(BASE + '/', { waitUntil: 'load' });
  notas.push([
    'portada: el titular es visible',
    await pagina.locator('h1').first().isVisible(),
  ]);
  notas.push([
    'portada: los bloques con revelado no quedan invisibles',
    await pagina.evaluate(() => {
      const el = document.querySelector('.revelar');
      return !el || Number(getComputedStyle(el).opacity) > 0.9;
    }),
  ]);
  notas.push([
    'portada: el pie ofrece navegación completa',
    (await pagina.locator('footer a[href]').count()) > 15,
  ]);
  notas.push([
    'portada: las respuestas de las FAQ están en el HTML',
    (await pagina.locator('.faq__respuesta p').first().textContent())?.length > 50,
  ]);

  // --- Catálogo ---
  await pagina.goto(BASE + '/proyectos/', { waitUntil: 'load' });
  notas.push([
    'catálogo: se ven todos los proyectos sin filtrar',
    (await pagina.locator('.catalogo__celda:visible').count()) === 8,
  ]);

  // --- Ficha de proyecto ---
  await pagina.goto(BASE + '/proyectos/ses-torres-ii/', { waitUntil: 'load' });
  notas.push([
    'ficha: la galería muestra las fotografías',
    (await pagina.locator('.galeria__img').count()) > 8,
  ]);
  notas.push([
    'ficha: el relato es visible',
    (await pagina.locator('.ficha-prosa p').first().textContent())?.length > 100,
  ]);

  // --- Formulario ---
  await pagina.goto(BASE + '/contacto/', { waitUntil: 'load' });
  const accion = await pagina.getAttribute('form', 'action');
  const metodo = await pagina.getAttribute('form', 'method');
  const destino = await pagina.getAttribute('input[name="_next"]', 'value');
  notas.push(['formulario: tiene action real', !!accion?.startsWith('https://')]);
  notas.push(['formulario: envía por POST', metodo?.toUpperCase() === 'POST']);
  notas.push(['formulario: define página de destino', !!destino]);
  notas.push([
    'formulario: los campos son obligatorios por HTML',
    (await pagina.locator('[required]').count()) >= 4,
  ]);

  // --- Artículo ---
  await pagina.goto(BASE + '/cuaderno/cuanto-cuesta-construir-una-casa-en-ibiza/', {
    waitUntil: 'load',
  });
  notas.push([
    'artículo: el texto completo está en el HTML',
    (await pagina.locator('.art__cuerpo').textContent())?.length > 5000,
  ]);

  console.log('SIN JAVASCRIPT\n');
  let fallos = 0;
  for (const [etiqueta, ok] of notas) {
    console.log(`  ${ok ? '✓' : '✗'} ${etiqueta}`);
    if (!ok) fallos++;
  }
  console.log(`\n${fallos ? `${fallos} fallos.` : 'Todo el contenido es accesible sin JavaScript.'}`);
  console.log(
    '\nNota: el menú de la cabecera en móvil necesita JavaScript para\n' +
      'abrirse. El pie de cada página lleva la navegación completa, así\n' +
      'que el sitio sigue siendo recorrible.'
  );
  process.exitCode = fallos ? 1 : 0;
} finally {
  await navegador.close();
  await cerrar();
}
