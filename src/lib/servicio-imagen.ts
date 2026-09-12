import type { LocalImageService } from 'astro';
import sharpService from 'astro/assets/services/sharp';

/**
 * Servicio de imagen propio: el de Astro más un reenfoque al reducir.
 *
 * Por qué hace falta. Cuando una fotografía de 1920 px se sirve a 900,
 * el remuestreo promedia píxeles y el resultado sale blando: es física
 * del escalado, no un defecto de Astro ni del fichero. Cualquier flujo
 * de trabajo fotográfico serio aplica una máscara de enfoque después de
 * reducir, y eso es exactamente lo que falta aquí.
 *
 * Importante: esto **no inventa detalle**. Solo recupera el contraste
 * local que se pierde al promediar. Distinto de un «mejorador» por IA,
 * que sí se inventa texturas — inaceptable en fotografía de obra, donde
 * lo que se está enseñando es precisamente el acabado real.
 *
 * Solo se aplica al reducir. Una imagen servida a su tamaño original no
 * se toca: enfocarla solo realzaría los artefactos de compresión que ya
 * trae de fábrica.
 */

/** Ajuste conservador. Verificado midiendo, no a ojo: ver scripts/nitidez.mjs */
const ENFOQUE = {
  // Radio del desenfoque gaussiano de referencia, en píxeles.
  sigma: 0.7,
  // Realce en zonas planas. Bajo, para no marcar el grano ni el cielo.
  m1: 0.4,
  // Realce en los bordes, que es donde interesa.
  m2: 1.6,
};

/** A partir de esta reducción el remuestreo empieza a notarse. */
const REDUCCION_MINIMA = 1.15;

const servicio: LocalImageService = {
  ...sharpService,

  async transform(inputBuffer, transformOptions, config, logger) {
    // Se delega primero en Astro para conocer el formato de salida y
    // tener una versión válida a la que recurrir. Cuando además toca
    // reenfocar, la imagen se codifica dos veces: cuesta unos segundos
    // de build y se prefiere a arriesgar la corrección replicando aquí
    // la lógica de formatos de Astro.
    const salida = await sharpService.transform(
      inputBuffer,
      transformOptions,
      config,
      logger
    );

    /* Se leen las opciones a través de un tipo laxo: la firma pública
       de LocalImageTransform no expone width/height/fit como opcionales
       y el estrechamiento directo no compila. */
    const opcionesTransformacion = transformOptions as unknown as {
      width?: number;
      height?: number;
      fit?: string;
      position?: string;
    };

    const anchoPedido = opcionesTransformacion.width;
    if (!anchoPedido || salida.format === 'svg') return salida;

    let sharp;
    try {
      sharp = (await import('sharp')).default;
    } catch {
      // Sin sharp no hay nada que hacer: se devuelve tal cual.
      return salida;
    }

    const original = sharp(inputBuffer, { failOn: 'none', limitInputPixels: false });
    const meta = await original.metadata();
    const anchoOrigen = meta.width ?? 0;

    // Solo si se ha reducido de verdad.
    if (!anchoOrigen || anchoOrigen < anchoPedido * REDUCCION_MINIMA) {
      return salida;
    }

    /*
      Se reconstruye desde el buffer de entrada en lugar de reenfocar la
      salida ya codificada: descodificar y volver a codificar añadiría
      una segunda generación de pérdida, que es justo lo que se quiere
      evitar. Se paga con una decodificación extra en el build.
    */
    const canalizacion = sharp(inputBuffer, {
      failOn: 'none',
      limitInputPixels: false,
    })
      .rotate()
      .resize({
        width: Math.round(anchoPedido),
        height: opcionesTransformacion.height
          ? Math.round(opcionesTransformacion.height)
          : undefined,
        fit: opcionesTransformacion.fit === 'cover' ? 'cover' : undefined,
        position: opcionesTransformacion.position,
        withoutEnlargement: true,
        kernel: 'lanczos3',
      })
      .sharpen(ENFOQUE);

    const opciones = config.service.config as Record<string, unknown>;

    try {
      switch (salida.format) {
        case 'webp':
          canalizacion.webp((opciones.webp as object) ?? { quality: 82 });
          break;
        case 'avif':
          canalizacion.avif((opciones.avif as object) ?? { quality: 65 });
          break;
        case 'jpeg':
        case 'jpg':
          canalizacion.jpeg((opciones.jpeg as object) ?? { quality: 82 });
          break;
        case 'png':
          canalizacion.png((opciones.png as object) ?? {});
          break;
        default:
          return salida;
      }

      const data = await canalizacion.toBuffer();
      return { data, format: salida.format };
    } catch {
      // Ante cualquier problema, la versión de Astro sin reenfocar.
      return salida;
    }
  },
};

export default servicio;
