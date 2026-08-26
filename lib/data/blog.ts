export type ArticuloBlog = {
  slug: string;
  titulo: string;
  resumen: string;
  fechaPublicacion: string;
  categoria: string;
  contenido: string;
};

const ARTICULOS: ArticuloBlog[] = [
  {
    slug: "como-leer-la-placa-de-caracteristicas-de-un-motor-electrico",
    titulo: "Cómo leer la placa de características de un motor eléctrico",
    resumen:
      "Los siete datos de la placa que necesitas para pedir un motor de recambio sin equivocarte, y qué hacer cuando ya no se lee.",
    fechaPublicacion: "2026-06-02",
    categoria: "Motores eléctricos",
    contenido: `La placa de un motor trifásico lleva más información de la que parece a primera vista, pero para pedir un recambio solo necesitas fijarte en siete datos.

**Potencia (kW).** Es el dato más visible, pero por sí solo no basta: dos motores de la misma potencia pueden tener carcasas distintas.

**Velocidad nominal (rpm) y número de polos.** 3000 rpm son 2 polos, 1500 rpm son 4 polos, 1000 rpm son 6 polos. Este dato, junto con la potencia, determina la carcasa IEC del motor (ver nuestro artículo sobre motores W22 e IE3 en la ficha de producto).

**Tensión y tipo de conexión.** Verás algo como "230/400 V Δ/Y" o "400/690 V". Indica las dos tensiones a las que puede conectarse según la conexión de las bobinas (triángulo o estrella).

**Corriente nominal (A).** Va emparejada con la tensión anterior: a menor tensión, mayor corriente, y viceversa.

**Grado de protección IP.** IP55 es el estándar para motores industriales de uso general: protegido contra polvo y contra chorros de agua.

**Clase de eficiencia (IE1, IE2, IE3).** Desde 2021 la normativa europea exige IE3 como mínimo para la mayoría de motores nuevos de uso general, así que un motor IE1 averiado se sustituye hoy por un IE3.

**Carcasa IEC (por ejemplo, "100L" o "132M").** Es el dato que garantiza que el motor nuevo encaja mecánicamente en el mismo hueco: mismas medidas de patas, altura de eje y diámetro de eje, sea cual sea la marca.

**¿Y si la placa ya no se lee?** Pasa más de lo que parece: motores con años de servicio, placas pintadas o corroídas. En ese caso, mide tú mismo el diámetro del eje y la distancia entre patas, cuenta las revoluciones aproximadas si el motor todavía gira, y llámanos con esos datos. Con potencia aproximada más las medidas físicas casi siempre podemos identificar la referencia equivalente.`,
  },
  {
    slug: "codigos-de-sufijo-de-rodamientos-2rs-zz-c3",
    titulo: "Códigos de sufijo de rodamientos: qué significa 2RS, ZZ, C3",
    resumen:
      "El número del rodamiento define la medida; el sufijo define cómo se comporta. Guía rápida de los sufijos que más se piden en mantenimiento.",
    fechaPublicacion: "2026-05-14",
    categoria: "Rodamientos",
    contenido: `Un "6205-2RS" y un "6205ZZ" tienen exactamente las mismas dimensiones —25x52x15 mm— porque el número base (6205) es lo que fija la medida. Lo que cambia es el sufijo, y ahí es donde se cuela el error más habitual al pedir por teléfono.

**ZZ (o 2Z).** Blindaje metálico a ambos lados de la pista de rodadura. Protege razonablemente bien contra el polvo grueso, con poco rozamiento añadido, por lo que es la opción preferida en aplicaciones de velocidad media-alta.

**2RS (o 2RSR, 2RS1 según el fabricante).** Junta de contacto de caucho sintético a ambos lados. Sella mejor que un blindaje metálico frente a polvo fino y humedad, a cambio de algo más de rozamiento y una velocidad máxima admisible algo menor.

**C3.** No es una protección, es un juego interno radial mayor que el estándar (C0). Se usa cuando el ajuste entre el rodamiento y el eje o la carcasa es apretado, o cuando la temperatura de servicio es alta: en caliente, las piezas se dilatan y un juego C3 evita que el rodamiento se quede sin holgura y se agarrote. Si tu rodamiento original no especifica juego, casi siempre es C0 (estándar) y no hace falta pedir C3.

**Serie (60, 62, 63…).** No es un sufijo sino parte del número base, pero conviene mencionarlo porque genera tanta confusión como los sufijos: para el mismo diámetro de eje, la serie 60 es más estrecha, la 62 es la estándar y la 63 es más ancha y con más capacidad de carga. Un 6205 y un 6305 comparten diámetro interior (25 mm) pero no son intercambiables.

**Regla práctica al pedir por teléfono:** danos el número completo tal y como aparece grabado en el rodamiento, sin redondear ni "traducir" el sufijo de memoria. Si no se lee bien, una foto nítida del grabado resuelve la duda en segundos.`,
  },
  {
    slug: "como-interpretar-los-codigos-de-fallo-del-variador-abb-acs580",
    titulo: "Cómo interpretar los códigos de fallo del variador ABB ACS580",
    resumen:
      "El ACS580 no usa los códigos \"F0001\" de la generación anterior: repasamos su numeración real y qué hacer con las averías más frecuentes.",
    fechaPublicacion: "2026-04-20",
    categoria: "Variadores de frecuencia",
    contenido: `Si buscas "código de fallo F0001" para un ACS580 y no encuentras nada que encaje, no es que te falte información: es que ese formato de código pertenece a la generación anterior de variadores ABB (ACS550, ACS355). El ACS580, como el resto de la gama ACS880/ACS580 actual, identifica cada fallo con un código numérico de 4 dígitos que aparece en la pantalla del panel de control junto con un texto descriptivo.

Algunos de los más habituales en mantenimiento industrial:

**2310 — Sobrecorriente.** La corriente de salida ha superado el umbral interno del variador, normalmente entre el 200 % y el 300 % de la corriente nominal. Las causas más frecuentes son un cortocircuito en el motor o el cableado, una rampa de aceleración demasiado corta para la inercia de la carga, o un motor mal dimensionado para la aplicación.

**2330 — Fuga a tierra.** El variador detecta un desequilibrio de carga típico de una derivación a tierra en el motor o en el cable de motor. Conviene medir el aislamiento del motor antes de sospechar del variador.

**2381 — Sobrecarga de IGBT.** Temperatura excesiva en los transistores de potencia. Revisa la ventilación del armario y el estado del ventilador interno del variador antes de nada.

**3210 — Sobretensión en el bus de continua.** Habitual en paradas o deceleraciones bruscas de cargas con mucha inercia, que devuelven energía al variador más rápido de lo que puede disiparla.

**3220 — Subtensión en el bus de continua.** Generalmente indica un problema de la red eléctrica de entrada (caída de tensión, fase perdida) más que una avería del propio variador.

**Un aviso importante:** los números de fallo pueden variar ligeramente entre versiones de firmware del propio ACS580, así que antes de dar por buena la causa, confirma el código exacto y su descripción en el manual de tu unidad concreta. Si la avería persiste después de revisar lo obvio, tráenoslo: diagnosticamos con presupuesto cerrado antes de intervenir.`,
  },
  {
    slug: "equivalencias-de-rodamientos-entre-skf-fag-ntn-e-isb",
    titulo: "Equivalencias de rodamientos entre SKF, FAG, NTN e ISB",
    resumen:
      "Por qué un rodamiento de una marca casi siempre tiene equivalente directo en otra, y cuándo hay que tener más cuidado.",
    fechaPublicacion: "2026-03-11",
    categoria: "Rodamientos",
    contenido: `Los rodamientos rígidos de bolas de las series estándar (60, 62, 63...) están dimensionados según la norma ISO 15:2017, que fija el diámetro interior, el diámetro exterior y la anchura para cada número. Esto significa que un SKF 6205-2RS1, un FAG 6205-2RSR, un NTN 6205LLU y un ISB 6205-2RS son, en la práctica, la misma pieza en cuanto a dimensiones e intercambiabilidad mecánica: cada fabricante añade su propio sufijo para el mismo tipo de protección (junta de contacto a ambos lados, en este ejemplo), pero el número base 6205 es el que manda.

Lo que sí puede variar entre fabricantes, aunque las dimensiones coincidan:

**Capacidad de carga.** Fabricantes premium como SKF o FAG suelen publicar capacidades de carga dinámica ligeramente superiores en algunas referencias, por procesos de fabricación y materiales de mayor tolerancia. Para la mayoría de aplicaciones de mantenimiento general la diferencia no es determinante, pero en equipos de alta exigencia (velocidad muy alta, cargas cíclicas severas) conviene revisar la ficha técnica de la referencia concreta.

**Precisión y ruido.** En aplicaciones donde el ruido o la vibración importan (por ejemplo, ventiladores en zonas ocupadas), algunas gamas premium ofrecen tolerancias más ajustadas.

**Soportes y unidades con rodamiento montado.** En las series UCP/UCFL de soportes, la equivalencia funciona igual: un ISB UCP205 y un SKF SY 25 TF comparten diámetro de eje (25 mm) y tipo de fijación, y son intercambiables en la práctica totalidad de instalaciones.

En TRADE trabajamos principalmente con NTN e ISB por relación calidad-precio y disponibilidad, pero mantenemos las equivalencias con las marcas premium en la ficha de cada producto para que puedas verificar tú mismo la referencia que llevas montada.`,
  },
  {
    slug: "cuando-reparar-y-cuando-sustituir-un-variador-de-frecuencia",
    titulo: "Cuándo reparar y cuándo sustituir un variador de frecuencia",
    resumen:
      "No todo variador averiado compensa repararlo. Una guía orientativa antes de pedir presupuesto.",
    fechaPublicacion: "2026-02-18",
    categoria: "Reparación",
    contenido: `La primera pregunta que hacemos cuando llega un variador averiado no es "¿cuánto cuesta arreglarlo?" sino "¿compensa arreglarlo?". Depende de tres factores.

**Tipo de avería.** Un fallo de un componente concreto (condensadores del bus de continua, ventilador de refrigeración, tarjeta de control) suele ser una reparación razonable, con un coste bien por debajo de una unidad nueva. Un fallo en la etapa de potencia (IGBT quemados en cortocircuito, por ejemplo tras una sobrecorriente severa) puede arrastrar daños en cascada a otros componentes, y ahí el cálculo cambia.

**Antigüedad y disponibilidad de repuestos.** Un variador de una gama descatalogada hace años puede tener piezas difíciles de conseguir, lo que encarece y alarga la reparación. Si además la potencia instalada ha quedado obsoleta para las necesidades actuales de la línea, sustituir por una unidad de gama vigente suele salir mejor a medio plazo.

**Lo que se deja de ganar con un modelo antiguo.** Un variador nuevo de gama actual como el ACS580 incorpora control PID integrado, mejor eficiencia y diagnóstico más completo que un modelo de hace diez o quince años. En aplicaciones donde ese ahorro energético es significativo (bombas y ventiladores funcionando muchas horas al día), la sustitución se amortiza más rápido de lo que parece a primera vista.

**Nuestra forma de trabajarlo.** Diagnosticamos primero, sin coste de desmontaje si el equipo viene a nuestro taller, y dejamos claro en el presupuesto las dos opciones cuando ambas son razonables: reparar con el precio cerrado, o sustituir por el equivalente nuevo con el descuento que aplicamos cuando el cliente opta por el cambio. La decisión final siempre es tuya, con los números delante.`,
  },
];

export async function getTodosLosArticulos(): Promise<ArticuloBlog[]> {
  return ARTICULOS;
}

export async function getArticuloPorSlug(slug: string): Promise<ArticuloBlog | undefined> {
  return ARTICULOS.find((articulo) => articulo.slug === slug);
}

export async function getUltimosArticulos(cantidad: number): Promise<ArticuloBlog[]> {
  return [...ARTICULOS]
    .sort((a, b) => b.fechaPublicacion.localeCompare(a.fechaPublicacion))
    .slice(0, cantidad);
}
