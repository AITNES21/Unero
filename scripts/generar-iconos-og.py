"""
Genera los iconos PNG y las imágenes de redes sociales (Open Graph).

Uso:  python scripts/generar-iconos-og.py

Los iconos se dibujan a partir de la misma geometría del logotipo que
usa el componente Logo.astro, de modo que no puedan desincronizarse.

Las imágenes Open Graph se recortan a 1200×630 desde las fotografías
de proyecto y llevan un velo inferior con el logotipo, para que un
enlace compartido en WhatsApp o LinkedIn se vea como marca y no como
una foto suelta. La web anterior apuntaba a una foto 1600×1200, que
las redes recortaban por el centro de forma imprevisible.
"""
import io
import os
from PIL import Image, ImageDraw, ImageFont

RAIZ = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
PUBLICO = os.path.join(RAIZ, 'public')
ASSETS = os.path.join(RAIZ, 'src', 'assets')

TINTA = (23, 24, 26)
CAL = (247, 244, 238)

# Geometría del símbolo, en un lienzo de 55×59 (la misma del SVG).
VOLUMEN_CLARO = [(0, 17), (13, 10), (13, 46), (27, 46), (27, 59), (0, 59)]
VOLUMEN_OSCURO = [(28, 0), (55, 17), (55, 59), (42, 59), (42, 21), (28, 12)]


def dibujar_marca(lado, fondo, tinta_marca, margen=0.2):
    """Devuelve un icono cuadrado con el símbolo centrado."""
    # Se dibuja al cuádruple y se reduce: bordes suaves sin antialias propio.
    escala = 4
    lienzo = Image.new('RGB', (lado * escala, lado * escala), fondo)
    dibujo = ImageDraw.Draw(lienzo, 'RGBA')

    util = lado * escala * (1 - margen * 2)
    factor = min(util / 55, util / 59)
    ancho, alto = 55 * factor, 59 * factor
    dx = (lado * escala - ancho) / 2
    dy = (lado * escala - alto) / 2

    def puntos(forma):
        return [(dx + x * factor, dy + y * factor) for x, y in forma]

    dibujo.polygon(puntos(VOLUMEN_CLARO), fill=tinta_marca + (140,))
    dibujo.polygon(puntos(VOLUMEN_OSCURO), fill=tinta_marca + (255,))

    return lienzo.resize((lado, lado), Image.LANCZOS)


def fuente(tamano, negrita=False):
    """Busca una tipografía del sistema; si no hay, usa la de PIL."""
    candidatas = [
        r'C:\Windows\Fonts\segoeuisl.ttf',
        r'C:\Windows\Fonts\segoeui.ttf',
        r'C:\Windows\Fonts\arial.ttf',
        '/System/Library/Fonts/Helvetica.ttc',
        '/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf',
    ]
    if negrita:
        candidatas = [r'C:\Windows\Fonts\segoeuib.ttf', r'C:\Windows\Fonts\arialbd.ttf'] + candidatas
    for ruta in candidatas:
        if os.path.exists(ruta):
            try:
                return ImageFont.truetype(ruta, tamano)
            except OSError:
                continue
    return ImageFont.load_default()


def letras_espaciadas(dibujo, xy, texto, fnt, relleno, espaciado):
    """Dibuja texto con letter-spacing, que PIL no soporta de serie."""
    x, y = xy
    for caracter in texto:
        dibujo.text((x, y), caracter, font=fnt, fill=relleno)
        x += dibujo.textlength(caracter, font=fnt) + espaciado
    return x


def generar_og(origen, destino, titulo, subtitulo):
    """Recorta una fotografía a 1200×630 y le añade el velo con la marca."""
    ANCHO, ALTO = 1200, 630
    imagen = Image.open(origen).convert('RGB')

    # Recorte de cobertura centrado en el tercio superior, que es donde
    # suele estar la arquitectura en estas fotografías.
    proporcion = max(ANCHO / imagen.width, ALTO / imagen.height)
    nuevo = (round(imagen.width * proporcion), round(imagen.height * proporcion))
    imagen = imagen.resize(nuevo, Image.LANCZOS)
    izquierda = (imagen.width - ANCHO) // 2
    arriba = max(0, int((imagen.height - ALTO) * 0.38))
    imagen = imagen.crop((izquierda, arriba, izquierda + ANCHO, arriba + ALTO))

    # Velo inferior en degradado. Tiene que ser generoso: estas tarjetas
    # se ven a tamaño pequeno en WhatsApp y el texto debe leerse sobre
    # cualquier fotografía, incluida una fachada blanca a pleno sol.
    velo = Image.new('L', (1, ALTO))
    for y in range(ALTO):
        p = y / ALTO
        if p < 0.22:
            alfa = 0.0
        elif p < 0.60:
            # Tramo de entrada: sube rápido para que el subtítulo ya
            # apoye sobre fondo oscuro.
            alfa = 205 * ((p - 0.22) / 0.38) ** 0.75
        else:
            alfa = 205 + 47 * ((p - 0.60) / 0.40)
        velo.putpixel((0, y), int(min(alfa, 252)))
    velo = velo.resize((ANCHO, ALTO))
    imagen = Image.composite(Image.new('RGB', (ANCHO, ALTO), TINTA), imagen, velo)

    dibujo = ImageDraw.Draw(imagen, 'RGBA')

    # Símbolo dibujado directamente sobre la imagen: pegar un icono
    # cuadrado arrastraría su fondo y quedaría un recuadro oscuro.
    LADO = 46
    factor = LADO / 59
    bx, by = 72, ALTO - 118

    def puntos(forma):
        return [(bx + x * factor, by + y * factor) for x, y in forma]

    dibujo.polygon(puntos(VOLUMEN_CLARO), fill=CAL + (140,))
    dibujo.polygon(puntos(VOLUMEN_OSCURO), fill=CAL + (255,))

    letras_espaciadas(
        dibujo, (bx + LADO * (55 / 59) + 20, by + 9), 'UNERO', fuente(27, True), CAL, 6.5
    )

    # Título del contenido.
    dibujo.text((72, ALTO - 188), titulo, font=fuente(54), fill=CAL)

    if subtitulo:
        letras_espaciadas(
            dibujo, (72, ALTO - 228), subtitulo.upper(), fuente(19), (196, 190, 180), 3.4
        )

    imagen.save(destino, quality=88, optimize=True)
    print('  OG ', os.path.relpath(destino, RAIZ), imagen.size)


def main():
    os.makedirs(os.path.join(PUBLICO, 'og'), exist_ok=True)

    # --- Iconos ---
    iconos = [(96, 'favicon-96.png'), (180, 'apple-touch-icon.png'), (512, 'icon-512.png')]
    for lado, nombre in iconos:
        icono = dibujar_marca(lado, TINTA, CAL, margen=0.2)
        icono.save(os.path.join(PUBLICO, nombre), optimize=True)
        print('  icono', nombre, f'{lado}x{lado}')

    # --- Open Graph ---
    tarjetas = [
        ('proyectos/ses-torres-ii/foto10.webp', 'unero-portada.jpg',
         'Construimos casas para vivir Ibiza', 'Constructora en Ibiza'),
        ('proyectos/can-cana/foto1.webp', 'unero-proyectos.jpg',
         'Lo que hemos construido', 'Proyectos en Ibiza'),
    ]
    for relativo, nombre, titulo, subtitulo in tarjetas:
        generar_og(
            os.path.join(ASSETS, *relativo.split('/')),
            os.path.join(PUBLICO, 'og', nombre),
            titulo,
            subtitulo,
        )


if __name__ == '__main__':
    main()
