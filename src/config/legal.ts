import type { ClaveRuta } from './site';

/**
 * Textos legales.
 *
 * La web anterior no tenía ninguno, pese a instalar Google Analytics y
 * un formulario de contacto: eso es un incumplimiento del RGPD y de la
 * LSSI, además de una señal de poca confianza para un cliente que va a
 * encargar una obra de seis cifras.
 *
 * Los marcadores «PENDIENTE» señalan los datos de identificación que
 * solo puede aportar la empresa (denominación social, CIF, domicilio
 * y datos registrales). Se renderizan como aviso visible a propósito:
 * un documento legal incompleto y silencioso es peor que uno que dice
 * qué le falta. Ver CONTENIDO-PENDIENTE.md
 */

export interface Documento {
  clave: ClaveRuta;
  es: { titulo: string; descripcion: string; h1: string; cuerpo: string };
  en: { titulo: string; descripcion: string; h1: string; cuerpo: string };
  /** Datos que faltan para que el documento quede cerrado. */
  pendiente?: { es: string; en: string };
}

const PENDIENTE_IDENTIDAD = {
  es: 'Faltan por incorporar los datos de identificación del titular: denominación social completa, CIF, domicilio social y datos registrales. Sin ellos el aviso legal no cumple el artículo 10 de la LSSI.',
  en: 'The owner’s identification details are still to be added: full registered company name, tax number, registered address and company-registry details.',
};

export const DOCUMENTOS: Documento[] = [
  /* ==================================================================== */
  {
    clave: 'aviso',
    pendiente: PENDIENTE_IDENTIDAD,
    es: {
      titulo: 'Aviso legal | Unero',
      descripcion:
        'Información legal del sitio unero.es: titularidad, condiciones de uso, propiedad intelectual y legislación aplicable.',
      h1: 'Aviso legal',
      cuerpo: `
## 1. Titularidad del sitio web

En cumplimiento del artículo 10 de la Ley 34/2002 de Servicios de la Sociedad de la Información y de Comercio Electrónico (LSSI-CE), se hacen constar los siguientes datos:

- **Denominación social:** Unero Espacio *(pendiente de completar con la denominación social registral)*
- **CIF:** *pendiente*
- **Domicilio social:** Ibiza, Islas Baleares, España *(pendiente de dirección completa)*
- **Correo electrónico:** eva@unero.es
- **Teléfono:** 687 885 319 / 679 418 741
- **Sitio web:** https://unero.es

## 2. Objeto

Este sitio web tiene por objeto presentar la actividad de construcción, reforma e interiorismo de Unero, mostrar los proyectos realizados y facilitar el contacto con clientes potenciales. El acceso es gratuito y no requiere registro.

## 3. Condiciones de uso

El acceso a este sitio implica la aceptación de las presentes condiciones. El usuario se compromete a utilizar el sitio conforme a la ley, a la buena fe y al orden público, y a no emplearlo con fines ilícitos, lesivos de derechos de terceros o que puedan dañar el sitio o impedir su normal utilización.

Unero se reserva el derecho de modificar en cualquier momento la presentación, configuración y contenidos del sitio, así como de suspender temporalmente su acceso por motivos técnicos o de mantenimiento.

## 4. Contenidos y exactitud de la información

La información publicada tiene carácter meramente informativo. Las referencias a costes, plazos, superficies y características técnicas son **orientativas** y no constituyen oferta contractual: cualquier compromiso requiere presupuesto escrito y firmado para un proyecto concreto.

Unero procura que la información esté actualizada, pero no garantiza la ausencia de errores ni la vigencia permanente de los contenidos, especialmente en lo relativo a normativa urbanística, que puede cambiar.

## 5. Propiedad intelectual e industrial

Todos los contenidos de este sitio —textos, fotografías, diseño gráfico, código fuente, logotipos, marcas y estructura de navegación— son titularidad de Unero o de terceros que han autorizado su uso, y están protegidos por la normativa de propiedad intelectual e industrial.

Queda prohibida su reproducción, distribución, comunicación pública o transformación sin autorización expresa y por escrito. Se permite la visualización e impresión para uso personal y privado.

Las fotografías de proyectos corresponden a obras realizadas por Unero y su uso por terceros requiere autorización.

## 6. Enlaces a terceros

Este sitio puede incluir enlaces a páginas de terceros. Unero no controla dichos sitios ni responde de sus contenidos, políticas de privacidad o prácticas.

## 7. Exclusión de responsabilidad

Unero no se responsabiliza de los daños derivados del uso de este sitio, de la imposibilidad de acceso, de la presencia de virus o de elementos maliciosos introducidos por terceros, ni de las decisiones que el usuario tome basándose únicamente en la información publicada.

## 8. Protección de datos

El tratamiento de los datos personales recabados a través del formulario de contacto se rige por la [política de privacidad](/privacidad/). El uso de cookies se describe en la [política de cookies](/politica-de-cookies/).

## 9. Legislación aplicable y jurisdicción

Las presentes condiciones se rigen por la legislación española. Para la resolución de cualquier controversia, las partes se someten a los Juzgados y Tribunales del domicilio del usuario cuando este tenga la condición de consumidor, y a los de Ibiza en caso contrario.
`,
    },
    en: {
      titulo: 'Legal notice | Unero',
      descripcion:
        'Legal information for unero.es: ownership, terms of use, intellectual property and applicable law.',
      h1: 'Legal notice',
      cuerpo: `
## 1. Website owner

In accordance with article 10 of Spanish Law 34/2002 on Information Society Services and Electronic Commerce (LSSI-CE), the following details are stated:

- **Company name:** Unero Espacio *(pending completion with the full registered name)*
- **Tax number (CIF):** *pending*
- **Registered address:** Ibiza, Balearic Islands, Spain *(full address pending)*
- **Email:** eva@unero.es
- **Telephone:** +34 687 885 319 / +34 679 418 741
- **Website:** https://unero.es

## 2. Purpose

The purpose of this website is to present Unero's construction, renovation and interior design activity, to show completed projects and to make it easy for prospective clients to get in touch. Access is free and requires no registration.

## 3. Terms of use

Accessing this site implies acceptance of these terms. Users undertake to use the site in accordance with the law, good faith and public order, and not to use it for unlawful purposes, to the detriment of third-party rights, or in any way that could damage the site or prevent its normal use.

Unero reserves the right to modify the presentation, configuration and content of the site at any time, and to suspend access temporarily for technical or maintenance reasons.

## 4. Content and accuracy of information

The information published is for information purposes only. References to costs, timescales, areas and technical characteristics are **indicative** and do not constitute a contractual offer: any commitment requires a written, signed quotation for a specific project.

Unero endeavours to keep the information up to date but does not guarantee that it is free of errors or permanently current, particularly regarding planning regulations, which are subject to change.

## 5. Intellectual and industrial property

All content on this site — text, photographs, graphic design, source code, logos, trade marks and navigation structure — belongs to Unero or to third parties who have authorised its use, and is protected by intellectual and industrial property law.

Its reproduction, distribution, public communication or transformation without express written authorisation is prohibited. Viewing and printing for personal, private use is permitted.

Project photographs correspond to works carried out by Unero and their use by third parties requires authorisation.

## 6. Third-party links

This site may include links to third-party pages. Unero does not control those sites and is not responsible for their content, privacy policies or practices.

## 7. Disclaimer

Unero accepts no liability for damages arising from the use of this site, from any inability to access it, from the presence of viruses or malicious elements introduced by third parties, or from decisions taken by the user based solely on the information published.

## 8. Data protection

The processing of personal data collected through the contact form is governed by the [privacy policy](/en/privacy/). The use of cookies is described in the [cookie policy](/en/cookie-policy/).

## 9. Applicable law and jurisdiction

These terms are governed by Spanish law. For the resolution of any dispute, the parties submit to the courts of the user's place of residence where the user is a consumer, and otherwise to those of Ibiza.
`,
    },
  },

  /* ==================================================================== */
  {
    clave: 'privacidad',
    pendiente: PENDIENTE_IDENTIDAD,
    es: {
      titulo: 'Política de privacidad | Unero',
      descripcion:
        'Cómo tratamos los datos personales que nos facilitas: finalidad, base jurídica, plazo de conservación, destinatarios y cómo ejercer tus derechos.',
      h1: 'Política de privacidad',
      cuerpo: `
## 1. Responsable del tratamiento

- **Responsable:** Unero Espacio *(pendiente de denominación social y CIF)*
- **Domicilio:** Ibiza, Islas Baleares, España *(pendiente de dirección completa)*
- **Correo de contacto:** eva@unero.es

## 2. Qué datos recogemos

Únicamente los que nos facilitas voluntariamente a través del formulario de contacto:

| Dato | Carácter |
| --- | --- |
| Nombre y apellidos | Obligatorio |
| Correo electrónico | Obligatorio |
| Teléfono | Opcional |
| Tipo de proyecto | Obligatorio |
| Fase del proyecto | Opcional |
| Zona de la isla | Opcional |
| Mensaje | Obligatorio |

No recogemos datos de categorías especiales y no solicitamos más información de la necesaria para poder responder con criterio a tu consulta.

## 3. Para qué los usamos

- **Atender tu consulta** y mantener la comunicación necesaria para valorar tu proyecto.
- **Elaborar presupuestos** y documentación técnica si lo solicitas.
- **Conservar el historial** de la relación comercial mientras esté vigente.

No utilizamos tus datos para enviarte comunicaciones comerciales no solicitadas, y no hay newsletter en este sitio. No elaboramos perfiles ni tomamos decisiones automatizadas.

## 4. Base jurídica

- **Consentimiento** (art. 6.1.a RGPD) para el envío del formulario, que marcas expresamente antes de enviarlo.
- **Interés legítimo** (art. 6.1.f RGPD) para responder a tu consulta y mantener la relación precontractual.
- **Ejecución de contrato** (art. 6.1.b RGPD) si la relación llega a formalizarse.

## 5. Cuánto tiempo los conservamos

Las consultas que no derivan en relación comercial se conservan **un año** desde el último contacto, y después se suprimen. Si la relación se formaliza, los datos se conservan durante la vigencia del contrato y, posteriormente, durante los plazos de prescripción legal aplicables (mercantil, fiscal y de garantías de edificación).

## 6. A quién se comunican

No vendemos ni cedemos tus datos. Acceden a ellos únicamente los proveedores necesarios para que el sitio funcione, todos ellos con contrato de encargado de tratamiento:

- **Formspree Inc.** (Estados Unidos): procesamiento y entrega del formulario de contacto. Transferencia internacional amparada en las cláusulas contractuales tipo de la Comisión Europea.
- **GitHub, Inc.** (Estados Unidos): alojamiento del sitio web estático.
- **Google Ireland Ltd.**: analítica de uso mediante Google Analytics 4, **solo si aceptas las cookies analíticas**.

Además, podrán comunicarse datos a las administraciones públicas cuando exista obligación legal.

## 7. Tus derechos

Puedes ejercer en cualquier momento los derechos de **acceso, rectificación, supresión, limitación del tratamiento, oposición y portabilidad**, así como retirar el consentimiento prestado.

Para ello, escribe a **eva@unero.es** indicando el derecho que deseas ejercer. Responderemos en el plazo máximo de un mes.

Si consideras que no hemos atendido correctamente tu solicitud, puedes presentar una reclamación ante la **Agencia Española de Protección de Datos** (www.aepd.es).

## 8. Seguridad

El sitio se sirve íntegramente cifrado mediante HTTPS. Aplicamos medidas técnicas y organizativas razonables para proteger los datos frente a pérdida, acceso no autorizado o alteración. No obstante, ninguna transmisión por internet es absolutamente segura.

## 9. Menores

Este sitio no está dirigido a menores de 14 años y no recabamos deliberadamente sus datos.

## 10. Cambios en esta política

Si modificamos esta política, publicaremos la versión actualizada en esta misma dirección. La fecha de última revisión figura al final del documento.
`,
    },
    en: {
      titulo: 'Privacy policy | Unero',
      descripcion:
        'How we handle the personal data you give us: purpose, legal basis, retention period, recipients and how to exercise your rights.',
      h1: 'Privacy policy',
      cuerpo: `
## 1. Data controller

- **Controller:** Unero Espacio *(registered name and tax number pending)*
- **Address:** Ibiza, Balearic Islands, Spain *(full address pending)*
- **Contact email:** eva@unero.es

## 2. What data we collect

Only what you provide voluntarily through the contact form:

| Data | Requirement |
| --- | --- |
| Full name | Required |
| Email address | Required |
| Telephone | Optional |
| Project type | Required |
| Project stage | Optional |
| Area of the island | Optional |
| Message | Required |

We do not collect special category data, and we do not ask for more information than we need in order to give your enquiry a considered answer.

## 3. What we use it for

- **To answer your enquiry** and maintain the communication needed to assess your project.
- **To prepare quotations** and technical documentation if you request them.
- **To keep a record** of the commercial relationship while it is active.

We do not use your data to send unsolicited marketing, and there is no newsletter on this site. We do not carry out profiling or automated decision-making.

## 4. Legal basis

- **Consent** (art. 6.1.a GDPR) for submitting the form, which you tick expressly before sending it.
- **Legitimate interest** (art. 6.1.f GDPR) to answer your enquiry and maintain the pre-contractual relationship.
- **Performance of a contract** (art. 6.1.b GDPR) if the relationship is formalised.

## 5. How long we keep it

Enquiries that do not lead to a commercial relationship are kept for **one year** from the last contact and then deleted. If the relationship is formalised, the data is kept for the duration of the contract and thereafter for the applicable statutory limitation periods (commercial, tax and building guarantees).

## 6. Who it is shared with

We do not sell or transfer your data. Only the providers necessary for the site to work have access to it, all of them under data processing agreements:

- **Formspree Inc.** (United States): processing and delivery of the contact form. International transfer covered by the European Commission's standard contractual clauses.
- **GitHub, Inc.** (United States): hosting of the static website.
- **Google Ireland Ltd.**: usage analytics via Google Analytics 4, **only if you accept analytics cookies**.

Data may also be disclosed to public authorities where there is a legal obligation to do so.

## 7. Your rights

You may exercise at any time your rights of **access, rectification, erasure, restriction of processing, objection and portability**, and withdraw any consent given.

To do so, write to **eva@unero.es** stating which right you wish to exercise. We will respond within one month at most.

If you believe we have not handled your request properly, you may lodge a complaint with the **Spanish Data Protection Agency** (www.aepd.es).

## 8. Security

The site is served entirely over encrypted HTTPS. We apply reasonable technical and organisational measures to protect data against loss, unauthorised access or alteration. That said, no transmission over the internet is absolutely secure.

## 9. Minors

This site is not aimed at children under 14 and we do not knowingly collect their data.

## 10. Changes to this policy

If we amend this policy, we will publish the updated version at this same address. The date of last revision appears at the end of the document.
`,
    },
  },

  /* ==================================================================== */
  {
    clave: 'cookies',
    es: {
      titulo: 'Política de cookies | Unero',
      descripcion:
        'Qué cookies usa unero.es, para qué sirven, cuánto duran y cómo cambiar tu decisión en cualquier momento.',
      h1: 'Política de cookies',
      cuerpo: `
## 1. Qué es una cookie

Una cookie es un pequeño archivo que un sitio web guarda en tu navegador. Sirve para recordar información entre visitas: desde una preferencia de idioma hasta datos estadísticos de uso.

Este sitio también utiliza **almacenamiento local** del navegador (localStorage), que funciona de forma parecida pero no se envía en cada petición. Se rige por las mismas reglas de consentimiento.

## 2. Nuestro planteamiento

**Nada se activa antes de que decidas.** Al entrar por primera vez verás un aviso con tres opciones del mismo peso: aceptar todas, aceptar solo las necesarias, o configurar. Rechazar es tan fácil como aceptar, y no hay muro de cookies: puedes usar la web entera sin aceptar nada.

Mientras no aceptes, Google Analytics se carga en modo denegado (*Consent Mode v2*): no escribe cookies ni envía identificadores.

## 3. Cookies que utilizamos

### Necesarias

Imprescindibles para que el sitio funcione. No se pueden desactivar y no requieren consentimiento.

| Nombre | Tipo | Finalidad | Duración |
| --- | --- | --- | --- |
| \`unero_consentimiento\` | localStorage, propia | Recordar tu decisión sobre cookies para no volver a preguntártelo | Hasta que la borres |

### Analíticas

Nos dicen qué páginas resultan útiles y por dónde se abandona la navegación. Solo se activan si las aceptas.

| Nombre | Tipo | Finalidad | Duración |
| --- | --- | --- | --- |
| \`_ga\` | Cookie de Google Analytics | Distinguir visitantes de forma anónima | 2 años |
| \`_ga_FWEK6NDLK0\` | Cookie de Google Analytics | Mantener el estado de la sesión | 2 años |

Proveedor: Google Ireland Ltd. La analítica se configura con la IP anonimizada. Puedes consultar cómo Google trata estos datos en su [política de privacidad](https://policies.google.com/privacy).

### Publicitarias

**No utilizamos cookies publicitarias ni de seguimiento entre sitios.** No hay píxeles de redes sociales, ni remarketing, ni cesión de datos a plataformas de publicidad.

## 4. Cambiar tu decisión

Puedes modificar tu elección en cualquier momento desde el enlace **«Preferencias de cookies»** que hay en el pie de cualquier página de este sitio.

También puedes gestionar o eliminar las cookies desde la configuración de tu navegador:

- [Chrome](https://support.google.com/chrome/answer/95647)
- [Safari](https://support.apple.com/es-es/guide/safari/sfri11471/mac)
- [Firefox](https://support.mozilla.org/es/kb/Borrar%20cookies)
- [Edge](https://support.microsoft.com/es-es/microsoft-edge)

Ten en cuenta que borrar el almacenamiento del navegador eliminará también el registro de tu decisión, por lo que volveremos a preguntártela.

## 5. Contenido de terceros

Este sitio **no incrusta** vídeos de YouTube ni Vimeo, mapas de Google, fuentes de Google Fonts ni widgets de redes sociales. Las tipografías se sirven desde nuestro propio dominio, precisamente para no transferir tu dirección IP a terceros sin tu consentimiento.

El único vídeo del sitio está alojado por nosotros y no se descarga hasta que pulsas para reproducirlo.

## 6. Más información

Si tienes dudas sobre esta política, escríbenos a **eva@unero.es**. Para el tratamiento general de datos personales, consulta la [política de privacidad](/privacidad/).
`,
    },
    en: {
      titulo: 'Cookie policy | Unero',
      descripcion:
        'Which cookies unero.es uses, what they are for, how long they last and how to change your choice at any time.',
      h1: 'Cookie policy',
      cuerpo: `
## 1. What a cookie is

A cookie is a small file that a website stores in your browser. It is used to remember information between visits: anything from a language preference to usage statistics.

This site also uses browser **local storage** (localStorage), which works similarly but is not sent with every request. It is subject to the same consent rules.

## 2. Our approach

**Nothing is activated before you decide.** On your first visit you will see a notice with three options of equal weight: accept all, accept only the essential ones, or customise. Refusing is as easy as accepting, and there is no cookie wall: you can use the whole site without accepting anything.

Until you accept, Google Analytics loads in denied mode (*Consent Mode v2*): it writes no cookies and sends no identifiers.

## 3. Cookies we use

### Essential

Required for the site to work. They cannot be switched off and do not require consent.

| Name | Type | Purpose | Duration |
| --- | --- | --- | --- |
| \`unero_consentimiento\` | localStorage, first party | Remember your cookie choice so we do not ask again | Until you clear it |

### Analytics

These tell us which pages are useful and where people leave. They are only activated if you accept them.

| Name | Type | Purpose | Duration |
| --- | --- | --- | --- |
| \`_ga\` | Google Analytics cookie | Distinguish visitors anonymously | 2 years |
| \`_ga_FWEK6NDLK0\` | Google Analytics cookie | Maintain session state | 2 years |

Provider: Google Ireland Ltd. Analytics is configured with IP anonymisation. You can read how Google handles this data in its [privacy policy](https://policies.google.com/privacy).

### Advertising

**We do not use advertising or cross-site tracking cookies.** There are no social media pixels, no remarketing, and no transfer of data to advertising platforms.

## 4. Changing your choice

You can change your choice at any time from the **"Cookie preferences"** link in the footer of any page on this site.

You can also manage or delete cookies from your browser settings:

- [Chrome](https://support.google.com/chrome/answer/95647)
- [Safari](https://support.apple.com/en-gb/guide/safari/sfri11471/mac)
- [Firefox](https://support.mozilla.org/en-US/kb/clear-cookies-and-site-data-firefox)
- [Edge](https://support.microsoft.com/en-gb/microsoft-edge)

Note that clearing your browser storage will also delete the record of your choice, so we will ask you again.

## 5. Third-party content

This site does **not** embed YouTube or Vimeo videos, Google Maps, Google Fonts or social media widgets. Typefaces are served from our own domain, precisely so as not to transfer your IP address to third parties without your consent.

The only video on the site is hosted by us and is not downloaded until you press play.

## 6. More information

If you have questions about this policy, write to us at **eva@unero.es**. For the general handling of personal data, see the [privacy policy](/en/privacy/).
`,
    },
  },
];

export function documentoPorClave(clave: ClaveRuta) {
  return DOCUMENTOS.find((d) => d.clave === clave);
}
