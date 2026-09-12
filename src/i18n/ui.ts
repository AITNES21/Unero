import type { Idioma } from '../config/site';

/**
 * Micro-copy compartido por toda la interfaz.
 *
 * Las páginas se escriben una sola vez como componente y reciben `lang`.
 * Así ES y EN no pueden desincronizarse estructuralmente: solo cambia
 * el texto, nunca la maquetación ni el marcado semántico.
 */
export const ui = {
  es: {
    // --- Navegación ---
    'nav.proyectos': 'Proyectos',
    'nav.servicios': 'Servicios',
    'nav.proceso': 'Cómo trabajamos',
    'nav.estudio': 'Estudio',
    'nav.cuaderno': 'Cuaderno',
    'nav.propiedades': 'Propiedades',
    'nav.contacto': 'Contacto',
    'nav.menu': 'Menú',
    'nav.abrirMenu': 'Abrir el menú de navegación',
    'nav.cerrarMenu': 'Cerrar el menú de navegación',
    'nav.idioma': 'Idioma',
    'nav.cambiarIdioma': 'Ver esta página en inglés',
    'nav.inicio': 'Inicio',
    'nav.saltar': 'Saltar al contenido principal',

    // --- Acciones ---
    'cta.proyecto': 'Cuéntanos tu proyecto',
    'cta.proyectoCorto': 'Tu proyecto',
    'cta.verProyectos': 'Ver los proyectos',
    'cta.verTodos': 'Ver todos los proyectos',
    'cta.verFicha': 'Ver el proyecto',
    'cta.hablemos': 'Hablemos de tu proyecto',
    'cta.presupuesto': 'Solicitar presupuesto',
    'cta.saberMas': 'Saber más',
    'cta.leer': 'Leer',
    'cta.llamar': 'Llamar',
    'cta.escribir': 'Escribir',
    'cta.whatsapp': 'WhatsApp',
    'cta.email': 'Enviar un email',
    'cta.volver': 'Volver',

    // --- Proyectos ---
    'proy.ficha': 'Ficha técnica',
    'proy.ubicacion': 'Ubicación',
    'proy.tipo': 'Tipo de proyecto',
    'proy.ano': 'Año',
    'proy.superficie': 'Superficie',
    'proy.parcela': 'Parcela',
    'proy.servicios': 'Servicios realizados',
    'proy.arquitectura': 'Arquitectura',
    'proy.estado': 'Estado',
    'proy.galeria': 'Galería del proyecto',
    'proy.siguiente': 'Siguiente proyecto',
    'proy.anterior': 'Proyecto anterior',
    'proy.todos': 'Todos',
    'proy.filtrar': 'Filtrar proyectos por tipo',
    'proy.sinResultados': 'No hay proyectos en esta categoría todavía.',
    'proy.detalles': 'Detalles constructivos',
    'proy.obra': 'La obra',
    'proy.verObra': 'Ver el vídeo de obra',
    'proy.docs': 'Documentación',

    // --- Galería / lightbox ---
    'gal.abrir': 'Ampliar la imagen',
    'gal.cerrar': 'Cerrar la galería',
    'gal.siguiente': 'Imagen siguiente',
    'gal.anterior': 'Imagen anterior',
    'gal.contador': 'Imagen {n} de {total}',

    // --- Cuaderno ---
    'cua.temas': 'Temas',
    'cua.tema': 'Tema',
    'cua.lectura': 'min de lectura',
    'cua.publicado': 'Publicado el',
    'cua.actualizado': 'Actualizado el',
    'cua.relacionados': 'Seguir leyendo',
    'cua.todos': 'Todos los artículos',
    'cua.destacado': 'Destacado',
    'cua.vacio': 'Todavía no hay artículos en este tema.',
    'cua.indice': 'En este artículo',

    // --- Formulario ---
    'form.nombre': 'Nombre y apellidos',
    'form.email': 'Email',
    'form.telefono': 'Teléfono',
    'form.tipo': 'Qué necesitas',
    'form.tipoObraNueva': 'Construir una casa nueva',
    'form.tipoReforma': 'Reformar una vivienda',
    'form.tipoInteriorismo': 'Interiorismo y amueblamiento',
    'form.tipoPromocion': 'Promoción de viviendas',
    'form.tipoOtro': 'Otra cosa',
    'form.ubicacion': 'Zona de la isla',
    'form.ubicacionAyuda': 'Municipio o zona aproximada. Si aún no tienes parcela, indícalo.',
    'form.fase': 'En qué punto estás',
    'form.faseIdea': 'Solo es una idea',
    'form.faseParcela': 'Tengo parcela o vivienda',
    'form.faseProyecto': 'Tengo proyecto de arquitectura',
    'form.faseLicencia': 'Tengo licencia concedida',
    'form.presupuesto': 'Presupuesto orientativo',
    'form.presupuestoSinDefinir': 'Todavía no lo sé',
    'form.mensaje': 'Cuéntanos tu proyecto',
    'form.mensajeAyuda': 'Cuanto más nos cuentes, más concreta será nuestra respuesta.',
    'form.opcional': 'opcional',
    'form.enviar': 'Enviar',
    'form.enviando': 'Enviando…',
    'form.privacidad':
      'He leído y acepto la <a href="/privacidad/">política de privacidad</a>.',
    'form.errorObligatorio': 'Este campo es obligatorio.',
    'form.errorEmail': 'Revisa el email: parece que falta algo.',
    'form.errorTelefono': 'Revisa el teléfono.',
    'form.errorPrivacidad': 'Necesitamos tu consentimiento para poder responderte.',
    'form.errorEnvio':
      'No hemos podido enviar el mensaje. Escríbenos a {email} y lo resolvemos.',
    'form.elige': 'Selecciona una opción',

    // --- Pie ---
    'pie.contacto': 'Contacto',
    'pie.navegar': 'Navegar',
    'pie.servicios': 'Servicios',
    'pie.legal': 'Legal',
    'pie.horario': 'Horario',
    'pie.lunesViernes': 'Lunes a viernes',
    'pie.sabadoDomingo': 'Sábado y domingo',
    'pie.cerrado': 'Cerrado',
    'pie.zonas': 'Dónde trabajamos',
    'pie.derechos': 'Todos los derechos reservados.',
    'pie.hechaPor': 'Hecha con pasión por',
    'pie.siguenos': 'Síguenos',

    // --- Cookies ---
    'ck.titulo': 'Cookies',
    'ck.texto':
      'Usamos cookies propias para que la web funcione y cookies de análisis para entender qué contenido resulta útil. Puedes aceptarlas, rechazarlas o elegir.',
    'ck.aceptar': 'Aceptar todas',
    'ck.rechazar': 'Solo las necesarias',
    'ck.config': 'Configurar',
    'ck.guardar': 'Guardar selección',
    'ck.necesarias': 'Necesarias',
    'ck.necesariasDesc':
      'Imprescindibles para que la web funcione. No se pueden desactivar.',
    'ck.analiticas': 'Analíticas',
    'ck.analiticasDesc':
      'Google Analytics, de forma anónima, para saber qué páginas interesan.',
    'ck.mas': 'Más información',

    // --- Varios ---
    'gen.migas': 'Ruta de navegación',
    'gen.error404': 'Esta página no existe',
    'gen.error404texto':
      'Puede que hayamos movido el contenido al renovar la web. Estos son los caminos más transitados:',
    'gen.pendiente': 'Próximamente',
    'gen.vendido': 'Vendida',
    'gen.disponible': 'Disponible',
    'gen.enObra': 'En obra',
    'gen.terminado': 'Terminado',
  },

  en: {
    // --- Navigation ---
    'nav.proyectos': 'Projects',
    'nav.servicios': 'Services',
    'nav.proceso': 'How we work',
    'nav.estudio': 'Studio',
    'nav.cuaderno': 'Journal',
    'nav.propiedades': 'Properties',
    'nav.contacto': 'Contact',
    'nav.menu': 'Menu',
    'nav.abrirMenu': 'Open the navigation menu',
    'nav.cerrarMenu': 'Close the navigation menu',
    'nav.idioma': 'Language',
    'nav.cambiarIdioma': 'View this page in Spanish',
    'nav.inicio': 'Home',
    'nav.saltar': 'Skip to main content',

    // --- Actions ---
    'cta.proyecto': 'Tell us about your project',
    'cta.proyectoCorto': 'Your project',
    'cta.verProyectos': 'See the projects',
    'cta.verTodos': 'See all projects',
    'cta.verFicha': 'View project',
    'cta.hablemos': "Let's talk about your project",
    'cta.presupuesto': 'Request a quote',
    'cta.saberMas': 'Find out more',
    'cta.leer': 'Read',
    'cta.llamar': 'Call',
    'cta.escribir': 'Write',
    'cta.whatsapp': 'WhatsApp',
    'cta.email': 'Send an email',
    'cta.volver': 'Back',

    // --- Projects ---
    'proy.ficha': 'Project facts',
    'proy.ubicacion': 'Location',
    'proy.tipo': 'Project type',
    'proy.ano': 'Year',
    'proy.superficie': 'Built area',
    'proy.parcela': 'Plot',
    'proy.servicios': 'Scope of work',
    'proy.arquitectura': 'Architecture',
    'proy.estado': 'Status',
    'proy.galeria': 'Project gallery',
    'proy.siguiente': 'Next project',
    'proy.anterior': 'Previous project',
    'proy.todos': 'All',
    'proy.filtrar': 'Filter projects by type',
    'proy.sinResultados': 'No projects in this category yet.',
    'proy.detalles': 'Construction details',
    'proy.obra': 'On site',
    'proy.verObra': 'Watch the site video',
    'proy.docs': 'Documentation',

    // --- Gallery / lightbox ---
    'gal.abrir': 'Enlarge image',
    'gal.cerrar': 'Close the gallery',
    'gal.siguiente': 'Next image',
    'gal.anterior': 'Previous image',
    'gal.contador': 'Image {n} of {total}',

    // --- Journal ---
    'cua.temas': 'Topics',
    'cua.tema': 'Topic',
    'cua.lectura': 'min read',
    'cua.publicado': 'Published on',
    'cua.actualizado': 'Updated on',
    'cua.relacionados': 'Keep reading',
    'cua.todos': 'All articles',
    'cua.destacado': 'Featured',
    'cua.vacio': 'No articles in this topic yet.',
    'cua.indice': 'In this article',

    // --- Form ---
    'form.nombre': 'Full name',
    'form.email': 'Email',
    'form.telefono': 'Phone',
    'form.tipo': 'What do you need',
    'form.tipoObraNueva': 'Build a new house',
    'form.tipoReforma': 'Renovate a property',
    'form.tipoInteriorismo': 'Interior design and furnishing',
    'form.tipoPromocion': 'Residential development',
    'form.tipoOtro': 'Something else',
    'form.ubicacion': 'Area of the island',
    'form.ubicacionAyuda':
      "Municipality or rough area. If you don't have a plot yet, just say so.",
    'form.fase': 'Where you are now',
    'form.faseIdea': "It's just an idea",
    'form.faseParcela': 'I have a plot or a property',
    'form.faseProyecto': 'I have an architectural design',
    'form.faseLicencia': 'I have planning permission',
    'form.presupuesto': 'Indicative budget',
    'form.presupuestoSinDefinir': "I don't know yet",
    'form.mensaje': 'Tell us about your project',
    'form.mensajeAyuda': 'The more you tell us, the more specific our answer can be.',
    'form.opcional': 'optional',
    'form.enviar': 'Send',
    'form.enviando': 'Sending…',
    'form.privacidad':
      'I have read and accept the <a href="/en/privacy/">privacy policy</a>.',
    'form.errorObligatorio': 'This field is required.',
    'form.errorEmail': 'Please check the email address.',
    'form.errorTelefono': 'Please check the phone number.',
    'form.errorPrivacidad': 'We need your consent in order to reply.',
    'form.errorEnvio':
      "We couldn't send your message. Email us at {email} and we'll sort it out.",
    'form.elige': 'Select an option',

    // --- Footer ---
    'pie.contacto': 'Contact',
    'pie.navegar': 'Navigate',
    'pie.servicios': 'Services',
    'pie.legal': 'Legal',
    'pie.horario': 'Opening hours',
    'pie.lunesViernes': 'Monday to Friday',
    'pie.sabadoDomingo': 'Saturday and Sunday',
    'pie.cerrado': 'Closed',
    'pie.zonas': 'Where we work',
    'pie.derechos': 'All rights reserved.',
    'pie.hechaPor': 'Made with passion by',
    'pie.siguenos': 'Follow us',

    // --- Cookies ---
    'ck.titulo': 'Cookies',
    'ck.texto':
      'We use our own cookies to make the site work and analytics cookies to understand which content is useful. You can accept, reject or choose.',
    'ck.aceptar': 'Accept all',
    'ck.rechazar': 'Essential only',
    'ck.config': 'Customise',
    'ck.guardar': 'Save choices',
    'ck.necesarias': 'Essential',
    'ck.necesariasDesc': 'Required for the site to work. These cannot be switched off.',
    'ck.analiticas': 'Analytics',
    'ck.analiticasDesc':
      'Google Analytics, anonymously, so we know which pages are of interest.',
    'ck.mas': 'More information',

    // --- Misc ---
    'gen.migas': 'Breadcrumb',
    'gen.error404': 'This page does not exist',
    'gen.error404texto':
      'We may have moved the content while rebuilding the site. These are the most travelled paths:',
    'gen.pendiente': 'Coming soon',
    'gen.vendido': 'Sold',
    'gen.disponible': 'Available',
    'gen.enObra': 'Under construction',
    'gen.terminado': 'Completed',
  },
} as const;

export type ClaveUI = keyof typeof ui.es;

/** Devuelve una función de traducción para el idioma dado. */
export function useT(lang: Idioma) {
  return function t(clave: ClaveUI, vars?: Record<string, string | number>): string {
    const dict = ui[lang] as Record<string, string>;
    let texto = dict[clave] ?? (ui.es as Record<string, string>)[clave] ?? clave;
    if (vars) {
      for (const [k, v] of Object.entries(vars)) {
        texto = texto.replaceAll(`{${k}}`, String(v));
      }
    }
    return texto;
  };
}

/** Formatea una fecha en el idioma correspondiente. */
export function fecha(d: Date, lang: Idioma): string {
  return new Intl.DateTimeFormat(lang === 'es' ? 'es-ES' : 'en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(d);
}

/** Formatea un número con separadores locales (superficies, precios). */
export function numero(n: number, lang: Idioma): string {
  return new Intl.NumberFormat(lang === 'es' ? 'es-ES' : 'en-GB').format(n);
}
