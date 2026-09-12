/**
 * Servidor estático mínimo para `dist/`.
 *
 * Se usa desde los scripts de capturas y de medición. Sustituye a
 * `astro preview` porque este arranca como demonio persistente y se
 * niega a levantar una segunda instancia, lo que hacía fallar cualquier
 * script que se ejecutara dos veces seguidas.
 *
 * Replica el comportamiento de GitHub Pages en lo que importa para las
 * pruebas: sirve `index.html` en las carpetas y `404.html` cuando no
 * encuentra la ruta.
 */
import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import path from 'node:path';

const TIPOS = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.xml': 'application/xml; charset=utf-8',
  '.txt': 'text/plain; charset=utf-8',
  '.webp': 'image/webp',
  '.avif': 'image/avif',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.woff2': 'font/woff2',
  '.mp4': 'video/mp4',
  '.pdf': 'application/pdf',
  '.webmanifest': 'application/manifest+json',
};

/**
 * Arranca el servidor y devuelve `{ url, cerrar }`.
 * @param {string} raiz carpeta a servir
 * @param {number} puerto 0 para que el sistema elija uno libre
 */
export async function servir(raiz = 'dist', puerto = 0) {
  const base = path.resolve(raiz);

  const servidor = createServer(async (peticion, respuesta) => {
    const ruta = decodeURIComponent((peticion.url ?? '/').split('?')[0]);
    // Impide salir de la carpeta servida con ../
    const destino = path.normalize(path.join(base, ruta));
    if (!destino.startsWith(base)) {
      respuesta.writeHead(403).end('Prohibido');
      return;
    }

    const candidatos = [destino, path.join(destino, 'index.html')];

    for (const candidato of candidatos) {
      try {
        const info = await stat(candidato);
        if (info.isDirectory()) continue;
        const cuerpo = await readFile(candidato);
        respuesta.writeHead(200, {
          'Content-Type': TIPOS[path.extname(candidato).toLowerCase()] ?? 'application/octet-stream',
          'Content-Length': cuerpo.length,
          'Cache-Control': 'no-store',
        });
        respuesta.end(cuerpo);
        return;
      } catch {
        /* siguiente candidato */
      }
    }

    // Igual que GitHub Pages: 404.html con código 404.
    try {
      const cuerpo = await readFile(path.join(base, '404.html'));
      respuesta.writeHead(404, {
        'Content-Type': 'text/html; charset=utf-8',
        'Content-Length': cuerpo.length,
      });
      respuesta.end(cuerpo);
    } catch {
      respuesta.writeHead(404).end('No encontrado');
    }
  });

  await new Promise((resolver) => servidor.listen(puerto, '127.0.0.1', resolver));
  const { port } = servidor.address();

  return {
    url: `http://127.0.0.1:${port}`,
    cerrar: () => new Promise((resolver) => servidor.close(resolver)),
  };
}
