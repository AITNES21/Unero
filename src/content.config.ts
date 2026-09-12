import { defineCollection, reference, z } from 'astro:content';
import { glob } from 'astro/loaders';

/**
 * Texto que existe en los dos idiomas.
 * El español es obligatorio; el inglés cae al español si falta, de modo que
 * publicar un proyecto nuevo nunca deja la web en inglés a medias.
 */
const bilingue = z.object({
  es: z.string(),
  en: z.string().optional(),
});

const bilingueLista = z.object({
  es: z.array(z.string()),
  en: z.array(z.string()).optional(),
});

export const TIPOS_PROYECTO = [
  'obra-nueva',
  'reforma',
  'interiorismo',
  'promocion',
] as const;

export const SERVICIOS = [
  'construccion',
  'reforma-integral',
  'interiorismo',
  'gestion-licencias',
  'direccion-obra',
  'piscina',
  'paisajismo',
  'domotica',
  'promocion',
] as const;

/* ==========================================================================
   PROYECTOS
   Una entrada por proyecto, bilingüe, con la galería y la ficha técnica.
   Los campos factuales son opcionales a propósito: se muestran solo si
   existen, así nunca se publica un dato inventado ni un hueco vacío.
   ========================================================================== */
const proyectos = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/proyectos' }),
  schema: ({ image }) =>
    z.object({
      titulo: z.string(),
      /** Orden de aparición en el índice. Menor = antes. */
      orden: z.number().default(50),
      /** Aparece en la portada. */
      destacado: z.boolean().default(false),
      /**
       * Separa el catálogo de Ibiza del de península sin ocultar nada.
       * Opcional a propósito: un proyecto sin zona confirmada aparece en
       * «Todos» pero no se etiqueta con una ubicación que no consta.
       */
      zona: z.enum(['ibiza', 'peninsula']).optional(),
      tipo: z.enum(TIPOS_PROYECTO),

      // --- Ficha técnica (todo opcional) ---
      ubicacion: bilingue.optional(),
      ano: z.number().int().min(1990).max(2100).optional(),
      superficieConstruida: z.number().positive().optional(),
      superficieParcela: z.number().positive().optional(),
      estado: z.enum(['terminado', 'en-obra', 'vendido', 'disponible']).optional(),
      servicios: z.array(z.enum(SERVICIOS)).default([]),
      arquitectura: z.string().optional(),

      // --- Relato ---
      /** Frase corta para la tarjeta y la meta description. */
      resumen: bilingue,
      /** Párrafo de apertura de la ficha, a gran tamaño. */
      entradilla: bilingue.optional(),
      /** Cuerpo del relato, un elemento por párrafo. */
      relato: bilingueLista.optional(),
      /** Detalles constructivos destacados. */
      detalles: z
        .array(
          z.object({
            titulo: bilingue,
            texto: bilingue,
          })
        )
        .default([]),

      // --- Imágenes ---
      portada: image(),
      /** Texto alternativo de la portada. Obligatorio: es accesibilidad y SEO. */
      portadaAlt: bilingue,
      galeria: z
        .array(
          z.object({
            src: image(),
            alt: bilingue,
            /** `ancha` ocupa las dos columnas del mosaico. */
            ancha: z.boolean().default(false),
          })
        )
        .default([]),
      /** Vídeo de obra. Se carga solo si el visitante lo pide. */
      video: z
        .object({
          src: z.string(),
          poster: image().optional(),
        })
        .optional(),
      /** PDF de documentación (planos, memorias de calidades). */
      documentos: z
        .array(z.object({ titulo: bilingue, archivo: z.string() }))
        .default([]),
    }),
});

/* ==========================================================================
   CUADERNO (blog / revista)
   Un fichero por artículo y por idioma: los textos largos se escriben en
   Markdown y no todos los artículos se traducen a la vez.
   ========================================================================== */
const cuaderno = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/cuaderno' }),
  schema: ({ image }) =>
    z.object({
      titulo: z.string(),
      /** Titular alternativo para la etiqueta <title>, si conviene acortar. */
      tituloSeo: z.string().optional(),
      descripcion: z.string(),
      lang: z.enum(['es', 'en']).default('es'),
      /** Enlaza con la versión en el otro idioma para el hreflang. */
      traduccion: reference('cuaderno').optional(),
      fecha: z.coerce.date(),
      actualizado: z.coerce.date().optional(),
      categoria: z.string(),
      etiquetas: z.array(z.string()).default([]),
      autor: z.string().default('Unero'),
      destacado: z.boolean().default(false),
      borrador: z.boolean().default(false),
      portada: image(),
      portadaAlt: z.string(),
      /** Pie de foto de la portada. */
      portadaCredito: z.string().optional(),
      /** Proyectos propios que ilustran el artículo (enlazado interno). */
      proyectosRelacionados: z.array(reference('proyectos')).default([]),
    }),
});

/* ==========================================================================
   CATEGORÍAS DEL CUADERNO
   En su propia colección para poder darles título, descripción y portada
   reales: una categoría sin contenido propio es una página vacía para Google.
   ========================================================================== */
const categorias = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/categorias' }),
  schema: z.object({
    nombre: bilingue,
    descripcion: bilingue,
    orden: z.number().default(50),
  }),
});

/* ==========================================================================
   PROPIEDADES (venta y alquiler)
   Línea de negocio existente que se mantiene. El contenido pasa a estar
   en el HTML — antes se generaba con JavaScript y Google no lo veía.
   ========================================================================== */
const propiedades = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/propiedades' }),
  schema: ({ image }) =>
    z.object({
      titulo: bilingue,
      operacion: z.enum(['venta', 'alquiler']),
      estado: z.enum(['disponible', 'vendido', 'reservado', 'alquilado']),
      ubicacion: bilingue,
      orden: z.number().default(50),
      dormitorios: z.number().int().optional(),
      banos: z.number().int().optional(),
      superficie: z.number().positive().optional(),
      parcela: z.number().positive().optional(),
      /** Texto libre: evita publicar cifras que puedan quedar obsoletas. */
      precio: bilingue.optional(),
      resumen: bilingue,
      relato: bilingueLista.optional(),
      caracteristicas: bilingueLista.optional(),
      servicios: bilingueLista.optional(),
      enlaceExterno: z.string().url().optional(),
      portada: image(),
      portadaAlt: bilingue,
      galeria: z
        .array(z.object({ src: image(), alt: bilingue }))
        .default([]),
    }),
});

export const collections = { proyectos, cuaderno, categorias, propiedades };
