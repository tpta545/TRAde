import { NextResponse } from "next/server";
import { decodificarParametros, verificarNotificacion } from "@/lib/pago/redsys";
import { actualizarEstadoPedido, getPedidoPorNumero } from "@/lib/pedidos/store";

/**
 * Notificación server-to-server de Redsys tras un intento de pago (Ds_Response
 * 0-99 = autorizado). Redsys reintenta si no recibe 200 OK, así que
 * respondemos 200 incluso ante firma inválida (para no generar reintentos
 * infinitos) pero sin marcar el pedido como pagado en ese caso.
 */
export async function POST(request: Request) {
  const formData = await request.formData();
  const parametros = String(formData.get("Ds_MerchantParameters") ?? "");
  const firma = String(formData.get("Ds_Signature") ?? "");

  if (!parametros || !firma || !verificarNotificacion(parametros, firma)) {
    console.error("Notificación Redsys con firma inválida");
    return new NextResponse("OK", { status: 200 });
  }

  const datos = decodificarParametros(parametros);
  const numeroPedido = datos.Ds_Order ?? datos.DS_ORDER;
  const codigoRespuesta = Number(datos.Ds_Response ?? datos.DS_RESPONSE ?? "9999");

  const pedido = await getPedidoPorNumero(numeroPedido);
  if (pedido) {
    await actualizarEstadoPedido(pedido.id, codigoRespuesta <= 99 ? "confirmado" : "cancelado");
  }

  return new NextResponse("OK", { status: 200 });
}
