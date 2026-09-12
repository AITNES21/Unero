import type { ImageMetadata } from 'astro';
import type { ClaveRuta } from './site';

import imgConstruccion from '../assets/site/foto8.webp';
import imgVillas from '../assets/proyectos/ses-torres-ii/foto10.webp';
// can-flowers/foto1 mide 1600x1066; talamanca/foto13 solo 640x427.
import imgReformas from '../assets/proyectos/can-flowers/foto1.webp';
// La cocina de Ses Torres II mide 1920x1358; salon.webp solo 865x648
// y este hero se pinta a sangre.
import imgInteriorismo from '../assets/proyectos/ses-torres-ii/foto1.webp';
import imgPromociones from '../assets/site/foto7.webp';

import imgConstruccionSec from '../assets/proyectos/ses-torres-ii/foto12.webp';
import imgVillasSec from '../assets/proyectos/can-cana/foto1.webp';
import imgReformasSec from '../assets/proyectos/talamanca/foto13.webp';
import imgInteriorismoSec from '../assets/proyectos/interiorismo/salon.webp';
import imgPromocionesSec from '../assets/site/foto1.webp';

interface Bloque {
  t: string;
  d: string;
}

interface Pregunta {
  pregunta: string;
  respuesta: string;
}

interface Idioma {
  /** Etiqueta <title>. Lleva la keyword principal al principio. */
  titulo: string;
  descripcion: string;
  cejilla: string;
  h1: string;
  entradilla: string;
  cuerpo: string[];
  incluyeTitulo: string;
  incluye: Bloque[];
  criteriosTitulo: string;
  criterios: Bloque[];
  faq: Pregunta[];
}

export interface Servicio {
  clave: ClaveRuta;
  /** Se usa para enlazar proyectos afines desde la página de servicio. */
  proyectos: string[];
  imagen: ImageMetadata;
  imagenSecundaria: ImageMetadata;
  imagenAlt: { es: string; en: string };
  imagenSecundariaAlt: { es: string; en: string };
  es: Idioma;
  en: Idioma;
}

/**
 * Contenido de las páginas de servicio.
 *
 * Cada una se orienta a una intención de búsqueda distinta y con una
 * respuesta real, no una variación de la misma página con las palabras
 * cambiadas. Es la diferencia entre una arquitectura SEO y un conjunto
 * de páginas puerta.
 */
export const SERVICIOS: Servicio[] = [
  /* ==================================================================== */
  {
    clave: 'construccion',
    proyectos: ['can-cana', 'alina', 'talamanca'],
    imagen: imgConstruccion,
    imagenSecundaria: imgConstruccionSec,
    imagenAlt: {
      es: 'Obra en ejecución con excavación, armaduras de acero y apuntalamiento en una parcela en pendiente.',
      en: 'Construction underway with excavation, steel reinforcement and shoring on a sloping plot.',
    },
    imagenSecundariaAlt: {
      es: 'Planta sótano en hormigón visto con pilar central, durante la fase de estructura.',
      en: 'Basement floor in exposed concrete with a central column, during the structural stage.',
    },
    es: {
      titulo: 'Construcción de casas en Ibiza | Constructora Unero',
      descripcion:
        'Empresa constructora en Ibiza especializada en obra nueva de viviendas. Dirección propia de obra y presupuesto por partidas medidas.',
      cejilla: 'Servicio',
      h1: 'Construcción de casas en Ibiza',
      entradilla:
        'Levantamos tu casa desde la cimentación, con nuestro propio equipo en la parcela y un presupuesto que se puede leer línea por línea.',
      cuerpo: [
        'Somos una empresa constructora, no una intermediaria que coloca el trabajo en manos de terceros y aparece el día de la entrega. Nuestro jefe de obra está en la parcela, y es la misma persona que te atendió el primer día.',
        'Trabajamos sobre el proyecto del estudio de arquitectura que elijas. Nos gusta entrar a colaborar cuando el proyecto todavía se está dibujando, porque es cuando podemos aportar algo útil: avisar de que una solución va a ser carísima de ejecutar aquí, de que un material tiene doce semanas de plazo, o de que un encuentro va a dar problemas con las lluvias de otoño. Un proyecto revisado desde la obra antes de salir a licencia ahorra meses después.',
        'Construir en una isla no es lo mismo que construir en el continente. Cada saco de cemento y cada hoja de vidrio llegan en barco, los buenos oficios están comprometidos desde primavera y la normativa insular es estricta con la ocupación, el volumen y el paisaje. Saber planificar con eso en la cabeza es la mitad del trabajo.',
      ],
      incluyeTitulo: 'Qué incluye',
      incluye: [
        {
          t: 'Movimiento de tierras y cimentación',
          d: 'Replanteo, excavación, muros de contención donde el terreno lo pide y cimentación según estudio geotécnico.',
        },
        {
          t: 'Estructura',
          d: 'Hormigón armado, forjados y escaleras, con recubrimientos de armadura dimensionados para ambiente marino.',
        },
        {
          t: 'Envolvente',
          d: 'Fachadas, cubierta, aislamiento continuo e impermeabilización. Lo que no se ve y decide cómo se vive la casa.',
        },
        {
          t: 'Instalaciones',
          d: 'Fontanería, electricidad, saneamiento, climatización y domótica, coordinadas antes de cerrar techos y tabiques.',
        },
        {
          t: 'Acabados',
          d: 'Solados, revestimientos, carpintería interior y exterior, pintura, sanitarios y cocina.',
        },
        {
          t: 'Exteriores',
          d: 'Piscina, pavimentos, paisajismo, iluminación de jardín y cierre de parcela.',
        },
      ],
      criteriosTitulo: 'Cómo trabajamos',
      criterios: [
        {
          t: 'Presupuesto por partidas medidas',
          d: 'Con unidades de obra medidas, precios unitarios y las exclusiones escritas en lenguaje comprensible. Nunca un total redondo.',
        },
        {
          t: 'Pagos contra obra certificada',
          d: 'El plan de pagos va ligado al avance real, certificado mensualmente. Pagar por lo ejecutado es tu principal protección.',
        },
        {
          t: 'Cambios por escrito',
          d: 'Cualquier modificación de alcance se valora y se aprueba antes de ejecutarse, con su repercusión en precio y en plazo.',
        },
        {
          t: 'Garantías legales',
          d: 'Un año en acabados, tres en elementos constructivos y diez en estructura, según la Ley de Ordenación de la Edificación.',
        },
      ],
      faq: [
        {
          pregunta: '¿Cuánto cuesta construir una casa en Ibiza?',
          respuesta:
            '<p>Nuestros proyectos con acabados de calidad parten de unos 3.000 €/m² construido. La horquilla es amplia porque la parcela manda: pendiente, accesibilidad, profundidad de la roca y distancia a las acometidas pueden cambiar el precio un 40 % con el mismo programa. Lo desglosamos en <a href="/cuaderno/cuanto-cuesta-construir-una-casa-en-ibiza/">este artículo</a>.</p>',
        },
        {
          pregunta: '¿Puedo construir en cualquier parcela?',
          respuesta:
            '<p>No. El suelo rústico de Ibiza está muy protegido y hay condicionantes de superficie mínima, ocupación, altura y protección paisajística que varían por municipio. Antes de comprar un terreno hay que verificar su edificabilidad real con una consulta urbanística. Vamos contigo a verlo antes de que firmes.</p>',
        },
        {
          pregunta: '¿Os encargáis de las licencias?',
          respuesta:
            '<p>Gestionamos la tramitación junto al estudio de arquitectura, que es quien firma el proyecto. La licencia depende del ayuntamiento y puede tardar de 6 a 12 meses: es tiempo administrativo que no se acelera pagando más, pero sí se puede evitar alargarlo presentando un proyecto completo y sin requerimientos.</p>',
        },
        {
          pregunta: '¿Trabajáis con mi arquitecto?',
          respuesta:
            '<p>Sí, y es lo más habitual. Nos entendemos bien con estudios de fuera de la isla que necesitan un constructor que conozca la normativa local, los oficios y los plazos de suministro. Si aún no tienes estudio, te presentamos a los que conocemos y eliges tú.</p>',
        },
      ],
    },
    en: {
      titulo: 'House construction in Ibiza | Unero builders',
      descripcion:
        'Construction company in Ibiza specialising in new-build houses. In-house site management, quotes by measured items and a 10-year structural guarantee.',
      cejilla: 'Service',
      h1: 'House construction in Ibiza',
      entradilla:
        'We build your house from the foundations up, with our own team on the plot and a quote you can read line by line.',
      cuerpo: [
        'We are a construction company, not a middleman who passes the work to third parties and turns up on handover day. Our site manager is on the plot, and it is the same person who dealt with you on day one.',
        'We build to the design of whichever architecture studio you choose. We like to get involved while the design is still being drawn, because that is when we can contribute something useful: flagging that a detail will be extremely expensive to execute here, that a material has a twelve-week lead time, or that a junction will cause problems with the autumn rains. A design reviewed from a builder’s point of view before it goes for permit saves months later.',
        'Building on an island is not the same as building on the mainland. Every bag of cement and every sheet of glass arrives by boat, the good trades are committed from spring onwards, and island planning rules are strict about coverage, volume and landscape. Knowing how to plan around that is half the job.',
      ],
      incluyeTitulo: 'What it includes',
      incluye: [
        {
          t: 'Earthworks and foundations',
          d: 'Setting out, excavation, retaining walls where the ground requires them, and foundations based on the geotechnical survey.',
        },
        {
          t: 'Structure',
          d: 'Reinforced concrete, slabs and stairs, with reinforcement cover sized for a marine environment.',
        },
        {
          t: 'Building envelope',
          d: 'Façades, roof, continuous insulation and waterproofing. The parts you cannot see that decide how the house lives.',
        },
        {
          t: 'Building services',
          d: 'Plumbing, electrics, drainage, climate control and home automation, coordinated before ceilings and partitions are closed.',
        },
        {
          t: 'Finishes',
          d: 'Floors, wall finishes, internal and external joinery, decoration, sanitaryware and kitchen.',
        },
        {
          t: 'Outdoor areas',
          d: 'Pool, paving, landscaping, garden lighting and boundary treatment.',
        },
      ],
      criteriosTitulo: 'How we work',
      criterios: [
        {
          t: 'Quotes by measured items',
          d: 'With measured quantities, unit rates and the exclusions written in plain language. Never a single round figure.',
        },
        {
          t: 'Payment against certified work',
          d: 'The payment schedule follows real progress, certified monthly. Paying for what has been built is your main protection.',
        },
        {
          t: 'Changes in writing',
          d: 'Any change of scope is priced and approved before it is carried out, with its effect on cost and programme.',
        },
        {
          t: 'Statutory guarantees',
          d: 'One year on finishes, three on building elements and ten on structure, under Spanish building law.',
        },
      ],
      faq: [
        {
          pregunta: 'How much does it cost to build a house in Ibiza?',
          respuesta:
            '<p>Our projects with quality finishes start at around €3,000 per built m². The range is wide because the plot dictates: slope, access, depth of rock and distance to services can change the price by 40 % for the same brief.</p>',
        },
        {
          pregunta: 'Can I build on any plot?',
          respuesta:
            '<p>No. Rural land in Ibiza is heavily protected, with minimum-area, coverage, height and landscape conditions that vary by municipality. Before buying land, its real development potential must be confirmed through a planning enquiry. We will come and look at it with you before you sign.</p>',
        },
        {
          pregunta: 'Do you handle the permits?',
          respuesta:
            '<p>We manage the process alongside the architecture studio, which is the party that signs the design. The permit depends on the town hall and can take 6 to 12 months: that is administrative time which cannot be accelerated by paying more, though it can be kept from dragging by submitting a complete application.</p>',
        },
        {
          pregunta: 'Do you work with my architect?',
          respuesta:
            '<p>Yes, and that is the norm. We work well with studios from outside the island who need a builder who knows the local rules, the trades and the lead times. If you do not have a studio yet, we will introduce you to the ones we know.</p>',
        },
      ],
    },
  },

  /* ==================================================================== */
  {
    clave: 'villas',
    proyectos: ['ses-torres-ii', 'can-cana', 'vista-alegre'],
    imagen: imgVillas,
    imagenSecundaria: imgVillasSec,
    imagenAlt: {
      es: 'Terraza de una villa en Ibiza con tumbonas escultóricas blancas, borde de piscina y celosía vertical de madera.',
      en: 'Villa terrace in Ibiza with white sculptural loungers, the pool edge and a vertical timber screen.',
    },
    imagenSecundariaAlt: {
      es: 'Villa de dos plantas con revestimiento de travertino vista desde la piscina, con tarima de madera y sombrillas.',
      en: 'Two-storey travertine-clad villa seen from the pool, with a timber deck and parasols.',
    },
    es: {
      titulo: 'Construcción de villas llave en mano en Ibiza | Unero',
      descripcion:
        'Construcción de villas de lujo llave en mano en Ibiza: licencias, obra, piscina, jardín e interiorismo con una sola interlocución, del solar a la entrega de llaves.',
      cejilla: 'Servicio',
      h1: 'Villas llave en mano en Ibiza',
      entradilla:
        'Una sola interlocución desde el solar hasta las llaves. Nosotros nos ocupamos de que todo encaje; tú tomas las decisiones que importan.',
      cuerpo: [
        'Llave en mano significa que no tienes que coordinar a diez empresas ni descubrir a mitad de obra que el carpintero espera al electricista. Significa una sola persona responsable, un solo contrato y una casa que se entrega terminada, con la cama hecha si hace falta.',
        'Es el formato que mejor funciona cuando el cliente no vive en la isla. Buena parte de quienes construyen en Ibiza están a dos horas de avión, y no pueden estar en la parcela cada semana para decidir sobre un remate. Nuestro trabajo es que esa distancia no cueste dinero ni calidad: informes periódicos con fotografías, decisiones agrupadas para que no lleguen a cuentagotas, y criterio propio para resolver lo que no merece una consulta.',
        'Y significa también que la casa se piensa completa desde el principio. La piscina, el jardín, la iluminación y el mobiliario no son un añadido posterior: se proyectan a la vez que la arquitectura, que es la única manera de que el resultado parezca una decisión y no una acumulación.',
      ],
      incluyeTitulo: 'De principio a fin',
      incluye: [
        {
          t: 'Viabilidad y parcela',
          d: 'Comprobación de edificabilidad real, informe urbanístico y valoración de los condicionantes del terreno antes de comprometer nada.',
        },
        {
          t: 'Proyecto y licencias',
          d: 'Coordinación con el estudio de arquitectura y tramitación completa del permiso de obra.',
        },
        {
          t: 'Obra completa',
          d: 'Estructura, envolvente, instalaciones y acabados, con dirección propia en la parcela.',
        },
        {
          t: 'Piscina y exteriores',
          d: 'Vaso, depuración, climatización, pavimentos, paisajismo mediterráneo e iluminación exterior.',
        },
        {
          t: 'Interiorismo',
          d: 'Mobiliario, textiles, iluminación decorativa y equipamiento, para que la casa se entregue vestida.',
        },
        {
          t: 'Entrega y postventa',
          d: 'Repaso conjunto de remates, documentación as-built, manuales, certificados y garantías.',
        },
      ],
      criteriosTitulo: 'Criterios de proyecto',
      criterios: [
        {
          t: 'La sombra se construye',
          d: 'Voladizos y celosías resueltos desde la estructura, no toldos añadidos después. Es más barato y funciona mejor.',
        },
        {
          t: 'Pocos materiales, repetidos',
          d: 'Tres o cuatro materiales bien puestos y llevados con disciplina por toda la casa. Es lo que distingue una villa cara de una villa recargada.',
        },
        {
          t: 'Pensada para el invierno',
          d: 'Programa que permite habitar la casa a medio gas fuera de temporada, sin abrir el volumen completo.',
        },
        {
          t: 'Materiales que aguantan la sal',
          d: 'Herrajes de inoxidable marino, lacados de calidad y acabados mate. En costa, el brillo acusa la salinidad en una temporada.',
        },
      ],
      faq: [
        {
          pregunta: '¿Cuánto se tarda en construir una villa en Ibiza?',
          respuesta:
            '<p>De 12 a 18 meses de obra para una vivienda unifamiliar. Antes hay que contar el proyecto (3 a 6 meses) y la licencia (6 a 12 meses). Desde la primera conversación hasta poder dormir en la casa, dos años es un plazo realista. Si alguien te promete mucho menos, pregúntale por la licencia.</p>',
        },
        {
          pregunta: '¿Puedo seguir la obra si no vivo en Ibiza?',
          respuesta:
            '<p>Sí, y es lo habitual. Enviamos informes periódicos con fotografías del avance, agrupamos las decisiones para que no te lleguen de una en una, y resolvemos con criterio propio lo que no merece una consulta. La mayoría de nuestros clientes visita la obra tres o cuatro veces en total.</p>',
        },
        {
          pregunta: '¿El interiorismo es obligatorio?',
          respuesta:
            '<p>No. Puedes contratar solo la obra. Pero si se planifica a la vez que los acabados, la casa se entrega terminada en lugar de a medio vestir, y no hay que volver a entrar con operarios cuando ya vives en ella.</p>',
        },
        {
          pregunta: '¿Qué pasa si el presupuesto se desvía?',
          respuesta:
            '<p>Debe estar previsto en el contrato. Cualquier cambio de alcance se documenta, se valora y se aprueba por escrito antes de ejecutarse. Las desviaciones que se descubren al final son siempre un problema de gestión, no de mala suerte.</p>',
        },
      ],
    },
    en: {
      titulo: 'Turnkey villa construction in Ibiza | Unero',
      descripcion:
        'Turnkey luxury villa construction in Ibiza: permits, build, pool, garden and interiors with a single point of contact, from the plot to handover of the keys.',
      cejilla: 'Service',
      h1: 'Turnkey villas in Ibiza',
      entradilla:
        'One point of contact from the plot to the keys. We make sure everything fits together; you make the decisions that matter.',
      cuerpo: [
        'Turnkey means you do not have to coordinate ten companies or discover halfway through that the joiner is waiting on the electrician. It means one responsible person, one contract, and a house handed over finished.',
        'It is the format that works best when the client does not live on the island. Many of those building in Ibiza are a two-hour flight away and cannot be on the plot every week to decide on a detail. Our job is to make sure that distance costs neither money nor quality: regular reports with photographs, decisions grouped rather than drip-fed, and enough judgement of our own to resolve what does not warrant a question.',
        'It also means the house is conceived complete from the start. The pool, the garden, the lighting and the furniture are not a later addition: they are designed at the same time as the architecture, which is the only way the result reads as a decision rather than an accumulation.',
      ],
      incluyeTitulo: 'From start to finish',
      incluye: [
        {
          t: 'Feasibility and plot',
          d: 'Verification of real development potential, planning report and assessment of ground constraints before committing to anything.',
        },
        {
          t: 'Design and permits',
          d: 'Coordination with the architecture studio and full management of the building permit.',
        },
        {
          t: 'Complete build',
          d: 'Structure, envelope, services and finishes, with our own management on site.',
        },
        {
          t: 'Pool and outdoor areas',
          d: 'Tank, filtration, heating, paving, Mediterranean landscaping and external lighting.',
        },
        {
          t: 'Interior design',
          d: 'Furniture, textiles, decorative lighting and equipment, so the house is handed over dressed.',
        },
        {
          t: 'Handover and aftercare',
          d: 'Joint inspection of finishing, as-built documentation, manuals, certificates and guarantees.',
        },
      ],
      criteriosTitulo: 'Design principles',
      criterios: [
        {
          t: 'Shade is built',
          d: 'Overhangs and screens resolved in the structure, not awnings added later. It is cheaper and it works better.',
        },
        {
          t: 'Few materials, repeated',
          d: 'Three or four materials, well placed and carried with discipline through the whole house. It is what separates an expensive villa from a cluttered one.',
        },
        {
          t: 'Designed for winter too',
          d: 'A programme that lets the house be lived in at half capacity out of season, without opening up the whole volume.',
        },
        {
          t: 'Materials that survive salt',
          d: 'Marine-grade stainless fixings, quality powder coating and matt finishes. On the coast, gloss shows up salt within a season.',
        },
      ],
      faq: [
        {
          pregunta: 'How long does it take to build a villa in Ibiza?',
          respuesta:
            '<p>12 to 18 months of construction for a detached house. Before that comes the design (3 to 6 months) and the permit (6 to 12 months). From the first conversation to sleeping in the house, two years is realistic. If someone promises far less, ask them about the permit.</p>',
        },
        {
          pregunta: 'Can I follow the build if I do not live in Ibiza?',
          respuesta:
            '<p>Yes, and that is the norm. We send regular reports with photographs of progress, group decisions so they do not reach you one at a time, and use our own judgement on what does not warrant a question. Most of our clients visit the site three or four times in total.</p>',
        },
        {
          pregunta: 'Is the interior design compulsory?',
          respuesta:
            '<p>No. You can contract the build alone. But if it is planned alongside the finishes, the house is handed over complete rather than half dressed, and there is no need to bring trades back in once you are living there.</p>',
        },
        {
          pregunta: 'What if the budget drifts?',
          respuesta:
            '<p>It should be anticipated in the contract. Any change of scope is documented, priced and approved in writing before it is carried out. Overruns discovered at the end are always a management problem, not bad luck.</p>',
        },
      ],
    },
  },

  /* ==================================================================== */
  {
    clave: 'reformas',
    proyectos: ['can-flowers', 'talamanca', 'boadilla'],
    imagen: imgReformas,
    imagenSecundaria: imgReformasSec,
    imagenAlt: {
      es: 'Casa ibicenca de volúmenes encalados al anochecer, con lámina de agua y ciprés iluminado.',
      en: 'Whitewashed Ibizan house at nightfall, with a sheet of water and a floodlit cypress.',
    },
    imagenSecundariaAlt: {
      es: 'Interior diáfano recién entregado, vacío, con carpintería corrida abierta a la terraza.',
      en: 'Newly handed-over open-plan interior, empty, with continuous joinery opening onto the terrace.',
    },
    es: {
      titulo: 'Reformas integrales en Ibiza | Reforma de villas | Unero',
      descripcion:
        'Reformas integrales de casas y villas en Ibiza: estructura, cubierta, instalaciones y acabados. Vemos la casa antes de que la compres.',
      cejilla: 'Servicio',
      h1: 'Reformas integrales en Ibiza',
      entradilla:
        'Rehabilitar, ampliar o cambiar por completo una casa existente. Con una diferencia respecto a la obra nueva: aquí hay que resolver lo que aparece al abrir.',
      cuerpo: [
        'En una reforma, la parte fácil es lo que se ve. Lo que decide el presupuesto y el plazo está debajo: la estructura, la cubierta, la impermeabilización y las instalaciones. Nuestro trabajo consiste en diagnosticar eso bien desde el principio, para que no haya que renegociar la obra en el mes cuatro.',
        'Trabajamos mucho con casas compradas para reformar. Acompañamos a verlas antes de la compra: recorremos, miramos cubierta, buscamos las humedades donde suelen estar, comprobamos si lo construido coincide con lo que consta en el Registro y en el Catastro, y damos una horquilla con sus incógnitas señaladas. No es un presupuesto: es una opinión con criterio de obra, y sirve tanto para negociar el precio como para descartar la casa. Lo hacemos sin coste, porque preferimos decirte que no compres una casa que meternos en una reforma que va a salir mal para los dos.',
        'Con las casas payesas y las fábricas antiguas hay además una cuestión de compatibilidad de materiales. Un muro histórico pintado con pintura plástica se degrada desde el día siguiente: la película impermeable atrapa la humedad dentro. Ahí trabajamos con morteros y pinturas de cal, que dejan respirar al muro. No es romanticismo; es lo único que funciona.',
      ],
      incluyeTitulo: 'Qué abarca una reforma integral',
      incluye: [
        {
          t: 'Diagnóstico previo',
          d: 'Estado de la estructura, la cubierta y las instalaciones. Tipo de humedad: filtración, condensación o capilaridad. Cada una se resuelve de forma distinta y cuesta muy distinto.',
        },
        {
          t: 'Refuerzo estructural',
          d: 'Sustitución de cabezas de viga, refuerzo de forjados y tratamiento de armaduras corroídas, el problema típico cerca del mar.',
        },
        {
          t: 'Cubierta e impermeabilización',
          d: 'Desmontaje, saneado, aislamiento e impermeabilización nueva. En una casa que nunca se ha rehabilitado, no es opcional.',
        },
        {
          t: 'Instalaciones completas',
          d: 'Electricidad y fontanería nuevas conforme a normativa, saneamiento y climatización. Implica abrir y volver a cerrar.',
        },
        {
          t: 'Redistribución',
          d: 'Cambios de tabiquería, apertura de huecos y ampliaciones donde la normativa lo permita.',
        },
        {
          t: 'Acabados e interiorismo',
          d: 'Solados, revestimientos, carpintería, cocina, baños y, si lo quieres, el mobiliario.',
        },
      ],
      criteriosTitulo: 'Cómo lo planteamos',
      criterios: [
        {
          t: 'Catas antes de presupuestar',
          d: 'Abrir un par de puntos para ver qué hay debajo cuesta muy poco y elimina la mayor parte de la incertidumbre.',
        },
        {
          t: 'Partida de contingencias',
          d: 'Una reforma honesta reserva presupuesto para lo que aparezca, y lo dice desde el principio en lugar de descubrirlo después.',
        },
        {
          t: 'Materiales compatibles',
          d: 'Cal sobre fábrica antigua, no pintura plástica. Respetar cómo estaba construido el edificio es lo que hace que la reforma dure.',
        },
        {
          t: 'Conservar lo que vale',
          d: 'Un muro de piedra, unas vigas de sabina o un volumen que hoy no se podría construir son activos. Se restauran, no se sustituyen.',
        },
      ],
      faq: [
        {
          pregunta: '¿Cuánto cuesta una reforma integral en Ibiza?',
          respuesta:
            '<p>Como orden de magnitud, desde unos 1.200-1.800 €/m² con cambio de instalaciones, cubierta y distribución. Sube con acabados de gama alta o con intervención estructural. Si hay que tocar estructura y cubierta completas, el coste puede acercarse al de obra nueva, y con más incertidumbre.</p>',
        },
        {
          pregunta: '¿Es más barato reformar que construir de cero?',
          respuesta:
            '<p>No necesariamente. A cambio, una casa existente puede tener volumen o ubicación que hoy ya no sería posible obtener, y eso es un activo muy valioso. Lo analizamos caso por caso en <a href="/cuaderno/comprar-una-casa-para-reformar-en-ibiza/">este artículo</a>.</p>',
        },
        {
          pregunta: '¿Cuánto dura?',
          respuesta:
            '<p>De 6 a 12 meses de obra para una vivienda, más la tramitación previa. Si no hay cambio de volumen ni de uso, la licencia suele ser bastante más rápida que en obra nueva.</p>',
        },
        {
          pregunta: '¿Podéis ver la casa antes de que la compre?',
          respuesta:
            '<p>Sí, y lo recomendamos. Vamos a verla contigo, te decimos qué nos encontraríamos y damos una horquilla con las incógnitas señaladas. Sin coste.</p>',
        },
      ],
    },
    en: {
      titulo: 'Full home renovations in Ibiza | Villa refurbishment | Unero',
      descripcion:
        'Full renovations of houses and villas in Ibiza: structure, roof, services and finishes. We view the property before you buy it.',
      cejilla: 'Service',
      h1: 'Full renovations in Ibiza',
      entradilla:
        'Refurbish, extend or completely transform an existing house. With one difference from a new build: here you have to resolve whatever appears once it is opened up.',
      cuerpo: [
        'In a renovation, the easy part is what you can see. What decides the cost and the programme is underneath: the structure, the roof, the waterproofing and the services. Our job is to diagnose that properly at the outset, so the job does not have to be renegotiated in month four.',
        'We work a great deal with houses bought to renovate. We will come and view them with you before you buy: we walk through, look at the roof, hunt for damp where it usually hides, check whether what has been built matches what is on record, and give a range with its unknowns flagged. It is not a quote: it is an opinion with a builder’s judgement behind it, and it serves to negotiate the price or to rule the house out. We do it free of charge, because we would rather tell you not to buy a house than get into a renovation that will go badly for both of us.',
        'With traditional Ibizan houses and old masonry there is also a question of material compatibility. A historic wall painted with plastic paint starts deteriorating the next day: the impermeable film traps moisture inside. There we work with lime mortars and lime paints, which let the wall breathe. It is not romanticism; it is the only thing that works.',
      ],
      incluyeTitulo: 'What a full renovation covers',
      incluye: [
        {
          t: 'Initial diagnosis',
          d: 'Condition of structure, roof and services. Type of damp: penetrating, condensation or rising. Each is resolved differently and costs very differently.',
        },
        {
          t: 'Structural strengthening',
          d: 'Replacement of beam ends, slab reinforcement and treatment of corroded rebar, the typical problem near the sea.',
        },
        {
          t: 'Roof and waterproofing',
          d: 'Stripping, making good, insulation and new waterproofing. In a house that has never been refurbished, it is not optional.',
        },
        {
          t: 'Complete services',
          d: 'New electrics and plumbing to current regulations, drainage and climate control. It involves opening up and closing again.',
        },
        {
          t: 'Replanning',
          d: 'Changes to partitions, new openings and extensions where the planning rules allow.',
        },
        {
          t: 'Finishes and interiors',
          d: 'Floors, wall finishes, joinery, kitchen, bathrooms and, if you want it, the furniture.',
        },
      ],
      criteriosTitulo: 'How we approach it',
      criterios: [
        {
          t: 'Opening up before pricing',
          d: 'Opening a couple of points to see what lies beneath costs very little and removes most of the uncertainty.',
        },
        {
          t: 'A contingency allowance',
          d: 'An honest renovation sets budget aside for what may appear, and says so from the start instead of discovering it later.',
        },
        {
          t: 'Compatible materials',
          d: 'Lime on old masonry, not plastic paint. Respecting how the building was made is what makes a renovation last.',
        },
        {
          t: 'Keeping what is worth keeping',
          d: 'A stone wall, sabina beams or a volume that could not be built today are assets. They are restored, not replaced.',
        },
      ],
      faq: [
        {
          pregunta: 'How much does a full renovation in Ibiza cost?',
          respuesta:
            '<p>As an order of magnitude, from around €1,200-1,800 per m² with new services, roof and layout. It rises with high-end finishes or structural work. If the structure and roof both have to be dealt with completely, the cost can approach that of a new build, and with more uncertainty.</p>',
        },
        {
          pregunta: 'Is renovating cheaper than building from scratch?',
          respuesta:
            '<p>Not necessarily. In exchange, an existing house may have volume or a location that could no longer be obtained today, and that is a very valuable asset. We assess it case by case.</p>',
        },
        {
          pregunta: 'How long does it take?',
          respuesta:
            '<p>6 to 12 months of construction for a house, plus the prior paperwork. If there is no change of volume or use, the permit is usually considerably faster than for a new build.</p>',
        },
        {
          pregunta: 'Can you view the house before I buy it?',
          respuesta:
            '<p>Yes, and we recommend it. We come and see it with you, tell you what we would be taking on and give a range with the unknowns flagged. No charge.</p>',
        },
      ],
    },
  },

  /* ==================================================================== */
  {
    clave: 'interiorismo',
    proyectos: ['ses-torres-ii', 'can-cana', 'alina'],
    imagen: imgInteriorismo,
    imagenSecundaria: imgInteriorismoSec,
    imagenAlt: {
      es: 'Isla de cocina en piedra oscura de gran formato con frentes de roble y el salón al fondo.',
      en: 'Kitchen island in large-format dark stone with oak fronts and the living room beyond.',
    },
    imagenSecundariaAlt: {
      es: 'Salón con sofás blancos y terraza abierta al paisaje, con luz natural lateral.',
      en: 'Living room with white sofas and a terrace open to the landscape, with lateral daylight.',
    },
    es: {
      titulo: 'Interiorismo y diseño de interiores en Ibiza | Unero',
      descripcion:
        'Interiorismo en Ibiza para casas de obra nueva y reformas: mobiliario, iluminación, textiles y materiales elegidos a la vez que la arquitectura, no después.',
      cejilla: 'Servicio',
      h1: 'Interiorismo en Ibiza',
      entradilla:
        'Elegir los materiales y el mobiliario a la vez que se proyecta la casa, no cuando ya está construida. Es la diferencia entre una casa coherente y una casa decorada.',
      cuerpo: [
        'El interiorismo que funciona no empieza con un sofá: empieza con una decisión sobre la luz. Donde van las cornisas, si el techo lleva plafones o no, cómo se ilumina un paño de piedra. Todo eso se ejecuta durante la obra, en la fase de tabiquería, y si no se ha decidido antes ya no se puede hacer sin romper.',
        'Por eso trabajamos el interiorismo desde el proyecto y no al final. Cuando entramos con la obra ya acabada, la mitad de las buenas ideas son imposibles.',
        'Nuestro criterio es de pocos materiales llevados con disciplina. Tres o cuatro, repetidos por toda la casa: un roble, una piedra, un blanco mate y un metal. Y una mano muy contenida con el color, porque en Ibiza el color ya lo pone la luz, la buganvilla y el mar. Las casas que envejecen mal son las que intentan competir con eso.',
      ],
      incluyeTitulo: 'Qué hacemos',
      incluye: [
        {
          t: 'Materiales y acabados',
          d: 'Selección de pavimentos, revestimientos, piedra, madera y encimeras, con muestras físicas y despiece dibujado antes de pedir.',
        },
        {
          t: 'Iluminación integrada',
          d: 'Cornisas, huecos y líneas continuas previstos en obra para que el aparato no se vea y el techo quede limpio.',
        },
        {
          t: 'Cocina y baños',
          d: 'Diseño y ejecución de los espacios que más condicionan el uso diario y más trabajo de medida exigen.',
        },
        {
          t: 'Mobiliario y carpintería a medida',
          d: 'Armarios, vestidores, muebles de baño y piezas de encargo, medidas sobre el hueco real.',
        },
        {
          t: 'Textiles y vestido final',
          d: 'Cortinas, tapicerías, alfombras, menaje y vegetación de interior.',
        },
        {
          t: 'Casas para alquiler',
          d: 'Equipamiento pensado para rotación alta: materiales que aguantan, mantenimiento sencillo y reposición fácil.',
        },
      ],
      criteriosTitulo: 'Nuestro criterio',
      criterios: [
        {
          t: 'Pocos materiales, repetidos',
          d: 'Tres o cuatro, llevados por toda la casa. Es lo que hace que una casa se lea como una sola pieza.',
        },
        {
          t: 'Nada brillante',
          d: 'En la isla el brillo acusa la sal y el polvo en una temporada. El mate envejece mucho mejor.',
        },
        {
          t: 'El color lo pone la isla',
          d: 'Paleta neutra dentro para que el verde del pinar, el azul del mar y la buganvilla hagan el trabajo.',
        },
        {
          t: 'Pensado para usarse',
          d: 'Una casa de verano recibe arena, cloro, crema solar y gente descalza. Los materiales se eligen sabiéndolo.',
        },
      ],
      faq: [
        {
          pregunta: '¿Hacéis interiorismo sin la obra?',
          respuesta:
            '<p>Sí, también trabajamos el interiorismo de casas que no hemos construido nosotros. Lo ideal es entrar antes de que se cierren techos y tabiques, porque la iluminación integrada y la carpintería a medida se deciden en esa fase.</p>',
        },
        {
          pregunta: '¿Trabajáis con mi decorador?',
          respuesta:
            '<p>Sí. En ese caso nuestro papel es ejecutar bien lo que se ha diseñado y avisar de lo que no va a funcionar por plazo de suministro o por condiciones de la isla.</p>',
        },
        {
          pregunta: '¿Y si la casa es para alquilar?',
          respuesta:
            '<p>Cambia el criterio por completo. Una casa de alquiler necesita materiales que aguanten rotación alta, mantenimiento sencillo y piezas que se puedan reponer sin rehacer el conjunto. Lo planteamos de otra manera desde el principio.</p>',
        },
      ],
    },
    en: {
      titulo: 'Interior design in Ibiza | Unero',
      descripcion:
        'Interior design in Ibiza for new builds and renovations: furniture, lighting, textiles and materials chosen alongside the architecture, not afterwards.',
      cejilla: 'Service',
      h1: 'Interior design in Ibiza',
      entradilla:
        'Choosing the materials and the furniture while the house is being designed, not once it is built. That is the difference between a coherent house and a decorated one.',
      cuerpo: [
        'Interior design that works does not start with a sofa: it starts with a decision about light. Where the coves go, whether the ceiling carries fittings or not, how a stone panel is lit. All of that is executed during construction, at the partitioning stage, and if it has not been decided beforehand it can no longer be done without breaking things.',
        'That is why we work on interiors from the design stage and not at the end. When we come in with the building already finished, half the good ideas are impossible.',
        'Our approach is few materials, carried with discipline. Three or four, repeated throughout the house: an oak, a stone, a matt white and a metal. And a very restrained hand with colour, because in Ibiza the colour is already provided by the light, the bougainvillea and the sea. The houses that age badly are the ones that try to compete with that.',
      ],
      incluyeTitulo: 'What we do',
      incluye: [
        {
          t: 'Materials and finishes',
          d: 'Selection of floors, wall finishes, stone, timber and worktops, with physical samples and setting out drawn before ordering.',
        },
        {
          t: 'Integrated lighting',
          d: 'Coves, recesses and continuous lines planned during construction so the fitting is never seen and the ceiling stays clean.',
        },
        {
          t: 'Kitchen and bathrooms',
          d: 'Design and execution of the spaces that most shape daily use and demand the most precise setting out.',
        },
        {
          t: 'Bespoke furniture and joinery',
          d: 'Wardrobes, dressing rooms, bathroom units and commissioned pieces, measured against the real opening.',
        },
        {
          t: 'Textiles and final dressing',
          d: 'Curtains, upholstery, rugs, tableware and interior planting.',
        },
        {
          t: 'Houses for rental',
          d: 'Specification designed for high turnover: materials that last, simple maintenance and easy replacement.',
        },
      ],
      criteriosTitulo: 'Our approach',
      criterios: [
        {
          t: 'Few materials, repeated',
          d: 'Three or four, carried through the whole house. It is what makes a house read as a single piece.',
        },
        {
          t: 'Nothing glossy',
          d: 'On the island, gloss shows up salt and dust within a season. Matt ages far better.',
        },
        {
          t: 'The island supplies the colour',
          d: 'A neutral palette indoors so the green of the pines, the blue of the sea and the bougainvillea do the work.',
        },
        {
          t: 'Designed to be used',
          d: 'A summer house receives sand, chlorine, sun cream and bare feet. The materials are chosen knowing that.',
        },
      ],
      faq: [
        {
          pregunta: 'Do you do interiors without the construction?',
          respuesta:
            '<p>Yes, we also work on interiors for houses we did not build. Ideally we come in before ceilings and partitions are closed, because integrated lighting and bespoke joinery are decided at that stage.</p>',
        },
        {
          pregunta: 'Do you work with my decorator?',
          respuesta:
            '<p>Yes. In that case our role is to execute what has been designed properly, and to flag anything that will not work because of lead times or island conditions.</p>',
        },
        {
          pregunta: 'What if the house is for rental?',
          respuesta:
            '<p>The approach changes completely. A rental house needs materials that cope with high turnover, simple maintenance and pieces that can be replaced without redoing the whole scheme. We plan it differently from the start.</p>',
        },
      ],
    },
  },

  /* ==================================================================== */
  {
    clave: 'promociones',
    proyectos: ['ses-torres-ii', 'marbella', 'boadilla'],
    imagen: imgPromociones,
    imagenSecundaria: imgPromocionesSec,
    imagenAlt: {
      es: 'Edificio de viviendas de obra nueva con fachada de hormigón y locales en planta baja.',
      en: 'New-build apartment building with a concrete façade and commercial units at ground level.',
    },
    imagenSecundariaAlt: {
      es: 'Acceso de una vivienda de obra nueva con puerta de madera, zócalo de piedra y volumen blanco.',
      en: 'Entrance to a new-build house with a timber door, stone plinth and white volume.',
    },
    es: {
      titulo: 'Promociones de viviendas en Ibiza | Unero',
      descripcion:
        'Promociones de viviendas en Ibiza para inversores y propietarios de suelo. Control de coste, plazo y calidad, con promoción propia acreditada.',
      cejilla: 'Servicio',
      h1: 'Promociones de viviendas',
      entradilla:
        'Desarrollamos vivienda para inversores y propietarios de suelo. Y también la promovemos nosotros, lo que cambia bastante cómo miramos un número.',
      cuerpo: [
        'Hemos sido promotores de nuestras propias viviendas, no solo contratistas de las de otros. Ses Torres II fue una promoción nuestra: la proyectamos, la construimos y la vendimos completa, con el interiorismo incluido. Esa experiencia cambia la conversación: cuando alguien nos trae un estudio de viabilidad, entendemos qué partidas se comen el margen y en qué momento del calendario se pierde el dinero.',
        'Para un propietario de suelo que no quiere promover, o para un inversor que no está en la isla, el valor está en tener un solo responsable de coste, plazo y calidad, con capacidad de dar la cara ante el comprador final. La postventa de una promoción es tan importante como la obra: una promoción con incidencias mal resueltas arruina la reputación que se tarda años en construir.',
        'Y hay un componente local que no es menor. En Ibiza, el suelo residencial es escaso y la tramitación lenta. Conocer los tiempos reales de cada ayuntamiento y la disponibilidad de los oficios por temporada es lo que separa un calendario que se cumple de uno que se presenta bonito y se incumple.',
      ],
      incluyeTitulo: 'Qué aportamos',
      incluye: [
        {
          t: 'Estudio de viabilidad',
          d: 'Comprobación de edificabilidad, análisis de condicionantes del suelo y presupuesto de ejecución realista para el estudio económico.',
        },
        {
          t: 'Gestión de la tramitación',
          d: 'Coordinación técnica y seguimiento de licencias, con plazos dichos de antemano y no optimistas.',
        },
        {
          t: 'Ejecución con control de coste',
          d: 'Presupuesto por partidas medidas, certificaciones mensuales y control de desviaciones documentado.',
        },
        {
          t: 'Calidad homogénea',
          d: 'En una promoción, todas las unidades tienen que salir igual. Es un problema de procedimiento, no de buenas intenciones.',
        },
        {
          t: 'Interiorismo de piso piloto',
          d: 'Vestir la unidad muestra y definir el equipamiento de serie, que es lo que decide muchas ventas.',
        },
        {
          t: 'Postventa',
          d: 'Atención de incidencias durante el periodo de garantía, con el comprador final y con la promotora.',
        },
      ],
      criteriosTitulo: 'Cómo lo abordamos',
      criterios: [
        {
          t: 'Presupuesto que aguanta',
          d: 'Preferimos dar un número realista y cumplirlo antes que ganar el encargo con un precio que luego hay que renegociar.',
        },
        {
          t: 'Calendario contra temporada',
          d: 'Planificar el movimiento de tierras y el hormigonado fuera de los meses de más afluencia y restricción de ruido.',
        },
        {
          t: 'Acabados reponibles',
          d: 'Materiales con continuidad de suministro. En una promoción, un material descatalogado a mitad de obra es un problema serio.',
        },
        {
          t: 'Documentación completa',
          d: 'As-built, manuales y certificados por unidad. Es lo que permite una postventa ordenada y una entrega sin discusiones.',
        },
      ],
      faq: [
        {
          pregunta: 'Tengo un solar. ¿Qué opciones tengo?',
          respuesta:
            '<p>Básicamente tres: promoverlo tú y contratarnos la obra, aportarlo a una operación conjunta, o venderlo. Lo primero que hacemos es comprobar qué se puede construir realmente y con qué coste, porque sin eso las tres opciones se valoran a ciegas.</p>',
        },
        {
          pregunta: '¿Trabajáis con inversores de fuera de la isla?',
          respuesta:
            '<p>Sí. Enviamos informes periódicos de avance y certificación, y agrupamos las decisiones para que se puedan tomar a distancia sin frenar la obra.</p>',
        },
        {
          pregunta: '¿Podéis encargaros también de la venta?',
          respuesta:
            '<p>No somos agencia inmobiliaria. Sí podemos preparar la promoción para venderse bien —unidad muestra vestida, documentación en orden, material fotográfico— y trabajamos con agencias de la isla.</p>',
        },
      ],
    },
    en: {
      titulo: 'Residential developments in Ibiza | Unero',
      descripcion:
        'Residential schemes in Ibiza for investors and landowners. Cost, programme and quality control, with a proven record as developers.',
      cejilla: 'Service',
      h1: 'Residential developments',
      entradilla:
        'We develop housing for investors and landowners. And we have developed our own, which changes how we look at a set of numbers.',
      cuerpo: [
        'We have been developers of our own housing, not only contractors on other people’s. Ses Torres II was our own development: we designed it, built it and sold it complete, interior design included. That experience changes the conversation: when someone brings us a feasibility study, we understand which items eat the margin and at what point in the calendar the money is lost.',
        'For a landowner who does not want to develop, or an investor who is not on the island, the value lies in having one party accountable for cost, programme and quality, able to face the end buyer. Aftercare on a development matters as much as the build: a scheme with badly resolved defects destroys a reputation that takes years to build.',
        'And there is a local component that is not minor. In Ibiza, residential land is scarce and the paperwork slow. Knowing the real timescales of each town hall and the seasonal availability of the trades is what separates a programme that is met from one that presents well and is missed.',
      ],
      incluyeTitulo: 'What we bring',
      incluye: [
        {
          t: 'Feasibility study',
          d: 'Verification of development potential, analysis of ground constraints and a realistic construction budget for the financial appraisal.',
        },
        {
          t: 'Management of the process',
          d: 'Technical coordination and permit tracking, with timescales stated up front rather than optimistically.',
        },
        {
          t: 'Delivery with cost control',
          d: 'Budget by measured items, monthly certificates and documented control of variances.',
        },
        {
          t: 'Consistent quality',
          d: 'In a development, every unit has to come out the same. That is a matter of procedure, not good intentions.',
        },
        {
          t: 'Show-home interiors',
          d: 'Dressing the show unit and defining the standard specification, which is what decides many sales.',
        },
        {
          t: 'Aftercare',
          d: 'Handling defects during the guarantee period, with the end buyer and with the developer.',
        },
      ],
      criteriosTitulo: 'How we approach it',
      criterios: [
        {
          t: 'A budget that holds',
          d: 'We would rather give a realistic figure and meet it than win the job with a price that has to be renegotiated later.',
        },
        {
          t: 'Programming around the season',
          d: 'Planning earthworks and concrete pours outside the months of peak activity and noise restrictions.',
        },
        {
          t: 'Replaceable finishes',
          d: 'Materials with continuity of supply. In a development, a product discontinued mid-build is a serious problem.',
        },
        {
          t: 'Complete documentation',
          d: 'As-built, manuals and certificates per unit. It is what allows orderly aftercare and a handover without arguments.',
        },
      ],
      faq: [
        {
          pregunta: 'I own a plot. What are my options?',
          respuesta:
            '<p>Essentially three: develop it yourself and contract us for the build, contribute it to a joint venture, or sell it. The first thing we do is establish what can actually be built and at what cost, because without that all three options are being valued blind.</p>',
        },
        {
          pregunta: 'Do you work with investors from outside the island?',
          respuesta:
            '<p>Yes. We send regular progress and certification reports, and group decisions so they can be taken remotely without holding up the work.</p>',
        },
        {
          pregunta: 'Can you handle the sales too?',
          respuesta:
            '<p>We are not an estate agency. We can prepare the development to sell well — dressed show unit, documentation in order, photography — and we work with agencies on the island.</p>',
        },
      ],
    },
  },
];

export function servicioPorClave(clave: ClaveRuta) {
  return SERVICIOS.find((s) => s.clave === clave);
}
