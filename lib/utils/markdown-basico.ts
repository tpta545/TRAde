/**
 * Conversor mínimo de markdown a HTML para el contenido propio del blog
 * (definido en /lib/data/blog.ts, nunca texto de usuario). Soporta
 * encabezados "## " y negrita "**texto**", suficiente para los artículos
 * técnicos de la Parte 7.9 sin añadir una dependencia de markdown completa.
 */
export function markdownBasicoAHtml(markdown: string): string {
  const bloques = markdown.trim().split(/\n\s*\n/);

  return bloques
    .map((bloque) => {
      const conNegrita = bloque.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");
      if (bloque.startsWith("## ")) {
        return `<h2>${conNegrita.replace(/^##\s+/, "")}</h2>`;
      }
      return `<p>${conNegrita}</p>`;
    })
    .join("\n");
}
