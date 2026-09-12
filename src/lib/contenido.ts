import { getCollection, getEntry, type CollectionEntry } from 'astro:content';
import type { Idioma } from '../config/site';

/**
 * Acceso al contenido.
 *
 * Centraliza tres cosas que de otro modo se repetirían en cada página:
 * la lectura de campos bilingües con caída al español, el orden del
 * catálogo y el filtrado de borradores.
 */

/** Devuelve el idioma pedido y, si no existe, el español. */
export function bi(
  campo: { es: string; en?: string } | undefined,
  lang: Idioma
): string | undefined {
  if (!campo) return undefined;
  return (lang === 'en' ? campo.en : campo.es) || campo.es;
}

export function biLista(
  campo: { es: string[]; en?: string[] } | undefined,
  lang: Idioma
): string[] {
  if (!campo) return [];
  const valor = lang === 'en' ? campo.en : campo.es;
  return (valor && valor.length ? valor : campo.es) ?? [];
}

/* ==========================================================================
   Proyectos
   ========================================================================== */
export type Proyecto = CollectionEntry<'proyectos'>;

export async function todosLosProyectos(): Promise<Proyecto[]> {
  const proyectos = await getCollection('proyectos');
  return proyectos.sort((a, b) => a.data.orden - b.data.orden);
}

export async function proyectosDestacados(limite = 3): Promise<Proyecto[]> {
  const proyectos = await todosLosProyectos();
  const destacados = proyectos.filter((p) => p.data.destacado);
  // Si nadie ha marcado destacados, se muestran los primeros por orden:
  // la portada nunca se queda vacía por un descuido de contenido.
  return (destacados.length ? destacados : proyectos).slice(0, limite);
}

/** Vecinos en el catálogo, para navegar entre fichas de forma circular. */
export async function vecinosDeProyecto(id: string) {
  const proyectos = await todosLosProyectos();
  const i = proyectos.findIndex((p) => p.id === id);
  if (i === -1) return { anterior: undefined, siguiente: undefined };
  return {
    anterior: proyectos[(i - 1 + proyectos.length) % proyectos.length],
    siguiente: proyectos[(i + 1) % proyectos.length],
  };
}

const ETIQUETAS_TIPO = {
  'obra-nueva': { es: 'Obra nueva', en: 'New build' },
  reforma: { es: 'Reforma integral', en: 'Full renovation' },
  interiorismo: { es: 'Interiorismo', en: 'Interior design' },
  promocion: { es: 'Promoción', en: 'Development' },
} as const;

export function etiquetaTipo(tipo: keyof typeof ETIQUETAS_TIPO, lang: Idioma) {
  return ETIQUETAS_TIPO[tipo][lang] ?? ETIQUETAS_TIPO[tipo].es;
}

const ETIQUETAS_ESTADO = {
  terminado: { es: 'Terminado', en: 'Completed' },
  'en-obra': { es: 'En obra', en: 'On site' },
  vendido: { es: 'Vendida', en: 'Sold' },
  disponible: { es: 'Disponible', en: 'Available' },
} as const;

export function etiquetaEstado(
  estado: keyof typeof ETIQUETAS_ESTADO | undefined,
  lang: Idioma
) {
  if (!estado) return undefined;
  return ETIQUETAS_ESTADO[estado][lang] ?? ETIQUETAS_ESTADO[estado].es;
}

const ETIQUETAS_SERVICIO = {
  construccion: { es: 'Construcción', en: 'Construction' },
  'reforma-integral': { es: 'Reforma integral', en: 'Full renovation' },
  interiorismo: { es: 'Interiorismo', en: 'Interior design' },
  'gestion-licencias': { es: 'Gestión de licencias', en: 'Permit management' },
  'direccion-obra': { es: 'Dirección de obra', en: 'Site management' },
  piscina: { es: 'Piscina', en: 'Pool' },
  paisajismo: { es: 'Paisajismo', en: 'Landscaping' },
  domotica: { es: 'Domótica', en: 'Home automation' },
  promocion: { es: 'Promoción', en: 'Development' },
} as const;

export function etiquetaServicio(
  servicio: keyof typeof ETIQUETAS_SERVICIO,
  lang: Idioma
) {
  return ETIQUETAS_SERVICIO[servicio][lang] ?? ETIQUETAS_SERVICIO[servicio].es;
}

export function etiquetaZona(zona: 'ibiza' | 'peninsula' | undefined, lang: Idioma) {
  if (!zona) return undefined;
  if (zona === 'ibiza') return 'Ibiza';
  return lang === 'es' ? 'Península' : 'Mainland Spain';
}

/* ==========================================================================
   Cuaderno
   ========================================================================== */
export type Articulo = CollectionEntry<'cuaderno'>;

/** Artículos publicados del idioma pedido, del más reciente al más antiguo. */
export async function articulos(lang: Idioma): Promise<Articulo[]> {
  const todos = await getCollection('cuaderno');
  return todos
    .filter((a) => a.data.lang === lang && !a.data.borrador)
    .sort((a, b) => b.data.fecha.valueOf() - a.data.fecha.valueOf());
}

export async function articulosDeCategoria(categoria: string, lang: Idioma) {
  return (await articulos(lang)).filter((a) => a.data.categoria === categoria);
}

/**
 * Artículos relacionados: primero los de la misma categoría, y si no
 * llegan, se completa con los más recientes. Evita dejar el bloque a
 * medias cuando una categoría solo tiene una entrada.
 */
export async function articulosRelacionados(
  actual: Articulo,
  limite = 3
): Promise<Articulo[]> {
  const todos = (await articulos(actual.data.lang)).filter((a) => a.id !== actual.id);
  const mismaCategoria = todos.filter(
    (a) => a.data.categoria === actual.data.categoria
  );
  const resto = todos.filter((a) => a.data.categoria !== actual.data.categoria);
  return [...mismaCategoria, ...resto].slice(0, limite);
}

/**
 * Minutos de lectura. 200 palabras por minuto es la referencia
 * habitual para texto divulgativo en español.
 */
export function minutosDeLectura(cuerpo: string | undefined): number {
  if (!cuerpo) return 1;
  const palabras = cuerpo.trim().split(/\s+/).length;
  return Math.max(1, Math.round(palabras / 200));
}

export async function categorias() {
  const todas = await getCollection('categorias');
  return todas.sort((a, b) => a.data.orden - b.data.orden);
}

export async function categoriaPorId(id: string) {
  return getEntry('categorias', id);
}

/** Solo las categorías que tienen al menos un artículo en ese idioma. */
export async function categoriasConContenido(lang: Idioma) {
  const [todas, publicados] = await Promise.all([categorias(), articulos(lang)]);
  const usadas = new Set(publicados.map((a) => a.data.categoria));
  return todas
    .filter((c) => usadas.has(c.id))
    .map((c) => ({
      ...c,
      total: publicados.filter((a) => a.data.categoria === c.id).length,
    }));
}

/* ==========================================================================
   Propiedades
   ========================================================================== */
export type Propiedad = CollectionEntry<'propiedades'>;

export async function propiedades(
  operacion?: 'venta' | 'alquiler'
): Promise<Propiedad[]> {
  const todas = await getCollection('propiedades');
  return todas
    .filter((p) => !operacion || p.data.operacion === operacion)
    .sort((a, b) => {
      // Las disponibles primero; dentro de cada grupo, por orden.
      const libre = (p: Propiedad) =>
        p.data.estado === 'disponible' ? 0 : 1;
      return libre(a) - libre(b) || a.data.orden - b.data.orden;
    });
}

const ETIQUETAS_ESTADO_PROP = {
  disponible: { es: 'Disponible', en: 'Available' },
  vendido: { es: 'Vendida', en: 'Sold' },
  reservado: { es: 'Reservada', en: 'Reserved' },
  alquilado: { es: 'Alquilada', en: 'Let' },
} as const;

export function etiquetaEstadoPropiedad(
  estado: keyof typeof ETIQUETAS_ESTADO_PROP,
  lang: Idioma
) {
  return ETIQUETAS_ESTADO_PROP[estado][lang] ?? ETIQUETAS_ESTADO_PROP[estado].es;
}
