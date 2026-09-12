/**
 * Auditoría estática de `dist/`.
 *
 * Uso:  node scripts/auditar.mjs
 *
 * Revisa lo que se puede comprobar sin navegador y que, si se rompe,
 * se rompe en silencio: enlaces internos muertos, metadatos duplicados
 * o ausentes, imágenes sin texto alternativo, saltos en la jerarquía de
 * encabezados, cobertura del sitemap y peso de cada página.
 */
import { readdir, readFile, stat } from 'node:fs/promises';
import path from 'node:path';

const DIST = 'dist';
const problemas = [];
const avisos = [];

function problema(msg) {
  problemas.push(msg);
}
function aviso(msg) {
  avisos.push(msg);
}

/** Recorre dist/ y devuelve todos los ficheros. */
async function recorrer(dir, acumulado = []) {
  for (const entrada of await readdir(dir, { withFileTypes: true })) {
    const completo = path.join(dir, entrada.name);
    if (entrada.isDirectory()) await recorrer(completo, acumulado);
    else acumulado.push(completo);
  }
  return acumulado;
}

const ficheros = await recorrer(DIST);
const htmls = ficheros.filter((f) => f.endsWith('.html'));

/** Convierte una ruta de fichero en la URL con la que se sirve. */
function aUrl(fichero) {
  let url = '/' + path.relative(DIST, fichero).split(path.sep).join('/');
  if (url.endsWith('/index.html')) url = url.slice(0, -'index.html'.length);
  return url;
}

const urlsExistentes = new Set();
for (const f of ficheros) {
  const url = aUrl(f);
  urlsExistentes.add(url);
  // Una carpeta con index.html responde con y sin barra final.
  if (url.endsWith('/')) urlsExistentes.add(url.slice(0, -1));
}

/* ====================================================================
   Análisis por página
   ==================================================================== */
const titulos = new Map();
const descripciones = new Map();
const canonicas = new Map();
const paginas = [];

function extraer(regex, html, grupo = 1) {
  const m = html.match(regex);
  return m ? m[grupo] : null;
}

function extraerTodos(regex, html, grupo = 1) {
  return [...html.matchAll(regex)].map((m) => m[grupo]);
}

for (const fichero of htmls) {
  const html = await readFile(fichero, 'utf8');
  const url = aUrl(fichero);
  const bytes = (await stat(fichero)).size;

  /*
    Ficheros de verificación de propiedad (Google Search Console, Bing).
    No son páginas: son una línea de texto con extensión .html que el
    buscador comprueba tal cual. No deben llevar title, canonical ni h1,
    así que se saltan las comprobaciones o bloquearían el despliegue.
  */
  if (/^\/(google[0-9a-f]{16}\.html|BingSiteAuth\.xml|yandex_[0-9a-f]+\.html)$/.test(url)) {
    if (html.length > 500) {
      problema(`${url}: fichero de verificación inesperadamente grande`);
    }
    continue;
  }

  // Las páginas puente de la web v1 solo necesitan su redirección.
  const esPuente = /http-equiv="refresh"/.test(html);
  if (esPuente) {
    const destino = extraer(/content="0;\s*url=([^"]+)"/, html);
    if (!destino) problema(`${url}: página puente sin destino`);
    else if (!urlsExistentes.has(destino)) {
      problema(`${url}: la redirección apunta a ${destino}, que no existe`);
    }
    continue;
  }

  const titulo = extraer(/<title>([^<]*)<\/title>/, html);
  const descripcion = extraer(/<meta name="description" content="([^"]*)"/, html);
  const canonica = extraer(/<link rel="canonical" href="([^"]*)"/, html);
  const noindex = /content="noindex/.test(html);
  const h1s = extraerTodos(/<h1[^>]*>([\s\S]*?)<\/h1>/g, html).map((t) =>
    t.replace(/<[^>]+>/g, '').trim()
  );
  const lang = extraer(/<html lang="([^"]*)"/, html);

  paginas.push({ url, bytes, titulo, noindex, lang });

  // --- Metadatos ---
  if (!titulo) problema(`${url}: sin <title>`);
  else {
    if (titulo.length > 65) {
      aviso(`${url}: title de ${titulo.length} caracteres (se truncará en Google) — "${titulo}"`);
    }
    if (titulo.length < 15) aviso(`${url}: title muy corto — "${titulo}"`);
    if (noindex) {
      // Sin más comprobaciones: no se indexa.
    }
    if (!noindex) {
      if (titulos.has(titulo)) {
        problema(`title duplicado "${titulo}" en ${titulos.get(titulo)} y ${url}`);
      } else titulos.set(titulo, url);
    }
  }

  if (!descripcion) problema(`${url}: sin meta description`);
  else {
    if (!noindex && descripcion.length > 165) {
      aviso(`${url}: meta description de ${descripcion.length} caracteres`);
    }
    if (!noindex && descripcion.length < 70) {
      aviso(`${url}: meta description de solo ${descripcion.length} caracteres`);
    }
    if (!noindex) {
      if (descripciones.has(descripcion)) {
        problema(
          `meta description duplicada en ${descripciones.get(descripcion)} y ${url}`
        );
      } else descripciones.set(descripcion, url);
    }
  }

  // --- Canonical: una y solo una (las noindex no la llevan) ---
  const nCanonicas = extraerTodos(/<link rel="canonical"/g, html).length;
  if (nCanonicas === 0 && !noindex) problema(`${url}: sin canonical`);
  if (nCanonicas > 1) problema(`${url}: ${nCanonicas} canonical (debe haber exactamente una)`);
  if (canonica) {
    if (canonicas.has(canonica) && !noindex) {
      problema(`canonical duplicada ${canonica} en ${canonicas.get(canonica)} y ${url}`);
    }
    canonicas.set(canonica, url);
    const esperada = 'https://unero.es' + url;
    if (canonica !== esperada) {
      problema(`${url}: canonical apunta a ${canonica} (se esperaba ${esperada})`);
    }
  }

  // --- Encabezados ---
  if (h1s.length === 0) problema(`${url}: sin <h1>`);
  if (h1s.length > 1) problema(`${url}: ${h1s.length} <h1> — "${h1s.join('" / "')}"`);

  // Jerarquía: no debe saltarse un nivel (h2 → h4).
  const niveles = extraerTodos(/<h([1-6])[\s>]/g, html).map(Number);
  let anterior = 0;
  for (const n of niveles) {
    if (anterior && n > anterior + 1) {
      aviso(`${url}: salto de h${anterior} a h${n} en la jerarquía de encabezados`);
      break;
    }
    anterior = n;
  }

  if (!lang) problema(`${url}: <html> sin atributo lang`);

  // --- Imágenes ---
  const imgs = [...html.matchAll(/<img\b[^>]*>/g)].map((m) => m[0]);
  for (const img of imgs) {
    const src = extraer(/src="([^"]*)"/, img) ?? '(sin src)';
    // Astro emite `alt` desnudo cuando el texto alternativo es vacío
    // (imagen decorativa), que es HTML válido y equivale a alt="".
    if (!/\salt(?:=|[\s>])/.test(img)) {
      problema(`${url}: <img> sin atributo alt — ${src.slice(0, 70)}`);
    }
    // La imagen del lightbox recibe src y dimensiones por JavaScript al
    // abrirse, y vive dentro de un <dialog> cerrado: no hay riesgo de CLS.
    const esLightbox = /data-imagen/.test(img);
    if (!esLightbox && (!/width="/.test(img) || !/height="/.test(img))) {
      aviso(`${url}: <img> sin width/height (riesgo de CLS) — ${src.slice(0, 70)}`);
    }
  }

  // --- hreflang coherente ---
  const hreflangs = extraerTodos(/hreflang="([^"]*)"\s+href="([^"]*)"/g, html, 2);
  for (const destino of hreflangs) {
    const ruta = destino.replace('https://unero.es', '');
    if (!urlsExistentes.has(ruta)) {
      problema(`${url}: hreflang apunta a ${ruta}, que no existe`);
    }
  }

  // --- Enlaces internos ---
  const hrefs = extraerTodos(/href="([^"]+)"/g, html);
  for (const href of hrefs) {
    if (/^(https?:|mailto:|tel:|data:|#|\/\/)/.test(href)) continue;
    const limpio = decodeURIComponent(href.split('#')[0].split('?')[0]);
    if (!limpio) continue;
    const absoluto = limpio.startsWith('/')
      ? limpio
      : '/' + path.posix.normalize(path.posix.join(path.posix.dirname(url), limpio));
    if (!urlsExistentes.has(absoluto)) {
      problema(`${url}: enlace roto → ${href}`);
    }
  }

  // --- Restos de la web anterior ---
  if (html.includes('aitnes21.github.io')) {
    problema(`${url}: contiene la URL antigua aitnes21.github.io`);
  }
  if (html.includes('le-de.cdn-website.com')) {
    problema(`${url}: sigue cargando el logotipo del CDN de tercero`);
  }
  if (/font-awesome|fontawesome/i.test(html)) {
    problema(`${url}: sigue referenciando Font Awesome`);
  }
  if (html.includes('fonts.googleapis.com')) {
    aviso(`${url}: carga tipografías desde Google Fonts (deberían ser propias)`);
  }
  if (/Calle Ejemplo/i.test(html)) {
    problema(`${url}: contiene la dirección de relleno "Calle Ejemplo"`);
  }
  // Sin la bandera /i: en español «todo» es una palabra corriente y
  // marcaba como relleno prácticamente todas las páginas.
  if (/\bTODO\b|\bFIXME\b|\bXXX\b|lorem ipsum/.test(html)) {
    problema(`${url}: contiene texto de relleno o marcador TODO`);
  }
}

/* ====================================================================
   Sitemap
   ==================================================================== */
const sitemaps = ficheros.filter((f) => /sitemap-\d+\.xml$/.test(f));
const enSitemap = new Set();
for (const s of sitemaps) {
  const xml = await readFile(s, 'utf8');
  for (const m of xml.matchAll(/<loc>([^<]+)<\/loc>/g)) {
    enSitemap.add(m[1].replace('https://unero.es', ''));
  }
}

const indexables = paginas.filter((p) => !p.noindex);
for (const p of indexables) {
  if (!enSitemap.has(p.url)) {
    problema(`${p.url}: página indexable que falta en el sitemap`);
  }
}
for (const url of enSitemap) {
  if (!urlsExistentes.has(url)) problema(`sitemap: ${url} no existe`);
  const p = paginas.find((x) => x.url === url);
  if (p?.noindex) problema(`sitemap: ${url} está en el sitemap pero lleva noindex`);
}

/* ====================================================================
   Peso
   ==================================================================== */
const pesadas = paginas.filter((p) => p.bytes > 100 * 1024).sort((a, b) => b.bytes - a.bytes);
for (const p of pesadas) {
  aviso(`${p.url}: HTML de ${Math.round(p.bytes / 1024)} kB`);
}

const totalDist = ficheros.reduce(async (acc, f) => (await acc) + (await stat(f)).size, Promise.resolve(0));

/* ====================================================================
   Informe
   ==================================================================== */
console.log('='.repeat(72));
console.log('AUDITORÍA DE dist/');
console.log('='.repeat(72));
console.log(`Páginas HTML:        ${htmls.length}`);
console.log(`  indexables:       ${indexables.length}`);
console.log(`  noindex:          ${paginas.length - indexables.length}`);
console.log(`  puente (v1):      ${htmls.length - paginas.length}`);
console.log(`En el sitemap:      ${enSitemap.size}`);
console.log(`Ficheros totales:   ${ficheros.length}`);
console.log(`Peso de dist/:      ${Math.round((await totalDist) / 1048576)} MB`);
console.log(
  `Idiomas:            es=${paginas.filter((p) => p.lang?.startsWith('es')).length}  en=${paginas.filter((p) => p.lang?.startsWith('en')).length}`
);

console.log(`\n--- PROBLEMAS (${problemas.length}) ---`);
if (!problemas.length) console.log('  Ninguno.');
for (const p of [...new Set(problemas)]) console.log('  ✗', p);

console.log(`\n--- AVISOS (${avisos.length}) ---`);
if (!avisos.length) console.log('  Ninguno.');
for (const a of [...new Set(avisos)]) console.log('  ·', a);

process.exit(problemas.length ? 1 : 0);
