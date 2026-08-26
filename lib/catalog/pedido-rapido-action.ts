"use server";

import { parsearPedidoRapido, type LineaPedidoRapido } from "@/lib/catalog/pedido-rapido";

export async function procesarPedidoRapido(texto: string): Promise<LineaPedidoRapido[]> {
  return parsearPedidoRapido(texto);
}
