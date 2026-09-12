# Contenido pendiente

Lista de lo que hace falta para cerrar la web. Está ordenada por urgencia:
lo primero afecta al cumplimiento legal, lo segundo a la credibilidad de
las fichas y lo tercero a cuánto tráfico capta el sitio.

Todo se puede rellenar desde el panel en **app.pagescms.org** sin tocar
código, salvo lo que se indique.

---

## 1. Urgente — obligaciones legales

La web anterior tenía Google Analytics y un formulario de contacto sin
ningún texto legal. Eso es un incumplimiento del RGPD y del artículo 10 de
la LSSI, con sanción posible. Los tres documentos ya están redactados y
publicados, pero les faltan **los datos de identificación que solo puede
aportar la empresa**:

| Dato | Aparece en |
| --- | --- |
| Denominación social completa (la que figura en el Registro) | Aviso legal, Privacidad |
| CIF | Aviso legal, Privacidad |
| Domicilio social completo (calle, número, código postal) | Aviso legal, Privacidad |
| Datos registrales (Registro Mercantil, tomo, folio, hoja) | Aviso legal |

Mientras falten, las tres páginas legales muestran un aviso visible
señalando qué les falta. Es deliberado: un documento legal incompleto y
silencioso es peor que uno que lo dice.

**Dónde se cambia:** `src/config/legal.ts`. Requiere una edición de código,
son cuatro líneas. Al completarlos, borrar la propiedad `pendiente` de cada
documento para que el aviso desaparezca.

### Otro asunto legal, ya resuelto

En la web anterior, la página de trasteros publicaba la dirección
**«Calle Ejemplo, 123»** — un texto de relleno que llegó a producción. Se ha
retirado. Para recuperarla hace falta **la dirección real de la instalación
de Móstoles**, que además permitirá completar su ficha en Google y que
aparezca en las búsquedas locales de la zona.

Y un fichero que estaba accesible públicamente: `Cas Mut clientes-1.pdf`
(24 MB) se descargaba desde `unero.es/Casas/imgcasmut/`. Al llamarse
«clientes» y no estar enlazado desde ninguna parte, se ha movido fuera de
la web, a la carpeta `docs-internos/`. **Conviene revisar si contiene datos
personales**; si es así, no debería estar tampoco en el repositorio.

---

## 2. Importante — fichas de proyecto

Las fichas están escritas describiendo **únicamente lo que muestran las
fotografías**. No se ha inventado ningún dato: los campos que no constaban
se han dejado vacíos, y un campo vacío simplemente no se muestra.

Eso hace que las fichas técnicas estén más flojas de lo que podrían. Con
estos datos, cada proyecto gana una tabla completa y varias palabras clave
de cola larga:

| Proyecto | Falta confirmar |
| --- | --- |
| **Ses Torres II** | Año · superficie construida · superficie de parcela · estudio de arquitectura |
| **Can Cana** | Año · superficies · municipio exacto · arquitectura |
| **Alina** | Año · superficies · municipio exacto · arquitectura |
| **Can Flowers** | Año · superficies · municipio · **¿fue reforma u obra nueva?** (está publicado como reforma) |
| **Talamanca** | Año · superficies · alcance exacto |
| **Marbella** | Año · superficies · alcance |
| **Boadilla** | Año · superficies · alcance |
| **Vista Alegre** | **Ubicación (sin confirmar)** · año · superficies |

### Dos cuestiones que requieren una respuesta vuestra

**Vista Alegre: ¿dónde está?** El nombre apunta a la península, pero las
fotografías son inequívocamente mediterráneas: buganvilla, pinar, piedra
caliza, piscina desbordante. Se ha publicado **sin ubicación** para no
atribuirle un emplazamiento que no consta. Aparece en «Todos» del catálogo
pero no en los filtros de Ibiza ni de Península.

**Cas Mut: ¿la construisteis vosotros?** Es la mejor fotografía del archivo
—hormigón visto, piedra seca, madera y agua, exactamente la paleta que
mejor representa a la marca— y ahora mismo solo figura como villa en
alquiler, que es lo único documentado. **Si la obra es vuestra, merece una
ficha propia de proyecto y ser la portada del catálogo.**

### Municipio, no solo «Ibiza»

Hoy la mayoría de las fichas dicen «Ibiza, Islas Baleares». Cambiarlo por el
municipio real —Santa Eulària des Riu, Sant Josep de sa Talaia, Sant Joan de
Labritja…— es una de las mejoras de SEO local más rentables que quedan:
cada municipio es una búsqueda con intención propia y sin apenas
competencia.

---

## 3. Fotografía — lo que más limita la web ahora mismo

Esta es la carencia más seria, y ninguna decisión de diseño la compensa.
Hay **95 fotografías** en el archivo, pero solo dos conjuntos tienen
resolución para ocupar una pantalla completa.

### Estado del archivo

| Conjunto | Fotos | Resolución | Sirve para |
| --- | --- | --- | --- |
| Ses Torres II | 12 | 1920×1358 | Todo, incluido el hero. **El mejor conjunto.** |
| Cas Mut | 1 | 1920×1080 | Todo. Pero es **una sola foto.** |
| Marbella | 8 | 1600×1066 | Ficha y galería |
| Can Flowers | 11 | 1600×1066 a 1080×700 | Ficha y galería |
| Boadilla | 9 | 1600×1200 | Ficha y galería |
| Can Cana | 11 | 865×648 | Solo tarjetas pequeñas |
| Vista Alegre | 6 | 865×648 | Solo tarjetas pequeñas |
| Alina | 11 | 768×1024 (una a 507×322) | Solo tarjetas pequeñas |
| **Talamanca** | 7 | **640×427** | Apenas llega a miniatura |

Can Cana es, por composición, uno de los proyectos más atractivos que
tenéis —el patio del olivo con el óculo es una imagen excelente— y está
limitado a tarjeta pequeña por resolución. Es el caso en el que un
reportaje nuevo rendiría más.

### Reportaje que encargaríamos, por orden de prioridad

1. **Cas Mut completa.** 15-20 fotografías: exteriores a distintas horas,
   el muro de piedra seca, el frente acristalado de dos alturas, interiores
   y detalles de material. Es el proyecto que mejor explica la marca.
2. **Can Cana y Alina en alta resolución.** Reportaje nuevo de los mismos
   espacios, a 3000 px de lado largo como mínimo.
3. **Una fachada a contraluz al atardecer.** Ahora mismo no hay ninguna
   imagen así, y es la que mejor funcionaría como portada alternativa.
4. **Obra en ejecución.** Solo hay una fotografía de obra (`site/foto8`,
   la de la excavación con armaduras) y se está usando en cuatro páginas
   distintas. Hacen falta: encofrado, hormigonado, montaje de carpintería,
   una cubierta a medio impermeabilizar, y cualquier detalle constructivo
   bien resuelto. Para una constructora es el material que más credibilidad
   aporta y el que menos tiene.
5. **El equipo.** Ni una sola fotografía de personas. La página «Estudio»
   habla de que «quien habla contigo el primer día es quien está en la
   parcela» y no se le puede poner cara. Un retrato del equipo en obra
   valdría más que tres párrafos.
6. **Antes y después de una reforma.** El brief pedía este formato y no
   se ha podido montar porque no hay ni un solo «antes» en el archivo. Es
   el contenido más persuasivo que existe para vender reformas.
7. **Detalles de material en primer plano.** Cal, piedra seca, hormigón
   encofrado, sabina, travertino. Alimentarían el Cuaderno y las páginas
   de servicio, hoy ilustradas con fotos de proyecto reutilizadas.

### Requisitos técnicos para el fotógrafo

- **3000 px** de lado largo como mínimo, en JPEG de calidad alta.
- Tanto **horizontal como vertical** de cada espacio: el móvil necesita
  verticales y el archivo casi no tiene.
- **Sin marca de agua** y con cesión de uso para web por escrito.
- Interiores con **luz natural**, sin flash directo.
- Y una petición concreta: **fotografiar también la casa vacía**, antes de
  amueblarla. Es lo que se ha hecho con Talamanca y funciona muy bien para
  una constructora, porque enseña la obra y no la decoración.

---

## 4. Recomendable — datos que mejoran la conversión

**Dirección postal completa en Ibiza.** Sin ella no se puede completar el
`schema.org` de tipo LocalBusiness ni verificar el perfil de empresa de
Google, que es la mayor palanca de SEO local que existe. Es, con
diferencia, el dato pendiente con más impacto comercial.

**Perfil de empresa en Google.** Crearlo o reclamarlo, con fotografías,
horario, zona de servicio y enlace a la web. Y pedir reseñas a los clientes
de las obras ya entregadas. Para «constructora Ibiza» las reseñas pesan
mucho en el mapa de resultados.

**Testimonios de clientes.** No hay ninguno en la web. En una decisión de
600.000 euros, el testimonio de alguien que ya pasó por ello es el elemento
más persuasivo que puede haber. Con tres bastaría. Idealmente con nombre,
proyecto y, si aceptan, fotografía.

**Colaboraciones con estudios de arquitectura.** La página «Estudio» tiene
una sección dirigida a arquitectos. Nombrar a los estudios con los que
habéis trabajado —con su permiso— aportaría credibilidad y, probablemente,
algún enlace entrante desde sus webs.

**Años de experiencia y cifras.** El logotipo dice «Est. 2011» y es el
único dato duro publicado. Si hay cifras verificables —número de viviendas
entregadas, metros cuadrados construidos, plantilla— dicen más que
cualquier adjetivo.

**Certificaciones y seguros.** Clasificación de contratista, seguro de
responsabilidad civil, seguro decennal, adhesión a asociaciones del sector.
Son señales de solvencia que un cliente extranjero busca activamente.

---

## 5. Decisiones tomadas que conviene revisar

Cosas que se han resuelto de una manera concreta y que quizá queráis
cambiar:

**«Unero» en lugar de «Unero Espacio» como marca visible.** El logotipo
dice «Unero Espacio», pero el dominio es unero.es y el nombre corto es más
memorable. Se usa «Unero» en la cabecera y «Unero Espacio» como
denominación legal en el pie, los textos legales y los datos estructurados.

**El símbolo del logotipo, en monocromo.** Se ha vectorizado la geometría
exacta del logotipo original, pero los dos marrones se han sustituido por
un solo color con dos opacidades. Así funciona igual sobre fondo claro y
oscuro, y no compite con la fotografía. Los marrones originales siguen
disponibles si preferís recuperarlos.

**Trasteros de Móstoles, con su propia identidad de SEO.** Se mantiene en
el menú, como pedisteis, pero con sus propios datos estructurados
(`SelfStorage` en Móstoles) separados de los de la constructora de Ibiza.
Mezclarlos confundiría a Google sobre dónde está el negocio. La página
lleva además un aviso explicando que es una línea independiente, para que
quien busque una constructora de lujo en Ibiza no crea que se ha
equivocado de sitio, y al contrario.

**El Cuaderno se llama «Cuaderno», no «Blog».** Encaja mejor con el tono
—el cuaderno de un arquitecto— y se diferencia del blog corporativo al uso.
En inglés es «Journal».

**Los proyectos de península no se esconden.** Marbella y Boadilla están en
el catálogo con su ubicación real y se pueden filtrar. Los textos explican
por qué se construye distinto allí, lo que convierte una posible
incoherencia de marca en una demostración de criterio técnico.
