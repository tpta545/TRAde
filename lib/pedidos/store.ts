import "server-only";
import { crearColeccion } from "@/lib/db/json-store";
import type { Pedido } from "@/lib/pedidos/pedido";

const coleccionPedidos = crearColeccion<Pedido>("pedidos");

const ALFANUMERICO = "ABCDEFGHJKLMNPQRSTUVWXYZ0123456789";

/**
 * Genera un número de pedido compatible con Redsys: 4-12 caracteres, los 4
 * primeros obligatoriamente numéricos (Ds_Merchant_Order). Formato:
 * AAMM (4 dígitos) + DD (2 dígitos) + 4 caracteres alfanuméricos = 10.
 * Se usa tal cual como Ds_Merchant_Order, así que pedido.numero es siempre
 * lo que hay que buscar al recibir la notificación de pago.
 */
function generarNumeroPedido(): string {
  const fecha = new Date();
  const aamm = `${String(fecha.getFullYear()).slice(-2)}${String(fecha.getMonth() + 1).padStart(2, "0")}`;
  const dd = String(fecha.getDate()).padStart(2, "0");
  const sufijo = Array.from({ length: 4 }, () => ALFANUMERICO[Math.floor(Math.random() * ALFANUMERICO.length)]).join("");
  return `${aamm}${dd}${sufijo}`;
}

export async function crearPedido(datos: Omit<Pedido, "id" | "numero">): Promise<Pedido> {
  return coleccionPedidos.insertar({ ...datos, numero: generarNumeroPedido() });
}

export async function getPedido(id: string): Promise<Pedido | undefined> {
  return coleccionPedidos.porId(id);
}

export async function getPedidoPorNumero(numero: string): Promise<Pedido | undefined> {
  return coleccionPedidos.buscarUno((p) => p.numero === numero);
}

export async function getPedidosDeUsuario(usuarioId: string): Promise<Pedido[]> {
  const pedidos = await coleccionPedidos.buscar((p) => p.usuarioId === usuarioId);
  return pedidos.sort((a, b) => b.fecha.localeCompare(a.fecha));
}

export async function getPedidosPendientesDeAprobar(empresa: string): Promise<Pedido[]> {
  const pedidos = await coleccionPedidos.buscar(
    (p) => p.estado === "pendiente_aprobacion" && p.razonSocial === empresa,
  );
  return pedidos.sort((a, b) => b.fecha.localeCompare(a.fecha));
}

export async function actualizarEstadoPedido(id: string, estado: Pedido["estado"]): Promise<void> {
  await coleccionPedidos.actualizar(id, { estado });
}
