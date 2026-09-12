# unero.es

Web de Unero Espacio, constructora en Ibiza. Sitio estático bilingüe
(español e inglés) construido con [Astro](https://astro.build) y publicado
en GitHub Pages sobre el dominio `unero.es`.

---

## Poner en marcha

Requisitos: **Node 22 o superior**. Para regenerar iconos e imágenes
sociales hace falta además **Python 3** con Pillow (`pip install pillow`).

```bash
npm install
npm run dev      # http://localhost:4321
npm run build    # genera dist/
npm run preview  # sirve dist/
```

## Comandos

| Comando | Qué hace |
| --- | --- |
| `npm run dev` | Servidor de desarrollo con recarga en caliente |
| `npm run build` | Construye el sitio en `dist/` |
| `npm run auditar` | Enlaces roto, metadatos duplicados, `alt`, jerarquía de encabezados, cobertura del sitemap |
| `npm run accesibilidad` | axe-core (WCAG 2.1 AA) + pruebas de teclado del menú, la galería y el formulario |
| `npm run medir` | Core Web Vitals y peso por página con red y CPU limitadas |
| `npm run capturas` | Capturas en móvil, tableta y escritorio en `.capturas/` |
| `npm run nitidez` | Detecta fotografías que el navegador tiene que ampliar |
| `npm run sin-js` | Verifica que el contenido siga accesible sin JavaScript |
| `npm run revisar` | Los cuatro anteriores, en orden |
| `npm run frontmatter` | Entrecomilla los valores de YAML que rompen el build (ver más abajo) |
| `npm run iconos` | Regenera favicons e imágenes Open Graph |

`npm run auditar` también se ejecuta en el despliegue: si falla, la web
**no se publica**. Es más barato romper el build que la web.

---

## Estructura

```
src/
├─ assets/              Fotografías. Astro las redimensiona en el build.
│  ├─ proyectos/<slug>/  Una carpeta por proyecto
│  ├─ site/              Imágenes de uso general
│  └─ subidas/           Destino de lo que se sube desde el CMS
├─ components/
│  ├─ paginas/           Un componente por tipo de página, con `lang`
│  └─ *.astro            Piezas reutilizables (cabecera, galería, formulario…)
├─ config/
│  ├─ site.ts            Datos de la empresa y mapa de rutas ES/EN
│  ├─ servicios.ts       Contenido de las cinco páginas de servicio
│  └─ legal.ts           Aviso legal, privacidad y cookies
├─ content/              Contenido editable (Markdown)
│  ├─ proyectos/         Fichas de obra, bilingües
│  ├─ cuaderno/          Artículos, un fichero por idioma
│  ├─ categorias/        Temas del Cuaderno
│  └─ propiedades/       Venta y alquiler
├─ i18n/ui.ts            Micro-copy de la interfaz en los dos idiomas
├─ layouts/Base.astro    Esqueleto común
├─ lib/                  Consultas de contenido, schema.org, redirecciones
├─ pages/                Rutas. Cada fichero es una URL.
└─ styles/               tokens.css (sistema de diseño) + global.css
```

### Por qué las páginas están así organizadas

Cada página se escribe **una sola vez** como componente en
`src/components/paginas/` y recibe el idioma como propiedad. Las rutas de
`src/pages/` son envoltorios de tres líneas:

```astro
---
import Home from '../components/paginas/Home.astro';
---
<Home lang="es" />
```

Así el español y el inglés no pueden desincronizarse estructuralmente: solo
cambia el texto, nunca la maquetación ni el marcado semántico. El precio es
una indirección; la alternativa era mantener dos copias de cada plantilla.

---

## Publicar contenido

### Con el CMS (recomendado, sin tocar código)

1. Entrar en **[app.pagescms.org](https://app.pagescms.org)** con la cuenta
   de GitHub.
2. Dar acceso al repositorio `AITNES21/unero`.
3. Editar proyectos, artículos y propiedades desde formularios.

Cada guardado hace un commit y dispara el despliegue. La web se actualiza en
dos o tres minutos. La configuración del panel está en
[`.pages.yml`](.pages.yml).

### A mano

Crear un `.md` en la carpeta correspondiente de `src/content/`. Los campos
disponibles están definidos —con sus comentarios— en
[`src/content.config.ts`](src/content.config.ts).

> **Atajo útil:** si al construir aparece un error de YAML del tipo
> *«bad indentation of a mapping entry»*, casi siempre es un texto con dos
> puntos seguidos de espacio sin entrecomillar («Aquí no hay plafones: hay
> cornisas»). `npm run frontmatter` lo arregla solo.

### Añadir un proyecto

1. Crear `src/assets/proyectos/<slug>/` con las fotografías en WebP.
2. Crear `src/content/proyectos/<slug>.md`.
3. Rellenar `titulo`, `tipo`, `resumen`, `portada` y `portadaAlt`. El resto
   es opcional: **un campo vacío no se muestra**, así que es mejor dejarlo
   en blanco que rellenarlo a ojo.
4. `orden` decide la posición en el catálogo. `destacado: true` lo saca en
   la portada.

### Añadir un artículo

Un fichero por idioma en `src/content/cuaderno/`. Para que el `hreflang`
funcione, cada versión debe apuntar a la otra con `traduccion:`.
`borrador: true` lo mantiene fuera de la web.

---

## Decisiones técnicas y su motivo

**Astro con salida estática.** No hay servidor que mantener ni que pueda
caerse. GitHub Pages sirve ficheros y el dominio ya estaba configurado ahí.

**Fotografías en `src/assets/`, no en `public/`.** Astro solo optimiza lo
que pasa por su canalización: genera varios tamaños y escribe el `srcset`.
Una imagen en `public/` se sirve tal cual, y una foto de 4 MB llegaría
entera al móvil del visitante.

**Tipografías autoalojadas.** Instrument Serif e Inter se sirven desde
`public/fonts/`. Elimina una conexión a Google Fonts —mejor LCP— y evita
transferir la IP del visitante a un tercero sin su consentimiento, que es
lo que exige el RGPD.

**Iconos en SVG en línea** (`src/components/Icono.astro`). La web anterior
cargaba la hoja de estilos completa de Font Awesome y su fuente de iconos
desde un CDN para usar una docena de glifos.

**JavaScript escrito a mano, sin librerías.** El total es de unos 2 kB por
página: menú, galería, formulario, cookies y revelado al hacer scroll. Todo
se apoya en APIs del navegador (`<dialog>`, `<details>`,
`IntersectionObserver`) en lugar de reimplementarlas.

**Redirecciones de la web anterior** (`src/lib/legado.ts`). GitHub Pages no
permite redirecciones 301 del servidor, así que cada URL antigua se emite
como una página puente con `<meta refresh>` y `canonical` al destino.
Google trata ese patrón como permanente y traslada la autoridad. Se
resuelven como *endpoints* y no con la opción `redirects` de Astro porque,
con `trailingSlash: 'always'`, un destino terminado en `.html` se generaría
como carpeta y colisionaría con las rutas reales.

**El filtro del catálogo solo oculta.** Todas las fichas están en el HTML
desde el principio, así que Google indexa el catálogo completo y sin
JavaScript se ven todos los proyectos.

**Ninguna fotografía se muestra por encima de su tamaño real.** Es la
regla que más afecta a cómo se ve la web, y se aplica en tres sitios:

- Una ficha de proyecto usa portada **a sangre solo si el original mide
  1400 px o más**. Por debajo, la fotografía se presenta como lámina
  centrada limitada a su ancho real, con la entradilla al lado
  (`heroASangre` en `Proyecto.astro`). Ocupa menos, pero se ve nítida.
- En la galería, `ancha` se ignora si el original no llega a 1200 px:
  vale más una foto nítida a media caja que una borrosa a caja completa.
- El atributo `sizes` de las tarjetas declara el hueco **real** en el que
  se pintan (`hueco` en `TarjetaProyecto.astro`). Es el error más
  silencioso que existe con imágenes responsive: si `sizes` miente, el
  navegador descarga un fichero pequeño y lo amplía, aunque el grande
  esté generado y disponible.

`npm run nitidez` mide esto y lista lo que se está ampliando. Los tres
umbrales dejan de aplicar solos en cuanto lleguen fotografías mayores.

**Máscara de enfoque al reducir** (`src/lib/servicio-imagen.ts`). Un
servicio de imagen propio que envuelve el de Astro y aplica un reenfoque
suave cuando la fotografía se sirve más pequeña que el original. Al
remuestrear se promedian píxeles y el resultado sale blando: es física
del escalado, no un defecto del fichero. Medido, devuelve **+35 % de
nitidez** de media en las variantes reducidas, sin halos visibles.

No confundir con un «mejorador» por IA: esto recupera contraste local,
no inventa textura. En fotografía de obra, inventar textura es inventar
acabados.

La calidad WebP está en **82**, que es donde está el equilibrio medido:
de 82 a 88 la nitidez sube un 1,5 % y el peso un 37 %.

### Lo que se decidió no hacer

**Transiciones de página (View Transitions).** El `ClientRouter` de Astro
daría un fundido entre páginas, pero añade JavaScript y, sobre todo, obliga
a reinicializar en cada navegación los scripts del menú, la galería y el
formulario. Con `prefetch` en `hover` la navegación ya es prácticamente
instantánea. La relación entre lo que aporta y lo que puede romper no sale.

**Parallax en el hero.** Es una animación ligada al scroll, y en móvil eso
significa repintar en cada cuadro justo durante la primera interacción.
El brief pedía priorizar la velocidad cuando entra en conflicto con el
efecto, y aquí entra.

**AVIF.** Las fotografías ya vienen en WebP. Generar además AVIF para
~100 imágenes alargaría el build para ahorrar unos pocos kB por imagen.
Si el catálogo crece con originales en JPEG, merecerá la pena reconsiderarlo
(`image.formats` en `astro.config.mjs`).

**Un carrusel en la galería.** El mosaico deja ver varias fotografías a la
vez y funciona sin JavaScript. Un carrusel muestra una, esconde el resto y
en táctil compite con el gesto de scroll vertical.

---

## Despliegue

El workflow [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml)
se dispara al empujar a `main`: instala, construye, **audita** y publica.

Configuración necesaria en el repositorio (una sola vez):

- **Settings → Pages → Source:** *GitHub Actions*.
- **Settings → Pages → Custom domain:** `unero.es`.
- **Enforce HTTPS** activado.

> **Trampa con la que ya tropezamos.** El `CNAME` está en `public/`, no en
> la raíz del repositorio, que es donde lo tenía la web v1. Es lo correcto
> —así viaja dentro del artefacto que publica el Action— pero al moverlo,
> GitHub dejó de verlo en la rama y **borró el dominio personalizado de
> los ajustes**, dejando unero.es en 404 aunque el despliegue hubiera ido
> bien. Si vuelve a pasar: Settings → Pages → Custom domain → escribir
> `unero.es` → Save. No hay que mover el fichero.

> **El workflow de Jekyll.** Mientras la fuente de Pages estuvo en «Deploy
> from a branch», GitHub intentaba montar el repositorio con Jekyll y
> fallaba al leer los ficheros `.astro` como si fueran YAML. Con la fuente
> en *GitHub Actions* deja de ejecutarse. El fichero `public/.nojekyll`
> está ahí como seguro adicional: sin él, Jekyll descartaría la carpeta
> `_astro/`, que empieza por guion bajo y contiene todo el CSS, el
> JavaScript y las imágenes.

## Servicios de terceros

| Servicio | Para qué | Dónde se configura |
| --- | --- | --- |
| GitHub Pages | Alojamiento | `.github/workflows/deploy.yml` |
| Formspree | Envío del formulario | `site.formspree` en `src/config/site.ts` |
| Google Analytics 4 | Analítica, solo con consentimiento | `site.analytics.ga4` |
| Pages CMS | Panel de edición | `.pages.yml` |

Todos los datos de la empresa —teléfonos, correo, horario, zonas— están en
**un único sitio**: `src/config/site.ts`.

---

## Estado de las comprobaciones

Última ejecución de `npm run revisar` sobre 81 páginas:

- **Auditoría estática:** 0 problemas, 0 avisos.
- **Accesibilidad:** 0 violaciones de axe (WCAG 2.1 AA) en 15 páginas × 2
  vistas; las 12 pruebas de teclado pasan.
- **Rendimiento** (390×844, 10 Mbps, CPU ×4): LCP 0,43–0,52 s · CLS 0,000 ·
  2 kB de JavaScript por página.

## Qué falta

Ver **[CONTENIDO-PENDIENTE.md](CONTENIDO-PENDIENTE.md)**: datos de proyecto
sin confirmar, identificación fiscal para los textos legales y fotografías
que convendría encargar.
