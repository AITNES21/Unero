import rss from '@astrojs/rss';
import type { APIContext } from 'astro';
import { site } from '../../config/site';
import { articulos } from '../../lib/contenido';

/**
 * Canal RSS del Cuaderno.
 *
 * No es un capricho: un feed permite que agregadores y lectores sigan
 * el blog sin depender de redes sociales, y es una señal de sitio
 * mantenido. Cuesta veinte líneas.
 */
export async function GET(context: APIContext) {
  const lista = await articulos('es');

  return rss({
    title: 'Cuaderno Unero — Ibiza, arquitectura y construcción',
    description:
      'Costes reales, normativa, materiales y decisiones de proyecto para construir o reformar en Ibiza.',
    site: context.site ?? site.dominio,
    trailingSlash: true,
    customData: '<language>es-ES</language>',
    items: lista.map((a) => ({
      title: a.data.titulo,
      description: a.data.descripcion,
      pubDate: a.data.fecha,
      link: `/cuaderno/${a.id}/`,
      categories: [a.data.categoria, ...a.data.etiquetas],
      author: site.email,
    })),
  });
}
