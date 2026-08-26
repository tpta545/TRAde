"use server";

import { revalidatePath } from "next/cache";
import { obtenerSesion } from "@/lib/auth/session";
import { actualizarEstadoPedido, getPedido } from "@/lib/pedidos/store";

export async function aprobarPedidoAction(pedidoId: string): Promise<void> {
  const sesion = await obtenerSesion();
  const pedido = await getPedido(pedidoId);
  if (!sesion || sesion.rol !== "aprobador" || !pedido || pedido.razonSocial !== sesion.empresa) {
    throw new Error("No autorizado para aprobar este pedido");
  }
  await actualizarEstadoPedido(pedidoId, "confirmado");
  revalidatePath("/cuenta/pedidos");
  revalidatePath("/cuenta");
}

export async function rechazarPedidoAction(pedidoId: string): Promise<void> {
  const sesion = await obtenerSesion();
  const pedido = await getPedido(pedidoId);
  if (!sesion || sesion.rol !== "aprobador" || !pedido || pedido.razonSocial !== sesion.empresa) {
    throw new Error("No autorizado para rechazar este pedido");
  }
  await actualizarEstadoPedido(pedidoId, "cancelado");
  revalidatePath("/cuenta/pedidos");
  revalidatePath("/cuenta");
}
