import type { APIRoute, GetStaticPaths } from 'astro';
import { REDIRECCIONES, paginaDeRedireccion } from '../lib/legado';

/**
 * Emite una página puente por cada URL heredada de la raíz.
 * Se resuelve como endpoint (y no con la opción `redirects` de Astro)
 * porque con `trailingSlash: 'always'` un destino terminado en `.html`
 * se generaría como carpeta y colisionaría con las rutas reales.
 */
export const getStaticPaths: GetStaticPaths = () =>
  Object.keys(REDIRECCIONES).map((legado) => ({ params: { legado } }));

export const GET: APIRoute = ({ params }) => {
  const destino = REDIRECCIONES[params.legado as string];
  return new Response(paginaDeRedireccion(destino), {
    headers: { 'Content-Type': 'text/html; charset=utf-8' },
  });
};
