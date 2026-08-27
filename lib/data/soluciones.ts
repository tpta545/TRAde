export type SolucionSector = {
  slug: string;
  nombre: string;
  resumen: string;
  contenido: string;
  familiasRelevantes: string[];
};

export const SOLUCIONES: Record<string, SolucionSector> = {
  citricos: {
    slug: "citricos",
    nombre: "Cítricos y confección de fruta",
    resumen: "Recambio y mantenimiento para líneas de confección, calibrado y bombeo de riego en campañas con parada cero.",
    contenido:
      "En campaña, una línea de confección parada cuesta más que cualquier recambio. Las averías más habituales que vemos en cooperativas y almacenes de confección de la zona son rodamientos de rodillos transportadores, motores de bombas de riego y variadores que controlan el caudal de las líneas de lavado. Mantener referencias críticas en stock propio, y no depender del plazo de fabricante en plena campaña, es la razón por la que muchas instalaciones citrícolas de la Comunitat Valenciana trabajan con nosotros.",
    familiasRelevantes: ["rodamientos", "motores-electricos", "variadores-de-frecuencia"],
  },
  ceramica: {
    slug: "ceramica",
    nombre: "Cerámica",
    resumen: "Motores y variadores para hornos, secaderos y líneas de prensado, con entornos de polvo y temperatura exigentes.",
    contenido:
      "El polvo fino y las temperaturas elevadas de un secadero o de una línea de prensado desgastan rodamientos y ventiladores de motor más rápido que en una instalación estándar. En este sector es habitual priorizar protecciones IP55 y revisar la ventilación de los variadores de frecuencia con más frecuencia de lo normal. También es uno de los sectores donde más se nota la diferencia entre reparar y sustituir un motor cuando el fallo es eléctrico: con el polvo cerámico, un rebobinado mal sellado vuelve a fallar antes.",
    familiasRelevantes: ["motores-electricos", "variadores-de-frecuencia", "rodamientos"],
  },
  alimentacion: {
    slug: "alimentacion",
    nombre: "Alimentación y envasado",
    resumen: "Neumática y transmisión para líneas de envasado, dosificación y paletizado con exigencias de limpieza.",
    contenido:
      "Las líneas de envasado combinan automatización neumática (cilindros y electroválvulas para posicionadores, pinzas y compuertas) con transmisión clásica en cintas transportadoras y dosificadoras. La disponibilidad de recambio es crítica porque una línea de envasado parada no solo detiene la producción, también puede comprometer el producto que queda a medio proceso. Mantenemos stock de los diámetros de cilindro y las electroválvulas de mayor rotación en este tipo de instalaciones.",
    familiasRelevantes: ["neumatica", "rodamientos"],
  },
  agricola: {
    slug: "agricola",
    nombre: "Maquinaria agrícola",
    resumen: "Reductores, tomas de fuerza y transmisión para talleres y flotas de maquinaria agrícola.",
    contenido:
      "El taller de maquinaria agrícola trabaja con reductores, cardanes y rodamientos sometidos a polvo, vibración y paradas de campaña que no admiten demora. Mantener en stock las referencias de transmisión más habituales —rodamientos de eje de tractor, correas y reductores de toma de fuerza— es lo que marca la diferencia entre una reparación de una tarde y una máquina parada varios días en plena recolección.",
    familiasRelevantes: ["rodamientos", "motores-electricos"],
  },
};

export function getSolucion(slug: string): SolucionSector | undefined {
  return SOLUCIONES[slug];
}

export function getTodasLasSoluciones(): SolucionSector[] {
  return Object.values(SOLUCIONES);
}
