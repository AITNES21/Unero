import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://unero.es',
  trailingSlash: 'always',
  i18n: {
    defaultLocale: 'es',
    locales: ['es', 'en'],
    routing: { prefixDefaultLocale: false },
  },
  build: {
    // Genera /proyectos/can-cana/index.html en lugar de /proyectos/can-cana.html
    format: 'directory',
    inlineStylesheets: 'auto',
  },
  image: {
    // Sin AVIF por defecto: el coste de build no compensa frente a WebP
    // en un catálogo de ~100 fotos ya optimizadas en origen.
    responsiveStyles: true,
    layout: 'constrained',
    service: {
      // Servicio propio: el de Astro más una máscara de enfoque al
      // reducir. Ver src/lib/servicio-imagen.ts para el porqué.
      entrypoint: './src/lib/servicio-imagen.ts',
      config: {
        // 82 es el punto de equilibrio, medido: de 82 a 88 la nitidez
        // sube un 1,5 % y el peso un 37 %. Por debajo de 78 sí se pierde
        // el detalle que devuelve el reenfoque.
        webp: { quality: 82, effort: 5 },
        // lanczos3 conserva mejor el detalle fino que el filtro por
        // defecto al reducir fotografía de arquitectura.
        kernel: 'lanczos3',
        limitInputPixels: false,
      },
    },
  },
  prefetch: {
    prefetchAll: true,
    defaultStrategy: 'hover',
  },
  integrations: [
    sitemap({
      i18n: {
        defaultLocale: 'es',
        locales: { es: 'es-ES', en: 'en-GB' },
      },
      // Las páginas puente de la web v1 y las de agradecimiento no
      // deben aparecer en el sitemap: no son destinos, y las puente ya
      // llevan noindex.
      filter: (page) =>
        !page.includes('/gracias/') &&
        !page.includes('/thank-you/') &&
        !page.endsWith('.html'),
      serialize(item) {
        if (item.url === 'https://unero.es/') item.priority = 1.0;
        else if (/\/(proyectos|projects)\/$/.test(item.url)) item.priority = 0.9;
        else if (/\/(servicios|services)\//.test(item.url)) item.priority = 0.9;
        else if (/\/(contacto|contact)\//.test(item.url)) item.priority = 0.8;
        else item.priority = 0.6;
        item.changefreq = 'monthly';
        return item;
      },
    }),
  ],
});
