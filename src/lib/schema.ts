import { site, type Idioma, ruta } from '../config/site';

/**
 * Datos estructurados (JSON-LD).
 *
 * Todo cuelga de un único nodo @id para la empresa, de modo que Google
 * entienda que Organization, LocalBusiness y el autor de los artículos
 * son la misma entidad. La web anterior repetía el bloque en cada página
 * con URLs distintas (unero.es y aitnes21.github.io), lo que fragmentaba
 * la entidad.
 */

const ID_EMPRESA = `${site.dominio}/#unero`;
const ID_WEB = `${site.dominio}/#website`;

function url(path: string) {
  return new URL(path, site.dominio).href;
}

/** Nodo raíz: la empresa. Se incluye en todas las páginas. */
export function empresa(lang: Idioma) {
  const descripcion =
    lang === 'es'
      ? 'Constructora en Ibiza especializada en obra nueva de villas, reformas integrales e interiorismo. Construcción llave en mano con dirección propia de obra.'
      : 'Construction company in Ibiza specialising in new-build villas, full renovations and interior design. Turnkey construction with in-house site management.';

  return {
    '@type': ['GeneralContractor', 'LocalBusiness'],
    '@id': ID_EMPRESA,
    name: site.nombreLegal,
    alternateName: site.nombre,
    description: descripcion,
    url: url(ruta('home', lang)),
    image: url('/og/unero-portada.jpg'),
    logo: {
      '@type': 'ImageObject',
      url: url('/unero-logo.svg'),
    },
    email: site.email,
    telephone: site.telefonos[0].numero,
    address: {
      '@type': 'PostalAddress',
      ...(site.direccion.calle ? { streetAddress: site.direccion.calle } : {}),
      ...(site.direccion.codigoPostal
        ? { postalCode: site.direccion.codigoPostal }
        : {}),
      addressLocality: site.direccion.localidad,
      addressRegion: site.direccion.provincia,
      addressCountry: site.direccion.pais,
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: site.geo.lat,
      longitude: site.geo.lon,
    },
    /** Radio de servicio: la isla y Formentera. */
    areaServed: [
      { '@type': 'AdministrativeArea', name: 'Ibiza' },
      { '@type': 'AdministrativeArea', name: 'Formentera' },
      ...site.zonas.slice(0, 8).map((z) => ({ '@type': 'Place', name: z })),
    ],
    openingHoursSpecification: {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
      opens: site.horario.apertura,
      closes: site.horario.cierre,
    },
    priceRange: '€€€',
    currenciesAccepted: 'EUR',
    knowsLanguage: ['es-ES', 'en-GB'],
    sameAs: [site.redes.instagram, site.redes.facebook],
  };
}

/** Nodo del sitio web. */
export function webSite(lang: Idioma) {
  return {
    '@type': 'WebSite',
    '@id': ID_WEB,
    url: url(ruta('home', lang)),
    name: site.nombre,
    inLanguage: lang === 'es' ? 'es-ES' : 'en-GB',
    publisher: { '@id': ID_EMPRESA },
  };
}

export interface Miga {
  nombre: string;
  href: string;
}

/** Migas de pan. Google las usa para la ruta que muestra en los resultados. */
export function migas(items: Miga[]) {
  return {
    '@type': 'BreadcrumbList',
    itemListElement: items.map((m, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: m.nombre,
      item: url(m.href),
    })),
  };
}

interface ArticuloArgs {
  titulo: string;
  descripcion: string;
  urlCanonica: string;
  imagen: string;
  publicado: Date;
  actualizado?: Date;
  autor: string;
  seccion: string;
  lang: Idioma;
}

export function articulo(a: ArticuloArgs) {
  return {
    '@type': 'BlogPosting',
    headline: a.titulo.slice(0, 110),
    description: a.descripcion,
    image: [a.imagen],
    datePublished: a.publicado.toISOString(),
    dateModified: (a.actualizado ?? a.publicado).toISOString(),
    author: { '@type': 'Organization', name: a.autor, '@id': ID_EMPRESA },
    publisher: { '@id': ID_EMPRESA },
    mainEntityOfPage: { '@type': 'WebPage', '@id': a.urlCanonica },
    articleSection: a.seccion,
    inLanguage: a.lang === 'es' ? 'es-ES' : 'en-GB',
    isAccessibleForFree: true,
  };
}

interface ServicioArgs {
  nombre: string;
  descripcion: string;
  urlCanonica: string;
  lang: Idioma;
}

export function servicio(s: ServicioArgs) {
  return {
    '@type': 'Service',
    name: s.nombre,
    description: s.descripcion,
    serviceType: s.nombre,
    provider: { '@id': ID_EMPRESA },
    areaServed: [
      { '@type': 'AdministrativeArea', name: 'Ibiza' },
      { '@type': 'AdministrativeArea', name: 'Formentera' },
    ],
    url: s.urlCanonica,
    availableLanguage: ['es', 'en'],
  };
}

/**
 * Un proyecto terminado se modela como CreativeWork.
 * No usamos Product ni Offer: no está en venta y marcarlo así puede
 * generar avisos de datos estructurados en Search Console.
 */
interface ProyectoArgs {
  titulo: string;
  descripcion: string;
  urlCanonica: string;
  imagenes: string[];
  ubicacion?: string;
  ano?: number;
  lang: Idioma;
}

export function proyecto(p: ProyectoArgs) {
  return {
    '@type': 'CreativeWork',
    name: p.titulo,
    description: p.descripcion,
    image: p.imagenes,
    url: p.urlCanonica,
    creator: { '@id': ID_EMPRESA },
    inLanguage: p.lang === 'es' ? 'es-ES' : 'en-GB',
    ...(p.ano ? { dateCreated: String(p.ano) } : {}),
    ...(p.ubicacion
      ? { locationCreated: { '@type': 'Place', name: p.ubicacion } }
      : {}),
  };
}

export interface ParPregunta {
  pregunta: string;
  respuesta: string;
}

/** FAQPage: candidata a fragmento enriquecido en Google. */
export function faq(pares: ParPregunta[]) {
  return {
    '@type': 'FAQPage',
    mainEntity: pares.map((p) => ({
      '@type': 'Question',
      name: p.pregunta,
      acceptedAnswer: { '@type': 'Answer', text: p.respuesta },
    })),
  };
}

/** Envuelve los nodos en un único @graph. */
export function grafo(nodos: unknown[]) {
  return JSON.stringify(
    { '@context': 'https://schema.org', '@graph': nodos.filter(Boolean) },
    null,
    0
  );
}
