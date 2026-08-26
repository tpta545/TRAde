import "server-only";
import { getProductos } from "@/lib/data/productos";
import { normalizarReferencia } from "@/lib/search/normalizar";
import type { Producto } from "@/lib/schemas/producto";

/**
 * Busca en la tabla de equivalencias de todo el catálogo: el visitante mete
 * una referencia de cualquier marca (SKF, FAG, INA...) y devolvemos el
 * producto propio que la tiene marcada como equivalente (Parte 7.9,
 * /recursos/equivalencias).
 */
export async function buscarPorReferenciaEquivalente(referenciaBuscada: string): Promise<Producto[]> {
  const buscada = normalizarReferencia(referenciaBuscada);
  if (buscada.length < 3) return [];

  const productos = await getProductos();
  return productos.filter((producto) =>
    producto.equivalencias.some((eq) => {
      const referenciaNormalizada = normalizarReferencia(eq.referencia);
      // Coincidencia exacta si solo escriben la referencia ("6205-2Z"), o
      // por sufijo si escriben "marca + referencia" ("SKF 6205-2Z"), ya que
      // normalizarReferencia no separa letras de marca de letras de referencia.
      return buscada === referenciaNormalizada || buscada.endsWith(referenciaNormalizada);
    }),
  );
}
