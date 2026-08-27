/**
 * Inventario de imágenes — fuente única de verdad del pipeline (Fase V, V.0/V.2).
 * `generate.ts` solo lee de aquí. No generes ni encargues imágenes que no
 * estén en este fichero.
 */

export type AspectRatio = "1:1" | "21:9" | "16:9" | "4:3" | "3:2" | "2:3" | "3:4" | "4:5" | "5:4" | "9:16";
export type ImageSize = "512px" | "1K" | "2K" | "4K";
export type OverlayTratamiento = "dark-heavy" | "dark-soft" | "none";

/**
 * V.0 solo preveía "gemini-3.1-flash-image" | "gemini-3-pro-image", pero el
 * inventario del propio prompt (Grupo 6, V.2) pide explícitamente
 * "gemini-3.1-flash-lite-image" para las imágenes de utilidad. Se amplía
 * el tipo aquí para que el manifiesto sea fiel al inventario real.
 */
export type ModeloGemini = "gemini-3.1-flash-image" | "gemini-3-pro-image" | "gemini-3.1-flash-lite-image";

export type ImageAsset = {
  id: string;
  usage: string;
  /** Descripción específica en inglés — generate.ts le añade STYLE_BASE/STYLE_NEGATIVE (o STYLE_PRODUCT_ILLU). */
  prompt: string;
  aspect: AspectRatio;
  size: ImageSize;
  model: ModeloGemini;
  /**
   * "product" compone con STYLE_PRODUCT_ILLU (Grupo 2); "editorial" usa
   * STYLE_BASE; "texture" no añade ningún encuadre de fotografía de
   * producto/editorial (solo STYLE_NEGATIVE) — necesario para texture-grid,
   * donde STYLE_PRODUCT_ILLU ("single generic component centred... catalogue
   * aesthetic") competía con "seamless tileable texture" y el modelo
   * generaba una pieza suelta en vez de una textura de fondo.
   */
  styleVariant: "editorial" | "product" | "texture";
  alt: string;
  overlay: OverlayTratamiento;
  /** true → decorativa, se sirve con alt="" y aria-hidden. Solo texture-grid. */
  decorative?: boolean;
  replaceWithReal?: boolean;
  /** true → una de las 3 cabeceras que fijan el estilo de referencia para gemini-3-pro-image (V.1/V.2). */
  styleReference?: boolean;
};

export const IMAGE_MANIFEST: ImageAsset[] = [
  // ── Grupo 1 — Cabeceras principales ────────────────────────────────────
  {
    id: "hero-home",
    usage: "Home — hero principal",
    prompt:
      "Wide interior of a large industrial spare-parts warehouse at dawn, tall metal racking receding into depth, boxes and components on shelves, a forklift silhouette far down the aisle, light entering from high side windows, dust in the air. Low camera, strong perspective, deep shadows on the left third to hold overlaid text.",
    aspect: "21:9",
    size: "2K",
    model: "gemini-3-pro-image",
    styleVariant: "editorial",
    alt: "Interior de un gran almacén industrial de recambios al amanecer, con estanterías metálicas altas y una carretilla elevadora al fondo",
    overlay: "dark-heavy",
    styleReference: true,
  },
  {
    id: "hero-reparacion",
    usage: "/servicios/reparacion-industrial — hero",
    prompt:
      "Close-up of an electronics repair bench in a workshop: an opened industrial drive cabinet, circuit board under an articulated lamp, multimeter probes resting on the bench, hands out of frame, tools laid out in order. Warm task light against a cold dark workshop background.",
    aspect: "16:9",
    size: "2K",
    model: "gemini-3-pro-image",
    styleVariant: "editorial",
    alt: "Banco de reparación electrónica con un armario de variador industrial abierto, una placa de circuito bajo un flexo y herramientas ordenadas",
    overlay: "dark-heavy",
    styleReference: true,
  },
  {
    id: "hero-asesoramiento",
    usage: "/servicios/asesoramiento-tecnico — hero",
    prompt:
      "A technical drawing and a caliper on a worn workbench next to a generic unbranded bearing and a notebook with sketches, overhead flat-lay, single hard light source, strong shadows.",
    aspect: "16:9",
    size: "2K",
    model: "gemini-3-pro-image",
    styleVariant: "editorial",
    alt: "Plano cenital de un plano técnico, un calibre y un rodamiento genérico sobre una mesa de trabajo desgastada, junto a un cuaderno con bocetos",
    overlay: "dark-heavy",
    styleReference: true,
  },
  {
    id: "hero-mantenimiento",
    usage: "/servicios/mantenimiento-y-stock-gestionado — hero",
    prompt:
      "Organised industrial storage system: rows of labelled bins and drawers of small mechanical components, shallow depth of field, blue-grey metal, one red bin standing out.",
    aspect: "16:9",
    size: "2K",
    model: "gemini-3-pro-image",
    styleVariant: "editorial",
    alt: "Sistema de almacenaje industrial organizado con filas de cajones y cubetas etiquetadas de componentes pequeños",
    overlay: "dark-heavy",
  },
  {
    id: "hero-empresa",
    usage: "/empresa — hero",
    prompt:
      "Exterior of a mid-size industrial supply warehouse in a Mediterranean industrial estate at golden hour, loading dock with the shutter half open, palm silhouette, dry warm light, no signage.",
    aspect: "16:9",
    size: "2K",
    model: "gemini-3-pro-image",
    styleVariant: "editorial",
    alt: "Fachada de una nave industrial de suministro en un polígono mediterráneo al atardecer, con el portón de carga entreabierto",
    overlay: "dark-heavy",
  },
  {
    id: "hero-blog",
    usage: "/blog — hero",
    prompt:
      "Abstract macro of interlocking machined metal gears and a chain, extreme shallow focus, oil sheen, dark background.",
    aspect: "16:9",
    size: "2K",
    model: "gemini-3-pro-image",
    styleVariant: "editorial",
    alt: "Primer plano macro de engranajes metálicos mecanizados entrelazados y una cadena, con brillo de aceite",
    overlay: "dark-heavy",
  },
  {
    id: "og-default",
    usage: "Imagen social (Open Graph) por defecto, se recorta a 1200x630",
    prompt:
      "Dark graphite background with a single generic industrial bearing lit from the side by a hard red-tinted rim light, centred, lots of negative space, product-hero lighting.",
    aspect: "16:9",
    size: "2K",
    model: "gemini-3-pro-image",
    styleVariant: "editorial",
    alt: "Rodamiento industrial genérico iluminado lateralmente sobre fondo grafito oscuro, con amplio espacio negativo",
    overlay: "none",
  },

  // ── Grupo 2 — Familias de producto (genéricas, sin marca) ──────────────
  {
    id: "fam-rodamientos",
    usage: "Tarjeta de familia: Rodamientos",
    prompt: "A single generic deep-groove ball bearing, three-quarter view, polished steel with a black rubber seal.",
    aspect: "4:3",
    size: "1K",
    model: "gemini-3.1-flash-image",
    styleVariant: "product",
    alt: "Rodamiento rígido de bolas genérico en vista de tres cuartos, acero pulido con junta de caucho negra",
    overlay: "none",
    replaceWithReal: true,
  },
  {
    id: "fam-motores-electricos",
    usage: "Tarjeta de familia: Motores eléctricos",
    prompt:
      "A generic grey industrial three-phase electric motor with cooling fins, terminal box and mounting feet, three-quarter view.",
    aspect: "4:3",
    size: "1K",
    model: "gemini-3.1-flash-image",
    styleVariant: "product",
    alt: "Motor eléctrico trifásico industrial genérico en gris, con aletas de refrigeración y caja de bornes",
    overlay: "none",
    replaceWithReal: true,
  },
  {
    id: "fam-variadores",
    usage: "Tarjeta de familia: Variadores de frecuencia",
    prompt:
      "A generic wall-mounted variable frequency drive unit, plain dark grey plastic housing with a blank keypad panel and ventilation slots.",
    aspect: "4:3",
    size: "1K",
    model: "gemini-3.1-flash-image",
    styleVariant: "product",
    alt: "Variador de frecuencia mural genérico, carcasa de plástico gris oscuro con teclado en blanco",
    overlay: "none",
    replaceWithReal: true,
  },
  {
    id: "fam-neumatica",
    usage: "Tarjeta de familia: Neumática",
    prompt:
      "A generic pneumatic cylinder and two small aluminium solenoid valves with push-in fittings, arranged in a row.",
    aspect: "4:3",
    size: "1K",
    model: "gemini-3.1-flash-image",
    styleVariant: "product",
    alt: "Cilindro neumático genérico y dos electroválvulas de aluminio con racores push-in",
    overlay: "none",
    replaceWithReal: true,
  },
  {
    id: "fam-reductores",
    usage: "Tarjeta de familia: Reductores",
    prompt: "A generic cast-iron worm gear reducer with an output shaft, three-quarter view.",
    aspect: "4:3",
    size: "1K",
    model: "gemini-3.1-flash-image",
    styleVariant: "product",
    alt: "Reductor de tornillo sinfín genérico en fundición, con eje de salida a la vista",
    overlay: "none",
    replaceWithReal: true,
  },
  {
    id: "fam-correas-cadenas",
    usage: "Tarjeta de familia: Correas y cadenas",
    prompt: "A coiled black toothed timing belt and a short length of roller chain, arranged as a still life.",
    aspect: "4:3",
    size: "1K",
    model: "gemini-3.1-flash-image",
    styleVariant: "product",
    alt: "Correa dentada negra enrollada junto a un tramo de cadena de rodillos",
    overlay: "none",
    replaceWithReal: true,
  },
  {
    id: "fam-poleas-transmision",
    usage: "Tarjeta de familia: Poleas de transmisión",
    prompt: "Two generic cast pulleys of different diameters and a taper bush, stacked.",
    aspect: "4:3",
    size: "1K",
    model: "gemini-3.1-flash-image",
    styleVariant: "product",
    alt: "Dos poleas de fundición de distinto diámetro apiladas junto a un casquillo cónico",
    overlay: "none",
    replaceWithReal: true,
  },
  {
    id: "fam-acoplamientos",
    usage: "Tarjeta de familia: Acoplamientos",
    prompt: "A generic jaw coupling split into its two hubs with the elastomer spider between them.",
    aspect: "4:3",
    size: "1K",
    model: "gemini-3.1-flash-image",
    styleVariant: "product",
    alt: "Acoplamiento de quijada genérico separado en sus dos mitades con la araña elastomérica entre ellas",
    overlay: "none",
    replaceWithReal: true,
  },
  {
    id: "fam-rodamientos-soportes",
    usage: "Tarjeta de familia: Soportes de rodamiento",
    prompt: "A generic pillow block bearing unit in cast iron with two mounting holes.",
    aspect: "4:3",
    size: "1K",
    model: "gemini-3.1-flash-image",
    styleVariant: "product",
    alt: "Soporte de pie con rodamiento montado en fundición, con dos orificios de anclaje",
    overlay: "none",
    replaceWithReal: true,
  },
  {
    id: "fam-herramienta",
    usage: "Tarjeta de familia: Herramienta",
    prompt:
      "A small arrangement of generic hand tools: a combination spanner, a hex key set and a torque wrench, laid in parallel.",
    aspect: "4:3",
    size: "1K",
    model: "gemini-3.1-flash-image",
    styleVariant: "product",
    alt: "Llave combinada, juego de llaves Allen y llave dinamométrica genéricas dispuestas en paralelo",
    overlay: "none",
    replaceWithReal: true,
  },
  {
    id: "fam-lubricantes",
    usage: "Tarjeta de familia: Lubricantes",
    prompt: "A plain unlabelled metal grease cartridge and a small oil can, side by side.",
    aspect: "4:3",
    size: "1K",
    model: "gemini-3.1-flash-image",
    styleVariant: "product",
    alt: "Cartucho de grasa metálico sin etiquetar junto a una aceitera pequeña",
    overlay: "none",
    replaceWithReal: true,
  },
  {
    id: "fam-proteccion-epi",
    usage: "Tarjeta de familia: Protección / EPI",
    prompt: "A pair of industrial work gloves, clear safety glasses and ear defenders arranged neatly.",
    aspect: "4:3",
    size: "1K",
    model: "gemini-3.1-flash-image",
    styleVariant: "product",
    alt: "Guantes de trabajo, gafas de protección transparentes y orejeras dispuestos de forma ordenada",
    overlay: "none",
    replaceWithReal: true,
  },
  {
    id: "fam-arrancadores",
    usage: "Tarjeta de familia: Arrancadores y protección",
    prompt:
      "A generic industrial soft starter unit and a motor protection circuit breaker mounted side by side on a small section of DIN rail, plain grey plastic housings.",
    aspect: "4:3",
    size: "1K",
    model: "gemini-3.1-flash-image",
    styleVariant: "product",
    alt: "Arrancador suave industrial genérico y un guardamotor montados sobre un tramo de carril DIN",
    overlay: "none",
    replaceWithReal: true,
  },
  {
    id: "fam-mangueras",
    usage: "Tarjeta de familia: Mangueras",
    prompt: "A coiled reinforced industrial rubber hose with crimped metal end fittings.",
    aspect: "4:3",
    size: "1K",
    model: "gemini-3.1-flash-image",
    styleVariant: "product",
    alt: "Manguera industrial de goma reforzada enrollada con racores metálicos engarzados",
    overlay: "none",
    replaceWithReal: true,
  },

  // ── Grupo 3 — Sectores ───────────────────────────────────────────────
  {
    id: "sector-citricos",
    usage: "/soluciones/citricos — hero",
    prompt:
      "Interior of a citrus packing plant: stainless steel roller conveyors carrying oranges, brushes and sorting lanes, damp concrete floor, cool overhead light.",
    aspect: "16:9",
    size: "2K",
    model: "gemini-3.1-flash-image",
    styleVariant: "editorial",
    alt: "Interior de una central de confección de cítricos, con cintas transportadoras de rodillos de acero inoxidable llevando naranjas",
    overlay: "dark-soft",
  },
  {
    id: "sector-hortofruticola",
    usage: "/soluciones/hortofruticola — hero",
    prompt:
      "A vegetable grading line with plastic crates stacked at the end, conveyor belts and a weighing station, industrial hall.",
    aspect: "16:9",
    size: "2K",
    model: "gemini-3.1-flash-image",
    styleVariant: "editorial",
    alt: "Línea de calibrado de hortalizas con cajas de plástico apiladas y una zona de pesaje",
    overlay: "dark-soft",
  },
  {
    id: "sector-ceramica",
    usage: "/soluciones/ceramica — hero",
    prompt:
      "A ceramic tile production line: a long roller kiln exit with tiles moving on rollers, heat haze, dusty warm atmosphere.",
    aspect: "16:9",
    size: "2K",
    model: "gemini-3.1-flash-image",
    styleVariant: "editorial",
    alt: "Salida de un horno de rodillos en una fábrica de baldosas cerámicas, con calima de calor",
    overlay: "dark-soft",
  },
  {
    id: "sector-alimentacion",
    usage: "/soluciones/alimentacion — hero",
    prompt:
      "A hygienic stainless-steel food processing line with a belt conveyor and washdown floor, bright even lighting.",
    aspect: "16:9",
    size: "2K",
    model: "gemini-3.1-flash-image",
    styleVariant: "editorial",
    alt: "Línea higiénica de procesado de alimentos en acero inoxidable, con cinta transportadora e iluminación uniforme",
    overlay: "dark-soft",
  },
  {
    id: "sector-aguas",
    usage: "/soluciones/aguas — hero",
    prompt:
      "A water treatment pumping station: large centrifugal pumps on concrete plinths with painted pipework and valves.",
    aspect: "16:9",
    size: "2K",
    model: "gemini-3.1-flash-image",
    styleVariant: "editorial",
    alt: "Estación de bombeo de tratamiento de aguas con grandes bombas centrífugas sobre bancadas de hormigón",
    overlay: "dark-soft",
  },
  {
    id: "sector-madera",
    usage: "/soluciones/madera — hero",
    prompt: "A woodworking plant: a wide-belt sanding machine and stacked boards, sawdust in the air, warm light.",
    aspect: "16:9",
    size: "2K",
    model: "gemini-3.1-flash-image",
    styleVariant: "editorial",
    alt: "Planta de carpintería con una lijadora de banda ancha y tablas apiladas",
    overlay: "dark-soft",
  },
  {
    id: "sector-plastico",
    usage: "/soluciones/plastico — hero",
    prompt:
      "An injection moulding shop: rows of moulding machines with material hoppers and a robot arm, clean industrial floor.",
    aspect: "16:9",
    size: "2K",
    model: "gemini-3.1-flash-image",
    styleVariant: "editorial",
    alt: "Nave de inyección de plástico con filas de máquinas, tolvas de material y un brazo robótico",
    overlay: "dark-soft",
  },
  {
    id: "sector-packaging",
    usage: "/soluciones/packaging — hero",
    prompt:
      "An end-of-line packaging area: a case packer and a palletiser handling cardboard boxes, motion blur on the conveyor.",
    aspect: "16:9",
    size: "2K",
    model: "gemini-3.1-flash-image",
    styleVariant: "editorial",
    alt: "Zona de fin de línea de envasado con una encajadora y una paletizadora manejando cajas de cartón",
    overlay: "dark-soft",
  },
  {
    id: "sector-agricola",
    usage: "/soluciones/agricola — hero",
    prompt:
      "Agricultural machinery workshop with a tractor PTO shaft and gearboxes on the floor, tools on the wall, dusty light.",
    aspect: "16:9",
    size: "2K",
    model: "gemini-3.1-flash-image",
    styleVariant: "editorial",
    alt: "Taller de maquinaria agrícola con la toma de fuerza de un tractor y reductores en el suelo",
    overlay: "dark-soft",
  },

  // ── Grupo 4 — Bloques editoriales y confianza ──────────────────────────
  {
    id: "editorial-reparto",
    usage: "Home — bloque 'entrega 24 h'",
    prompt:
      "A white unmarked delivery van with its rear doors open at a warehouse loading dock at early morning, boxes inside, wet tarmac reflecting the light.",
    aspect: "3:2",
    size: "2K",
    model: "gemini-3.1-flash-image",
    styleVariant: "editorial",
    alt: "Furgoneta de reparto sin distintivos con las puertas traseras abiertas en un muelle de carga al amanecer",
    overlay: "none",
    replaceWithReal: true,
  },
  {
    id: "editorial-almacen-picking",
    usage: "Home — bloque 'stock real' / 'cómo trabajamos'",
    prompt:
      "A warehouse aisle with a picking trolley and an open box of mechanical components, labels on the shelf edges, shot from waist height down the aisle.",
    aspect: "3:2",
    size: "2K",
    model: "gemini-3.1-flash-image",
    styleVariant: "editorial",
    alt: "Pasillo de almacén con una carretilla de picking y una caja abierta de componentes mecánicos",
    overlay: "none",
    replaceWithReal: true,
  },
  {
    id: "editorial-mostrador",
    usage: "Home / servicios — bloque 'asesoramiento'",
    prompt:
      "A trade counter in an industrial supplies branch: worn wooden counter, a catalogue open, a component resting on it, blurred shelving behind.",
    aspect: "3:2",
    size: "2K",
    model: "gemini-3.1-flash-image",
    styleVariant: "editorial",
    alt: "Mostrador de atención en una sucursal de suministro industrial, con un catálogo abierto y una pieza sobre la madera desgastada",
    overlay: "none",
    replaceWithReal: true,
  },
  {
    id: "editorial-planta",
    usage: "Home — bloque de sectores",
    prompt:
      "A maintenance technician in workwear seen from behind, kneeling beside a conveyor motor with a toolbox open, industrial hall, no face visible.",
    aspect: "3:2",
    size: "2K",
    model: "gemini-3.1-flash-image",
    styleVariant: "editorial",
    alt: "Técnico de mantenimiento visto de espaldas, arrodillado junto al motor de una cinta transportadora con la caja de herramientas abierta",
    overlay: "none",
    replaceWithReal: true,
  },

  // ── Grupo 5 — Blog ──────────────────────────────────────────────────
  {
    id: "blog-placa-caracteristicas",
    usage: "Blog — Cómo leer la placa de características de un motor eléctrico",
    prompt: "Macro detail of an electric motor nameplate, dramatic side light, dark background, extreme shallow depth of field.",
    aspect: "16:9",
    size: "1K",
    model: "gemini-3.1-flash-image",
    styleVariant: "editorial",
    alt: "Primer plano macro de la placa de características de un motor eléctrico industrial",
    overlay: "none",
  },
  {
    id: "blog-sufijos-rodamientos",
    usage: "Blog — Códigos de sufijo de rodamientos: qué significa 2RS, ZZ, C3",
    prompt: "Macro detail of a bearing reference code engraved on its outer ring, dramatic side light, dark background, extreme shallow depth of field.",
    aspect: "16:9",
    size: "1K",
    model: "gemini-3.1-flash-image",
    styleVariant: "editorial",
    alt: "Primer plano macro del grabado de referencia en el lateral de un rodamiento",
    overlay: "none",
  },
  {
    id: "blog-errores-variador",
    usage: "Blog — Cómo interpretar los códigos de fallo del variador ABB ACS580",
    prompt: "Macro detail of a variable frequency drive control panel display and keypad, dramatic side light, dark background, extreme shallow depth of field.",
    aspect: "16:9",
    size: "1K",
    model: "gemini-3.1-flash-image",
    styleVariant: "editorial",
    alt: "Primer plano macro de la pantalla y el teclado de un variador de frecuencia industrial",
    overlay: "none",
  },
  {
    id: "blog-equivalencias",
    usage: "Blog — Equivalencias de rodamientos entre SKF, FAG, NTN e ISB",
    prompt: "Macro detail of several generic unbranded bearings of different sizes lined up in a row for comparison, dramatic side light, dark background, extreme shallow depth of field.",
    aspect: "16:9",
    size: "1K",
    model: "gemini-3.1-flash-image",
    styleVariant: "editorial",
    alt: "Primer plano macro de varios rodamientos genéricos de distinto tamaño dispuestos en fila para comparar",
    overlay: "none",
  },
  {
    id: "blog-reparar-o-sustituir",
    usage: "Blog — Cuándo reparar y cuándo sustituir un variador de frecuencia",
    prompt: "Macro detail of an open variable frequency drive circuit board with visible power components, dramatic side light, dark background, extreme shallow depth of field.",
    aspect: "16:9",
    size: "1K",
    model: "gemini-3.1-flash-image",
    styleVariant: "editorial",
    alt: "Primer plano macro de una placa de circuito de un variador de frecuencia abierto",
    overlay: "none",
  },
  {
    id: "blog-seleccion-motor",
    usage: "Blog — artículo de selección de motor",
    prompt: "Macro detail of an open electric motor terminal box showing the winding connections, dramatic side light, dark background, extreme shallow depth of field.",
    aspect: "16:9",
    size: "1K",
    model: "gemini-3.1-flash-image",
    styleVariant: "editorial",
    alt: "Primer plano macro de la caja de bornes abierta de un motor eléctrico industrial",
    overlay: "none",
  },

  // ── Grupo 6 — Utilidad ──────────────────────────────────────────────
  {
    id: "state-404",
    usage: "Página 404",
    prompt: "A single disconnected coupling half lying on a concrete floor, top-down, hard shadow, lots of empty space.",
    aspect: "4:3",
    size: "1K",
    model: "gemini-3.1-flash-lite-image",
    styleVariant: "product",
    alt: "Media pieza de un acoplamiento desconectada sobre un suelo de hormigón, vista cenital",
    overlay: "none",
  },
  {
    id: "state-empty-cart",
    usage: "Carrito vacío",
    prompt: "An empty grey plastic warehouse picking bin, top-down on a light background.",
    aspect: "1:1",
    size: "1K",
    model: "gemini-3.1-flash-lite-image",
    styleVariant: "product",
    alt: "Cubeta de picking de almacén vacía, de plástico gris, vista cenital",
    overlay: "none",
  },
  {
    id: "state-no-results",
    usage: "Buscador sin resultados",
    prompt: "An empty shelf slot between two full shelf sections in a warehouse, straight-on view.",
    aspect: "4:3",
    size: "1K",
    model: "gemini-3.1-flash-lite-image",
    styleVariant: "product",
    alt: "Hueco vacío entre dos estanterías completas en un almacén",
    overlay: "none",
  },
  {
    id: "texture-grid",
    usage: "Fondo de secciones oscuras (pie de página)",
    prompt:
      "Extreme close-up photograph of a large flat sheet of brushed dark grey metal, filling the entire frame edge to edge with no discrete object, no silhouette and no edges visible, a few faint scattered small round holes visible across the surface, very low contrast, even diffuse studio lighting, no vignette, no shadow.",
    aspect: "1:1",
    size: "1K",
    model: "gemini-3.1-flash-lite-image",
    styleVariant: "texture",
    alt: "",
    overlay: "none",
    decorative: true,
  },
];

export const IDS_REFERENCIA_ESTILO = IMAGE_MANIFEST.filter((img) => img.styleReference).map((img) => img.id);
