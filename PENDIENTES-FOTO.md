# Pendientes de fotografía real

La Fase V generó 44 imágenes con IA (Gemini) para poder maquetar la web sin
esperar a tener fotografía real — ver `scripts/images/manifest.ts` y
`README.md`. La mayoría (cabeceras de sector, macros de blog, ilustraciones
de estado vacío, la textura del pie de página) son imágenes de ambiente o
abstractas: no representan nada de TRADE en concreto, así que pueden quedarse
como están indefinidamente si no hay presupuesto de fotografía.

Las **18 imágenes de esta lista son distintas**: representan piezas de
catálogo o el propio funcionamiento de TRADE (el almacén, el reparto, el
mostrador), y hoy son genéricas por diseño — el prompt de cada una empieza
por "a generic..." a propósito, para no fingir un producto o una escena que
no existen. Sustituyen a fotografía real que sí compensa encargar: un cliente
que ve "su" rodamiento o "su" furgoneta de reparto genera más confianza que
una ilustración, por buena que sea.

Cada entrada tiene el `id` tal como aparece en `scripts/images/manifest.ts`
(y en `scripts/images/images.lock.json`), dónde se usa hoy en la web, y qué
pedirle al fotógrafo.

## Cómo sustituir una imagen cuando llegue la foto real

No hace falta tocar código. El pipeline busca en `public/img/raw/` un
fichero cuyo nombre (sin extensión) coincida con el `id`:

1. Guarda la foto como `public/img/raw/<id>.jpg` (o `.png`), sustituyendo al
   fichero generado por IA que ya está ahí con ese mismo nombre.
2. Ejecuta `npm run images:optimize`.
3. Eso regenera el AVIF/WebP en los 4 anchos y el blur placeholder, y
   actualiza `scripts/images/manifest.generated.json` — que es lo único que
   lee `<ImagenGenerada>` en la web. No hace falta redeploy de código, solo
   volver a construir (`next build`) para que los ficheros estáticos nuevos
   se sirvan.

Formato recomendado para la entrega del fotógrafo: JPEG a máxima calidad,
lado más largo ≥ 2400 px, en la relación de aspecto indicada en cada
entrada (el pipeline recorta al centro si no coincide exacto, así que cuanto
más cerca del aspecto pedido, menos recorte sorpresa).

---

## Fotos de producto por familia (Grupo 2 — 14 fotos)

Se usan en las tarjetas de familia de la home (`FamilyGrid`) y en la
cabecera de los listados de familia/subfamilia (`ListadoHeader`). Fondo,
encuadre y luz iguales en las 14 para que la cuadrícula no se vea deslavazada
— es más importante la consistencia entre ellas que el acabado de cada una
por separado.

**Pauta común**: fondo gris claro liso o mesa de estudio blanca (sin marca ni
texto visible), pieza centrada en 3/4 de perfil, luz difusa desde arriba sin
sombras duras, relación de aspecto **4:3**. Usa una pieza real de stock,
representativa de la familia (no hace falta que sea la referencia más
vendida, solo que se reconozca a simple vista qué es).

| id | Sustituye a (hoy IA) | Qué fotografiar |
|---|---|---|
| `fam-rodamientos` | Rodamiento rígido de bolas genérico | Un rodamiento rígido de bolas real de catálogo (p. ej. una serie 62), limpio, sin grasa visible |
| `fam-motores-electricos` | Motor trifásico genérico gris | Un motor eléctrico trifásico real, carcasa visible con aletas y caja de bornes, sin cables sueltos |
| `fam-variadores` | Variador mural genérico | Un variador de frecuencia real, de frente, con el teclado/pantalla visible |
| `fam-neumatica` | Cilindro + 2 electroválvulas genéricos | Un cilindro neumático real junto a una o dos electroválvulas, racores incluidos |
| `fam-reductores` | Reductor de sinfín genérico | Un reductor real en 3/4, eje de salida visible |
| `fam-correas-cadenas` | Correa dentada + cadena genéricas | Una correa dentada enrollada junto a un tramo de cadena de rodillos reales |
| `fam-poleas-transmision` | Dos poleas + casquillo cónico | Dos poleas reales de distinto diámetro apiladas, con su casquillo cónico |
| `fam-acoplamientos` | Acoplamiento de quijada genérico | Un acoplamiento real separado en sus dos mitades con la araña elastomérica a la vista |
| `fam-rodamientos-soportes` | Soporte de pie (UCP) genérico | Un soporte de pie real, orificios de anclaje visibles |
| `fam-herramienta` | Llave + Allen + dinamométrica genéricas | 2-3 herramientas de mano reales del stock, en paralelo |
| `fam-lubricantes` | Cartucho de grasa + aceitera genéricos | Un cartucho de grasa y un envase de aceite reales (marca visible está bien aquí, es producto de venta) |
| `fam-proteccion-epi` | Guantes + gafas + orejeras genéricos | EPI real de catálogo, ordenado |
| `fam-arrancadores` | Arrancador suave + guardamotor genéricos | Un arrancador suave real y un guardamotor, montados sobre un tramo de carril DIN si es posible |
| `fam-mangueras` | Manguera reforzada genérica | Una manguera industrial real enrollada, racores a la vista |

## Fotos de "cómo trabajamos" (Grupo 4 — 4 fotos)

Se usan en la home: bloque de reparto (`RepairBlock`/hero de reparación no,
son otras — ver `ComoTrabajamos` y el bloque de confianza). A diferencia del
Grupo 2, aquí sí importa que sean **el almacén y la operativa reales de
TRADE**, no un plató. Si aparecen personas, necesitas su consentimiento
explícito para publicar la imagen en la web (pregúntales antes de la sesión,
no después).

| id | Sustituye a (hoy IA) | Qué fotografiar |
|---|---|---|
| `editorial-reparto` | Furgoneta sin distintivos en un muelle al amanecer | La furgoneta de reparto real de TRADE, puertas traseras abiertas, en el muelle de carga de Algemesí. Luz de primera hora si se puede, si no, luz de día normal vale |
| `editorial-almacen-picking` | Pasillo de almacén genérico con carretilla | Un pasillo real del almacén de Algemesí, con una carretilla de picking y una caja de pedido en preparación. Que se lean las etiquetas de estantería (sin que se lea nada confidencial de precios) |
| `editorial-mostrador` | Mostrador genérico con catálogo | El mostrador real de atención al cliente, con alguien (con su permiso) atendiendo o un catálogo abierto sobre la madera/superficie real |
| `editorial-planta` | Técnico de espaldas junto a un motor | Un técnico real de TRADE (con su permiso, visto de espaldas o de perfil si no quiere salir de frente) trabajando en una reparación, caja de herramientas abierta |

---

## Notas

- Las cabeceras de `/soluciones/[sector]` (`sector-citricos`, `sector-ceramica`,
  `sector-alimentacion`, `sector-agricola`, y las que aún no tienen página
  propia: `sector-hortofruticola`, `sector-aguas`, `sector-madera`,
  `sector-plastico`, `sector-packaging`) son escenas de ambiente genéricas
  a propósito — no pretenden ser instalaciones reales de ningún cliente de
  TRADE, así que no están en esta lista. Sustituirlas por fotografía real
  solo tendría sentido con permiso explícito de un cliente concreto para
  usar fotos de su planta.
- Las cabeceras principales (`hero-home`, `hero-reparacion`,
  `hero-asesoramiento`, `hero-mantenimiento`, `hero-empresa`, `hero-blog`,
  `og-default`), los macros de blog (`blog-*`) y las imágenes de estado
  (`state-404`, `state-empty-cart`, `state-no-results`, `texture-grid`)
  tampoco están en esta lista por el mismo motivo: son ilustración editorial
  o decorativa, no una promesa de "esto es lo que vas a recibir".
- `hero-empresa` es la única excepción a valorar aparte: si en algún momento
  se decide mostrar la fachada real de la nave de Algemesí en `/empresa`,
  añádela a esta lista — hoy no lo está porque no hay confirmación de que
  quieran mostrar la fachada real en la web.
