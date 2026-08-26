/** "6205 2RS", "6205-2rs", "62052RS" deben encontrar el mismo resultado. */
export function normalizarReferencia(texto: string): string {
  return texto.toLowerCase().replace(/[^a-z0-9]/g, "");
}

/** Quita acentos para comparar "electrovalvula" y "electroválvula" por igual. */
export function normalizarTexto(texto: string): string {
  return texto
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "");
}
