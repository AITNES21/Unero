import type { APIRoute, GetStaticPaths } from 'astro';
import { REDIRECCIONES_EN, paginaDeRedireccion } from '../../lib/legado';

export const getStaticPaths: GetStaticPaths = () =>
  Object.keys(REDIRECCIONES_EN).map((legado) => ({ params: { legado } }));

export const GET: APIRoute = ({ params }) => {
  const destino = REDIRECCIONES_EN[params.legado as string];
  return new Response(paginaDeRedireccion(destino), {
    headers: { 'Content-Type': 'text/html; charset=utf-8' },
  });
};
