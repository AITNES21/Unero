/**
 * Datos únicos de la empresa.
 *
 * Toda la web (schema.org, pies de página, formularios, enlaces "tel:")
 * lee de aquí. Si cambia un teléfono, se cambia en un solo sitio.
 */

export const site = {
  nombre: 'Unero',
  nombreLegal: 'Unero Espacio',
  dominio: 'https://unero.es',

  email: 'eva@unero.es',
  telefonos: [
    { etiqueta: '687 885 319', numero: '+34687885319' },
    { etiqueta: '679 418 741', numero: '+34679418741' },
  ],
  /** WhatsApp: el canal preferido por el cliente internacional en Ibiza. */
  whatsapp: '+34687885319',

  direccion: {
    // PENDIENTE: falta la dirección postal completa. Sin ella no se puede
    // completar el schema LocalBusiness ni verificar el perfil de empresa
    // de Google, que es la mayor palanca de SEO local que hay.
    calle: null as string | null,
    codigoPostal: null as string | null,
    localidad: 'Ibiza',
    provincia: 'Islas Baleares',
    pais: 'ES',
  },
  geo: { lat: 38.9067, lon: 1.4206 },

  horario: {
    dias: 'Mo-Fr',
    apertura: '10:00',
    cierre: '18:00',
  },

  redes: {
    instagram: 'https://www.instagram.com/uneroespacio',
    facebook: 'https://www.facebook.com/uneroespacio',
  },

  /** Endpoint del formulario. Servicio actual: Formspree (plan gratuito). */
  formspree: 'https://formspree.io/f/mqabzkkj',

  analytics: {
    ga4: 'G-FWEK6NDLK0',
  },

  /**
   * Verificación de propiedad en Google Search Console.
   * No se puede quitar: si desaparece, Google revoca el acceso a los
   * datos de la propiedad. Se emite en todas las páginas, no solo en la
   * portada, para que siga valiendo aunque cambie la raíz del sitio.
   */
  verificacionGoogle: '-zFRK5w9iYCfntTVbrIpZU330m3MyEvjgC8OdLPm2x8',

  /** Municipios de Ibiza donde Unero trabaja. Alimenta el SEO local. */
  zonas: [
    'Eivissa',
    'Santa Eulària des Riu',
    'Sant Josep de sa Talaia',
    'Sant Antoni de Portmany',
    'Sant Joan de Labritja',
    'Santa Gertrudis',
    'Jesús',
    'Talamanca',
    'Cala Jondal',
    'Es Cubells',
    'San Lorenzo',
    'Formentera',
  ],
} as const;

export type Idioma = 'es' | 'en';

export const idiomas: Record<Idioma, { etiqueta: string; hreflang: string; ogLocale: string }> = {
  es: { etiqueta: 'Español', hreflang: 'es-ES', ogLocale: 'es_ES' },
  en: { etiqueta: 'English', hreflang: 'en-GB', ogLocale: 'en_GB' },
};

/**
 * Mapa de rutas equivalentes entre idiomas.
 *
 * Las URLs en inglés se traducen (no se dejan en español) porque una URL
 * legible en el idioma del usuario mejora el CTR y es señal de relevancia.
 * Clave = ruta ES sin barras; valor = ruta EN.
 */
export const rutas = {
  home: { es: '/', en: '/en/' },
  proyectos: { es: '/proyectos/', en: '/en/projects/' },
  servicios: { es: '/servicios/', en: '/en/services/' },
  construccion: {
    es: '/servicios/construccion-de-casas-en-ibiza/',
    en: '/en/services/house-construction-ibiza/',
  },
  villas: {
    es: '/servicios/villas-llave-en-mano/',
    en: '/en/services/turnkey-villas/',
  },
  reformas: {
    es: '/servicios/reformas-integrales-en-ibiza/',
    en: '/en/services/full-home-renovation-ibiza/',
  },
  interiorismo: {
    es: '/servicios/interiorismo/',
    en: '/en/services/interior-design/',
  },
  promociones: {
    es: '/servicios/promociones-de-viviendas/',
    en: '/en/services/residential-developments/',
  },
  proceso: { es: '/como-trabajamos/', en: '/en/how-we-work/' },
  estudio: { es: '/estudio/', en: '/en/about/' },
  cuaderno: { es: '/cuaderno/', en: '/en/journal/' },
  propiedades: { es: '/propiedades/', en: '/en/properties/' },
  venta: { es: '/propiedades/venta/', en: '/en/properties/for-sale/' },
  alquiler: { es: '/propiedades/alquiler/', en: '/en/properties/rentals/' },
  trasteros: { es: '/trasteros-mostoles/', en: '/en/storage-units-mostoles/' },
  contacto: { es: '/contacto/', en: '/en/contact/' },
  gracias: { es: '/gracias/', en: '/en/thank-you/' },
  privacidad: { es: '/privacidad/', en: '/en/privacy/' },
  aviso: { es: '/aviso-legal/', en: '/en/legal-notice/' },
  cookies: { es: '/politica-de-cookies/', en: '/en/cookie-policy/' },
} as const;

export type ClaveRuta = keyof typeof rutas;

/** Devuelve la ruta de una página en el idioma pedido. */
export function ruta(clave: ClaveRuta, lang: Idioma = 'es'): string {
  return rutas[clave][lang];
}

/** Prefijo de la ficha de un proyecto. */
export function rutaProyecto(slug: string, lang: Idioma = 'es'): string {
  return `${rutas.proyectos[lang]}${slug}/`;
}

/** Prefijo de un artículo del Cuaderno. */
export function rutaArticulo(slug: string, lang: Idioma = 'es'): string {
  return `${rutas.cuaderno[lang]}${slug}/`;
}

/** Prefijo de una categoría del Cuaderno. */
export function rutaCategoria(slug: string, lang: Idioma = 'es'): string {
  return lang === 'es'
    ? `/cuaderno/tema/${slug}/`
    : `/en/journal/topic/${slug}/`;
}
