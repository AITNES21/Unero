"""
Entrecomilla los valores de frontmatter que YAML no puede leer sin comillas.

Uso:  python scripts/normalizar-frontmatter.py

El caso que se repite: un texto en español con dos puntos seguidos de
espacio («Aquí no hay plafones: hay cornisas») rompe el YAML, porque el
parser interpreta esos dos puntos como el separador de una clave nueva.
Es el error más habitual al redactar contenido a mano y el mensaje del
build no ayuda mucho a localizarlo.

El script solo toca lo imprescindible: añade comillas dobles a los
escalares que las necesitan y deja intacto todo lo demás. Es idempotente:
pasarlo dos veces no cambia nada.
"""
import glob
import io
import re

BARRA = chr(92)    # \
COMILLA = chr(34)  # "

# Clave con valor en la misma línea:  clave: valor   /   - clave: valor
CLAVE_CON_VALOR = re.compile(r'^(\s*(?:- )?[A-Za-z_][A-Za-z0-9_]*:)[ \t]+(.*)$')
# Elemento de lista con texto libre:  - texto
ELEMENTO_LISTA = re.compile(r'^(\s*- )(?![ \t])(.*)$')
# Elemento de lista que abre un mapa anidado:  - clave:
# No se debe entrecomillar: es una clave, no un texto.
ABRE_MAPA = re.compile(r'^[A-Za-z_][A-Za-z0-9_]*:[ \t]*$')


def necesita_comillas(valor: str) -> bool:
    v = valor.strip()
    if not v:
        return False
    # Ya entrecomillado, o es una estructura YAML (lista, mapa, bloque).
    if v[0] in COMILLA + "'[]{}|>":
        return False
    # Una clave que abre un mapa anidado se deja como está.
    if ABRE_MAPA.match(v):
        return False
    # Estos tres casos son los que rompen el parser.
    return ': ' in v or v.endswith(':') or ' #' in v


def entrecomillar(valor: str) -> str:
    v = valor.strip()
    v = v.replace(BARRA, BARRA + BARRA).replace(COMILLA, BARRA + COMILLA)
    return COMILLA + v + COMILLA


def procesar(ruta: str) -> int:
    texto = io.open(ruta, encoding='utf-8').read()
    if not texto.startswith('---'):
        return 0
    try:
        fin = texto.index('\n---', 3)
    except ValueError:
        return 0

    frontmatter, resto = texto[3:fin], texto[fin:]
    lineas = frontmatter.split('\n')
    cambios = 0

    for i, linea in enumerate(lineas):
        con_valor = CLAVE_CON_VALOR.match(linea)
        if con_valor and necesita_comillas(con_valor.group(2)):
            lineas[i] = con_valor.group(1) + ' ' + entrecomillar(con_valor.group(2))
            cambios += 1
            continue

        elemento = ELEMENTO_LISTA.match(linea)
        if elemento and not con_valor and necesita_comillas(elemento.group(2)):
            lineas[i] = elemento.group(1) + entrecomillar(elemento.group(2))
            cambios += 1

    if cambios:
        io.open(ruta, 'w', encoding='utf-8', newline='\n').write(
            '---' + '\n'.join(lineas) + resto
        )
    return cambios


def main():
    total = 0
    for ruta in sorted(glob.glob('src/content/**/*.md', recursive=True)):
        cambios = procesar(ruta)
        if cambios:
            print('%3d %s' % (cambios, ruta))
            total += cambios
    print('Valores entrecomillados:', total)


if __name__ == '__main__':
    main()
