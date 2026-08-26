import { getProductos } from "@/lib/data/productos";
import { normalizarReferencia } from "@/lib/search/normalizar";
import type { Producto } from "@/lib/schemas/producto";

export type LineaPedidoRapido =
  | { estado: "encontrada"; textoOriginal: string; producto: Producto; cantidad: number }
  | { estado: "no_encontrada"; textoOriginal: string };

/**
 * Parsea líneas "REFERENCIA;CANTIDAD" (o "REFERENCIA CANTIDAD",
 * "REFERENCIA,CANTIDAD") pegadas en el QuickOrderPad y las casa contra el
 * catálogo por referencia normalizada (Parte 7.4).
 */
export async function parsearPedidoRapido(texto: string): Promise<LineaPedidoRapido[]> {
  const productos = await getProductos();
  const lineas = texto
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);

  return lineas.map((linea) => {
    const partes = linea.split(/[;,\t]|\s{2,}|(?<=\S)\s(?=\d+$)/).map((p) => p.trim());
    const referenciaTexto = partes[0] ?? linea;
    const cantidadTexto = partes[1];
    const cantidad = cantidadTexto ? Number.parseInt(cantidadTexto, 10) : 1;

    const refNormalizada = normalizarReferencia(referenciaTexto);
    const producto = productos.find((p) => p.referenciaNormalizada === refNormalizada);

    if (!producto) return { estado: "no_encontrada", textoOriginal: linea };
    return {
      estado: "encontrada",
      textoOriginal: linea,
      producto,
      cantidad: Number.isFinite(cantidad) && cantidad > 0 ? cantidad : producto.multiploVenta,
    };
  });
}
