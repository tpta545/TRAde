export type ArticuloBlog = {
  slug: string;
  titulo: string;
  resumen: string;
  fechaPublicacion: string;
  categoria: string;
  contenido: string;
};

// Contenido real se añade en la Fase 4 (Parte 7.9 del prompt maestro).
const ARTICULOS: ArticuloBlog[] = [];

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
