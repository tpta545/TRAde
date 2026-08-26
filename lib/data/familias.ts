/**
 * Metadatos de familias y subfamilias: nombre de visualización, introducción
 * SEO (60-80 palabras para la cabecera de familia, 300-500 para el bloque
 * de contenido técnico bajo el listado) y FAQ. Es contenido editorial fijo,
 * no derivado del catálogo, así que vive aparte de /lib/data/productos.ts.
 *
 * Cuando una familia/subfamilia nueva aparezca en el catálogo (importación
 * desde el ERP) y no tenga entrada aquí, las páginas de listado usan un
 * fallback genérico (ver getFamiliaInfo/getSubfamiliaInfo) en vez de romper.
 */

export type FaqItem = { pregunta: string; respuesta: string };

export type FamiliaInfo = {
  slug: string;
  nombre: string;
  introCorta: string;
  contenidoTecnico: string;
  faq: FaqItem[];
};

export type SubfamiliaInfo = {
  slug: string;
  nombre: string;
  introCorta: string;
};

export const FAMILIAS: Record<string, FamiliaInfo> = {
  rodamientos: {
    slug: "rodamientos",
    nombre: "Rodamientos",
    introCorta:
      "Rodamientos rígidos de bolas, soportes de pie y soportes de brida de NTN e ISB, con dimensiones normalizadas ISO y equivalencias con las principales marcas del mercado.",
    contenidoTecnico: `## Cómo elegir el rodamiento correcto

El primer dato para acertar con la referencia no es la marca, es la medida: diámetro interior, diámetro exterior y anchura, en ese orden. Un 6205 y un 6305 comparten el mismo diámetro interior (25 mm) pero tienen diámetro exterior y capacidad de carga distintos porque pertenecen a series diferentes (62 estrecha frente a 63 ancha). Si sustituyes un rodamiento averiado sin desmontarlo, mide siempre el diámetro del eje donde va montado: es el dato más fiable cuando la referencia original ya no se lee.

## Qué significan los sufijos

Los sufijos después del número de referencia indican el tipo de protección y el juego interno, no cambian las dimensiones principales. ZZ (o 2Z) es un blindaje metálico a ambos lados, con menos rozamiento pero peor sellado frente al polvo fino. 2RS (o 2RSR, 2RS1 según fabricante) es una junta de contacto de caucho a ambos lados: sella mejor pero reduce ligeramente la velocidad máxima admisible. C3 indica un juego interno radial mayor que el estándar, habitual en aplicaciones con ajustes apretados o temperaturas de servicio elevadas, donde un juego normal se quedaría sin holgura en caliente.

## Errores habituales al pedir por teléfono

El error más frecuente es confundir la serie (62 frente a 63, o la serie estrecha 60) para un mismo diámetro de eje, porque a simple vista un cliente que no tiene el rodamiento delante solo recuerda "un 6205" quizá sin verificar el ancho. El segundo error habitual es pedir por el diámetro de eje de la máquina sin saber que ese mismo eje puede llevar rodamiento simple o un soporte de pie/brida con rodamiento ya montado (series UCP, UCFL): son piezas distintas aunque compartan diámetro de eje.

## Cuándo usar un soporte en vez de un rodamiento suelto

Los soportes de pie (UCP) y de brida (UCFL, UCF) llevan el rodamiento ya montado en una carcasa de fundición con superficie de asiento esférica, que permite absorber un pequeño desalineamiento angular del eje. Son la opción habitual en ejes de transmisión largos —cintas transportadoras, norias— donde conseguir una alineación perfecta de la bancada es poco realista. Un rodamiento suelto, en cambio, se monta dentro de una carcasa mecanizada por el propio fabricante de la máquina, sin margen de desalineamiento.`,
    faq: [
      {
        pregunta: "¿Cómo sé si necesito un 6205 o un 6305 si el eje mide 25 mm?",
        respuesta:
          "Con el diámetro de eje solo no basta: mide también el diámetro exterior del alojamiento en la carcasa. El 6205 es más estrecho (52x15 mm) y el 6305 más ancho y con más capacidad de carga (62x17 mm). Si tienes dudas, envíanos una foto de la pieza o del alojamiento y te confirmamos la referencia antes de que hagas el pedido.",
      },
      {
        pregunta: "¿ZZ o 2RS, cuál me conviene?",
        respuesta:
          "ZZ para velocidad media-alta con exposición moderada al polvo; 2RS cuando hay más polvo fino, humedad o proyecciones y la velocidad no es crítica. En caso de duda, 2RS es la opción más segura para mantenimiento correctivo general.",
      },
      {
        pregunta: "¿Los rodamientos NTN e ISB son intercambiables con SKF o FAG?",
        respuesta:
          "En las medidas normalizadas ISO (series 60, 62, 63, entre otras) sí: comparten dimensiones principales. Cada ficha de producto incluye una tabla de equivalencias con las referencias de otros fabricantes cuando la tenemos confirmada.",
      },
    ],
  },
  "variadores-de-frecuencia": {
    slug: "variadores-de-frecuencia",
    nombre: "Variadores de frecuencia",
    introCorta:
      "Variadores de frecuencia ABB (gama ACS580) y WEG (CFW300) para control de velocidad de motores trifásicos, con stock de las potencias de mayor rotación en Algemesí.",
    contenidoTecnico: `## Qué hace un variador de frecuencia

Un variador de frecuencia controla la velocidad de un motor eléctrico trifásico ajustando la frecuencia y la tensión que le llegan, en lugar de conectarlo directamente a la red a velocidad fija. Esto permite adaptar el caudal de una bomba o el flujo de un ventilador a la demanda real sin válvulas de estrangulamiento ni compuertas, con un ahorro energético que en aplicaciones de par variable (bombas, ventiladores) puede ser considerable frente al arranque directo a velocidad fija.

## Cómo elegir la potencia correcta

La potencia del variador debe ser igual o superior a la del motor que va a controlar, pero también hay que revisar la corriente nominal del motor frente a la corriente de salida del variador, especialmente en motores con factor de servicio elevado o en aplicaciones con arranques frecuentes bajo carga. Un variador ligeramente sobredimensionado en corriente da más margen térmico y suele alargar su vida útil frente a uno ajustado al límite.

## Sustitución de variadores descatalogados

Es habitual que un variador de una generación anterior (por ejemplo, ACS550 o ACS355 de ABB) quede descatalogado mientras el motor que controla sigue en servicio. En estos casos el sustituto directo suele existir dentro de la gama vigente del mismo fabricante con la misma potencia y tensión de alimentación, aunque el tamaño físico de la envolvente y la disposición de bornes pueden cambiar: conviene verificar las medidas del hueco disponible en el cuadro eléctrico antes de confirmar el pedido.

## Mantenimiento preventivo básico

Los variadores de frecuencia acumulan polvo en el disipador y en el ventilador de refrigeración, lo que reduce su capacidad de evacuar calor y puede provocar desconexiones por sobretemperatura en los meses de más calor. Una limpieza periódica con aire comprimido seco, sin desmontar el equipo de la instalación eléctrica, es la medida preventiva más simple y con mayor impacto en la fiabilidad.`,
    faq: [
      {
        pregunta: "Mi variador ABB ACS550 se ha averiado, ¿tenéis sustituto?",
        respuesta:
          "El sustituto directo dentro de la gama vigente de ABB es el ACS580 de la misma potencia. Verificamos con vosotros la tensión de alimentación y el espacio disponible en el cuadro antes de confirmar el pedido, porque las medidas de la envolvente no son siempre idénticas.",
      },
      {
        pregunta: "¿El variador viene con panel de control?",
        respuesta:
          "Las unidades ACS580 que tenemos en catálogo incluyen panel de control asistente. Consulta la ficha de cada referencia para confirmarlo antes de pedir.",
      },
      {
        pregunta: "¿Puedo controlar presión o caudal directamente con el variador, sin un controlador externo?",
        respuesta:
          "Sí, la gama ACS580 incorpora control PID integrado, lo que permite regular presión o caudal con una señal de un sensor sin necesidad de un autómata adicional para esa función.",
      },
    ],
  },
  "motores-electricos": {
    slug: "motores-electricos",
    nombre: "Motores eléctricos",
    introCorta:
      "Motores eléctricos trifásicos ABB (M3BP) y WEG (W22), carcasa de hierro fundido, eficiencia IE3, en las potencias y carcasas IEC de mayor rotación en mantenimiento industrial.",
    contenidoTecnico: `## Cómo leer la placa de características antes de pedir

La placa de un motor eléctrico trifásico incluye, como mínimo, la potencia en kW, la velocidad nominal en rpm, la tensión y conexión (estrella/triángulo), la corriente nominal, el grado de protección IP, la clase de eficiencia (IE1/IE2/IE3) y el tipo de carcasa IEC (por ejemplo, 100L o 132M). Para un reemplazo directo, la potencia, la velocidad nominal y la carcasa IEC son los tres datos que determinan si un motor de otra marca encaja mecánicamente en el mismo hueco, aunque las medidas de brida o la posición de la caja de bornes pueden variar entre fabricantes en carcasas menos habituales.

## Carcasa IEC: por qué importa más que la marca

El sistema de carcasas IEC estandariza las medidas de patas, altura de eje y diámetro de eje para una potencia y velocidad dadas, independientemente del fabricante. Esto significa que un motor WEG W22 y un motor ABB M3BP de la misma potencia, velocidad y carcasa (por ejemplo, ambos en carcasa 132M a 1500 rpm) son intercambiables en la bancada sin modificar el chasis de la máquina, aunque haya que revisar la posición de los prensaestopas y el sentido de montaje de la caja de bornes.

## IE3: qué cambia frente a un motor antiguo

La eficiencia IE3 (premium) reduce las pérdidas eléctricas y térmicas frente a un motor IE1 de la misma potencia, lo que se traduce en menor consumo y menor temperatura de servicio. Es obligatoria en la Unión Europea para la mayoría de motores nuevos de uso general desde 2021, así que un motor IE1 averiado se sustituye hoy, por normativa, por un IE3 aunque el original fuera de una eficiencia inferior.

## Reparar o sustituir

No todo motor averiado compensa repararlo. Como norma orientativa: si el fallo es mecánico (rodamientos, ventilador) casi siempre compensa reparar; si el fallo es eléctrico grave (bobinado quemado) en motores de potencia baja-media, el coste de rebobinado más el tiempo de parada puede acercarse al de un motor nuevo IE3, que además consume menos. En motores de mayor potencia la reparación suele seguir compensando. El servicio técnico de TRADE evalúa cada caso con presupuesto cerrado antes de intervenir.`,
    faq: [
      {
        pregunta: "¿Cómo sé la carcasa IEC de mi motor sin desmontarlo?",
        respuesta:
          "Está en la placa de características, junto a la potencia y la velocidad (por ejemplo, \"100L\" o \"132M\"). Si la placa no es legible, mándanos la potencia, la velocidad y una foto del motor montado y te ayudamos a identificarla.",
      },
      {
        pregunta: "¿Un motor WEG puede sustituir a uno ABB averiado?",
        respuesta:
          "Si comparten potencia, velocidad y carcasa IEC, sí, mecánicamente encajan en la misma bancada. Conviene revisar la posición de la caja de bornes y el sentido de los prensaestopas antes de dar por cerrada la sustitución.",
      },
      {
        pregunta: "¿Reparáis motores de marcas que no vendéis?",
        respuesta:
          "Sí. El servicio de reparación de TRADE no está limitado a las marcas que distribuimos: diagnosticamos y presupuestamos motores de cualquier marca antes de intervenir.",
      },
    ],
  },
  neumatica: {
    slug: "neumatica",
    nombre: "Neumática",
    introCorta:
      "Cilindros normalizados ISO 15552 y electroválvulas Festo para automatización industrial, con las combinaciones de diámetro y carrera más habituales en stock.",
    contenidoTecnico: `## Cilindros normalizados ISO 15552: por qué existen

La norma ISO 15552 define una interfaz de montaje común (posición de roscas de fijación, diámetro del vástago según el diámetro del émbolo) para que cilindros de distintos fabricantes sean intercambiables en el mismo utillaje sin rediseñarlo. Un cilindro DSBC de Festo de Ø32 y un cilindro equivalente de otra marca bajo la misma norma se instalan en el mismo hueco. Lo que sí conviene revisar al sustituir es la variante exacta (roscas del vástago, presencia de ranuras para captadores de posición, tipo de amortiguación), porque dentro de la norma existen distintas configuraciones según el año y el fabricante del equipo original.

## Elegir diámetro y carrera

El diámetro del émbolo determina la fuerza que puede ejercer el cilindro a una presión de trabajo dada; la carrera, el recorrido máximo del vástago. Un error habitual es sobredimensionar el diámetro "por si acaso": un cilindro más grande de lo necesario consume más aire por ciclo, encarece la instalación y puede generar fuerzas de impacto excesivas en los finales de carrera si no se ajusta bien la amortiguación.

## Electroválvulas: función y biestabilidad

Una electroválvula 5/2 vías controla el sentido del aire hacia un cilindro de doble efecto. La versión monoestable vuelve a su posición de reposo en cuanto se corta la señal eléctrica; la biestable mantiene la última posición aunque se corte la alimentación, lo que es preferible en aplicaciones donde un corte de tensión no debe provocar el retroceso incontrolado del cilindro (por ejemplo, una pinza sujetando una pieza).

## Mantenimiento de juntas y filtros

La avería más frecuente en cilindros neumáticos es el desgaste de las juntas del émbolo, que se manifiesta como pérdida de fuerza o fugas de aire audibles. Mantener una unidad de filtro-regulador en buen estado aguas arriba del cilindro (aire seco, sin partículas) alarga significativamente la vida de las juntas frente a una instalación sin tratamiento del aire comprimido.`,
    faq: [
      {
        pregunta: "¿Un cilindro DSBC de Festo es compatible con uno de otra marca ISO 15552?",
        respuesta:
          "Mecánicamente sí, en la interfaz de montaje normalizada. Conviene revisar la variante exacta (rosca del vástago, ranuras para sensores) antes de confirmar el pedido si es una sustitución directa.",
      },
      {
        pregunta: "¿Qué diferencia hay entre una electroválvula monoestable y biestable?",
        respuesta:
          "La monoestable vuelve sola a su posición de reposo al cortar la señal eléctrica; la biestable mantiene la última posición aunque se corte la alimentación. La biestable es preferible cuando un corte de tensión no debe mover el cilindro de forma incontrolada.",
      },
    ],
  },
  "arrancadores-y-proteccion": {
    slug: "arrancadores-y-proteccion",
    nombre: "Arrancadores y protección de motores",
    introCorta:
      "Arrancadores suaves ABB de la gama PSTX para arranque y parada progresiva de motores trifásicos, reduciendo puntas de corriente y desgaste mecánico.",
    contenidoTecnico: `## Qué aporta un arrancador suave frente al arranque directo

El arranque directo de un motor trifásico genera una punta de corriente que puede ser de 6 a 8 veces la corriente nominal durante el instante del arranque, junto con un golpe de par mecánico brusco. Un arrancador suave controla la tensión aplicada al motor durante una rampa de tiempo configurable, reduciendo esa punta de corriente y suavizando el arranque, lo que reduce el desgaste en acoplamientos, correas y la propia instalación eléctrica aguas arriba.

## Arrancador suave o variador de frecuencia: cuándo usar cada uno

Un arrancador suave solo controla el arranque y la parada; una vez el motor alcanza su velocidad nominal, queda conectado directamente a la red (a menudo mediante un contacto de bypass interno para reducir pérdidas). Un variador de frecuencia, en cambio, controla la velocidad de forma continua durante todo el funcionamiento. Si la aplicación necesita regular velocidad de forma permanente (por ejemplo, ajustar el caudal de una bomba), el variador es la opción correcta; si solo se busca suavizar el arranque y la parada de una carga que funciona siempre a velocidad fija, el arrancador suave es una solución más económica.

## Dimensionado por corriente, no solo por potencia

Al igual que con los variadores, el dato clave para elegir un arrancador suave es la corriente nominal del motor a la tensión de red, no solo su potencia en kW, porque la relación entre potencia y corriente varía según la tensión de alimentación y el tipo de arranque. Ante la duda, es preferible consultar con el fabricante la curva de selección exacta antes de confirmar el pedido.`,
    faq: [
      {
        pregunta: "¿Arrancador suave o variador de frecuencia para mi bomba?",
        respuesta:
          "Si necesitas regular el caudal de forma continua, variador. Si la bomba trabaja siempre a la misma velocidad y solo quieres suavizar el arranque y la parada, un arrancador suave es la opción más económica.",
      },
      {
        pregunta: "¿El arrancador PSTX lleva bypass interno?",
        respuesta:
          "La gama PSTX incorpora funciones de bypass interno para reducir pérdidas en régimen permanente una vez completado el arranque. Consulta la ficha de la referencia concreta para confirmar la configuración exacta.",
      },
    ],
  },
};

export const SUBFAMILIAS: Record<string, Record<string, SubfamiliaInfo>> = {
  rodamientos: {
    "rodamientos-rigidos-de-bolas": {
      slug: "rodamientos-rigidos-de-bolas",
      nombre: "Rodamientos rígidos de bolas",
      introCorta: "Series 60, 62 y 63, dimensiones normalizadas ISO 15:2017.",
    },
    "soportes-de-pie": {
      slug: "soportes-de-pie",
      nombre: "Soportes de pie",
      introCorta: "Unidades UCP con rodamiento autoalineable montado, fijación por prisioneros.",
    },
    "soportes-de-brida": {
      slug: "soportes-de-brida",
      nombre: "Soportes de brida",
      introCorta: "Unidades UCFL de brida ovalada para montaje lateral en bastidor.",
    },
  },
  "variadores-de-frecuencia": {
    "variadores-uso-general": {
      slug: "variadores-uso-general",
      nombre: "Variadores de uso general",
      introCorta: "Control V/f, vectorial sin sensor y vectorial con sensor.",
    },
  },
  "motores-electricos": {
    "motores-trifasicos-ie3": {
      slug: "motores-trifasicos-ie3",
      nombre: "Motores trifásicos IE3",
      introCorta: "Carcasa de hierro fundido, IP55, eficiencia premium IE3.",
    },
  },
  neumatica: {
    "cilindros-neumaticos": {
      slug: "cilindros-neumaticos",
      nombre: "Cilindros neumáticos",
      introCorta: "Normalizados ISO 15552, doble efecto, amortiguación ajustable.",
    },
    electrovalvulas: {
      slug: "electrovalvulas",
      nombre: "Electroválvulas",
      introCorta: "Función 5/2 vías, accionamiento por solenoide 24 V DC.",
    },
  },
  "arrancadores-y-proteccion": {
    "arrancadores-suaves": {
      slug: "arrancadores-suaves",
      nombre: "Arrancadores suaves",
      introCorta: "Arranque y parada progresiva con protección integrada del motor.",
    },
  },
};

export function getFamiliaInfo(slug: string): FamiliaInfo {
  return (
    FAMILIAS[slug] ?? {
      slug,
      nombre: slug.replace(/-/g, " "),
      introCorta: "",
      contenidoTecnico: "",
      faq: [],
    }
  );
}

export function getSubfamiliaInfo(familiaSlug: string, subfamiliaSlug: string): SubfamiliaInfo {
  return (
    SUBFAMILIAS[familiaSlug]?.[subfamiliaSlug] ?? {
      slug: subfamiliaSlug,
      nombre: subfamiliaSlug.replace(/-/g, " "),
      introCorta: "",
    }
  );
}

export function getTodasLasFamilias(): FamiliaInfo[] {
  return Object.values(FAMILIAS);
}
