/**
 * Mapeos de dominio (slug de catálogo → id de imagen del manifiesto de la
 * Fase V). Viven aparte de scripts/images/manifest.ts porque ese fichero es
 * el inventario de generación, no un índice de consulta en runtime.
 */
export const FAMILIA_A_IMAGEN: Record<string, string> = {
  rodamientos: "fam-rodamientos",
  "variadores-de-frecuencia": "fam-variadores",
  "motores-electricos": "fam-motores-electricos",
  neumatica: "fam-neumatica",
  "arrancadores-y-proteccion": "fam-arrancadores",
};
