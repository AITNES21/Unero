import rss from '@astrojs/rss';
import type { APIContext } from 'astro';
import { site } from '../../../config/site';
import { articulos } from '../../../lib/contenido';

export async function GET(context: APIContext) {
  const lista = await articulos('en');

  return rss({
    title: 'Unero Journal — Ibiza, architecture and construction',
    description:
      'Real costs, planning rules, materials and design decisions for building or renovating in Ibiza.',
    site: context.site ?? site.dominio,
    trailingSlash: true,
    customData: '<language>en-GB</language>',
    items: lista.map((a) => ({
      title: a.data.titulo,
      description: a.data.descripcion,
      pubDate: a.data.fecha,
      link: `/en/journal/${a.id}/`,
      categories: [a.data.categoria, ...a.data.etiquetas],
      author: site.email,
    })),
  });
}
