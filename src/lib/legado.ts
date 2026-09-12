import { site } from '../config/site';

/**
 * Redirecciones de la web v1.
 *
 * La versión anterior servía HTML plano en la raíz (`/portafolio.html`,
 * `/cancana.html`…). Esas URLs pueden estar indexadas, enlazadas desde
 * fuera o guardadas en marcadores, así que ninguna puede devolver 404:
 * cada una apunta a su equivalente en la estructura nueva.
 *
 * GitHub Pages no permite redirecciones 301 del servidor, de modo que se
 * emite una página mínima con `<meta http-equiv="refresh">` a 0 segundos
 * más un `<link rel="canonical">` al destino. Google trata ese patrón
 * como una redirección permanente y traslada la autoridad.
 */
export const REDIRECCIONES: Record<string, string> = {
  // Índices y páginas de servicio
  portafolio: '/proyectos/',
  construccion: '/servicios/construccion-de-casas-en-ibiza/',
  reformasintegrales: '/servicios/reformas-integrales-en-ibiza/',
  disenodeinteriores: '/servicios/interiorismo/',
  viviendasindividuales: '/servicios/villas-llave-en-mano/',
  promocionesdeviviendas: '/servicios/promociones-de-viviendas/',
  alquiler: '/propiedades/alquiler/',
  'trasteros-mostoles': '/trasteros-mostoles/',
  Paginaagradecimiento: '/gracias/',

  // Fichas de proyecto
  cancana: '/proyectos/can-cana/',
  canflowers: '/proyectos/can-flowers/',
  sestorres2: '/proyectos/ses-torres-ii/',
  talamanca: '/proyectos/talamanca/',
  alina: '/proyectos/alina/',
  marbella: '/proyectos/marbella/',
  boadilla: '/proyectos/boadilla/',
  // La web anterior servía esta URL con la A en mayúscula.
  'vista-Alegre': '/proyectos/vista-alegre/',
  'vista-alegre': '/proyectos/vista-alegre/',
  medem: '/proyectos/marbella/',
};

/** Equivalentes de la versión inglesa heredada, bajo /en/. */
export const REDIRECCIONES_EN: Record<string, string> = {
  construccion: '/en/services/house-construction-ibiza/',
  reformasintegrales: '/en/services/full-home-renovation-ibiza/',
  disenodeinteriores: '/en/services/interior-design/',
  viviendasindividuales: '/en/services/turnkey-villas/',
  promocionesdeviviendas: '/en/services/residential-developments/',
  medem: '/en/projects/marbella/',
};

/** HTML de la página puente. */
export function paginaDeRedireccion(destino: string): string {
  const absoluta = new URL(destino, site.dominio).href;
  return `<!doctype html>
<html lang="es">
<head>
<meta charset="utf-8">
<meta http-equiv="refresh" content="0; url=${destino}">
<link rel="canonical" href="${absoluta}">
<meta name="robots" content="noindex, follow">
<title>Esta página se ha movido — Unero</title>
<style>
  body{margin:0;min-height:100vh;display:grid;place-items:center;
       background:#f7f4ee;color:#17181a;text-align:center;padding:2rem;
       font:400 1rem/1.6 -apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif}
  a{color:#24443e;text-underline-offset:.2em}
</style>
</head>
<body>
<p>Esta página se ha movido.<br><a href="${destino}">Continuar a la nueva dirección</a></p>
<script>location.replace(${JSON.stringify(destino)});</script>
</body>
</html>
`;
}
