/**
 * Diagnóstico de nitidez de las imágenes.
 *
 * Uso:  node scripts/nitidez.mjs [/ruta …]
 *
 * Mide, para cada imagen de cada página, cuántos píxeles reales tiene
 * frente a los que necesita el hueco en el que se pinta. Si un hueco de
 * 1440 px recibe una imagen de 865 px, el navegador la amplía y se ve
 * borrosa por mucho que el fichero esté bien comprimido.
 *
 * Es el problema que ninguna herramienta de rendimiento avisa, porque
 * técnicamente todo funciona: solo se ve mal.
 */
import { chromium } from 'playwright';
import { readdirSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { servir } from './servidor-dist.mjs';

/** Ancho real, en píxeles, de cada fichero servido desde dist/. */
const anchos = new Map();
function indexar(dir) {
  for (const e of readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) indexar(p);
    else if (/\.(webp|png|jpe?g|avif)$/i.test(e.name)) anchos.set(e.name, medirAncho(p));
  }
}

/** Lee la cabecera del fichero para obtener el ancho sin decodificarlo. */
function medirAncho(ruta) {
  const b = readFileSync(ruta);
  try {
    if (b.slice(0, 4).toString('ascii') === 'RIFF' && b.slice(8, 12).toString('ascii') === 'WEBP') {
      const tipo = b.slice(12, 16).toString('ascii');
      if (tipo === 'VP8X') return ((b.readUIntLE(24, 3)) & 0xffffff) + 1;
      if (tipo === 'VP8L') {
        const n = b.readUInt32LE(21);
        return (n & 0x3fff) + 1;
      }
      if (tipo === 'VP8 ') return b.readUInt16LE(26) & 0x3fff;
    }
    if (b[0] === 0x89 && b.slice(1, 4).toString('ascii') === 'PNG') return b.readUInt32BE(16);
    if (b[0] === 0xff && b[1] === 0xd8) {
      let o = 2;
      while (o < b.length) {
        if (b[o] !== 0xff) { o++; continue; }
        const marcador = b[o + 1];
        const largo = b.readUInt16BE(o + 2);
        if (marcador >= 0xc0 && marcador <= 0xcf && ![0xc4, 0xc8, 0xcc].includes(marcador)) {
          return b.readUInt16BE(o + 7);
        }
        o += 2 + largo;
      }
    }
  } catch {
    /* formato no reconocido */
  }
  return 0;
}

indexar('dist');
const anchoReal = (nombre) => anchos.get(nombre) ?? 0;

const rutas = process.argv.slice(2).filter((a) => !a.startsWith('--'));
if (!rutas.length) {
  throw new Error('Indica al menos una ruta, o pasa las del sitemap.');
}

const VISTAS = [
  // El caso más exigente: escritorio ancho, donde los huecos son grandes.
  { nombre: 'escritorio', width: 1440, height: 900, dpr: 1 },
  // Y móvil a 2x, que pide el doble de píxeles de los que ocupa.
  { nombre: 'movil2x', width: 390, height: 844, dpr: 2 },
];

const { url: BASE, cerrar } = await servir('dist');
const navegador = await chromium.launch();
const hallazgos = [];

try {
  for (const vista of VISTAS) {
    const contexto = await navegador.newContext({
      viewport: { width: vista.width, height: vista.height },
      deviceScaleFactor: vista.dpr,
      isMobile: vista.dpr > 1,
    });
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
      // Recorrido por pasos para que carguen las diferidas sin agotar
      // la memoria del navegador.
      await pagina.evaluate(async () => {
        const paso = window.innerHeight * 0.8;
        for (let y = 0; y < document.body.scrollHeight; y += paso) {
          window.scrollTo(0, y);
          await new Promise((r) => setTimeout(r, 60));
        }
        window.scrollTo(0, 0);
      });
      await pagina.waitForTimeout(400);

      const medidas = await pagina.evaluate((dpr) =>
        Array.from(document.images)
          .filter((i) => i.clientWidth > 0 && i.currentSrc)
          .map((i) => ({
            src: i.currentSrc.split('/').pop(),
            alt: (i.alt || '').slice(0, 55),
            // Píxeles que necesita el hueco en la pantalla real.
            necesita: Math.round(i.clientWidth * dpr),
            ancho: Math.round(i.clientWidth),
          }))
      , vista.dpr);

      /*
        `naturalWidth` NO sirve aquí: cuando una imagen usa srcset con
        descriptores `w`, la especificación obliga al navegador a
        devolverlo corregido por la densidad del recurso elegido, así
        que informa de los píxeles CSS que ocupa y no de los que trae
        el fichero. Hay que leer el tamaño real del fichero servido.
      */
      for (const m of medidas) {
        const real = anchoReal(m.src);
        if (!real) continue;
        if (m.necesita > real * 1.15) {
          hallazgos.push({
            vista: vista.nombre,
            ruta,
            ...m,
            tiene: real,
            factor: +(m.necesita / real).toFixed(2),
          });
        }
      }
    }
    await contexto.close();
  }

  hallazgos.sort((a, b) => b.factor - a.factor);

  console.log('IMÁGENES QUE EL NAVEGADOR TIENE QUE AMPLIAR\n');
  if (!hallazgos.length) {
    console.log('  Ninguna. Todas llegan con píxeles suficientes.');
  } else {
    console.log(
      '%-11s %-38s %-7s %-7s %-6s %s'.replace(/%-?\d*s/g, (m, i) => m),
      ''
    );
    console.log(
      'vista'.padEnd(11),
      'página'.padEnd(34),
      'necesita'.padStart(9),
      'tiene'.padStart(7),
      'amplía'.padStart(7),
      '  alt'
    );
    console.log('-'.repeat(110));
    for (const h of hallazgos) {
      console.log(
        h.vista.padEnd(11),
        h.ruta.slice(0, 34).padEnd(34),
        `${h.necesita}px`.padStart(9),
        `${h.tiene}px`.padStart(7),
        `x${h.factor}`.padStart(7),
        '  ' + h.alt
      );
    }
    const graves = hallazgos.filter((h) => h.factor >= 1.6);
    console.log(
      `\n${hallazgos.length} casos. ${graves.length} con ampliación de 1,6x o más (visiblemente borrosas).`
    );
  }
} finally {
  await navegador.close();
  await cerrar();
}
