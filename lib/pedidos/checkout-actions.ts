"use server";

import { z } from "zod";
import { obtenerSesion } from "@/lib/auth/session";
import { buscarUsuarioPorEmail } from "@/lib/auth/usuarios-repo";
import { esNifOCifValido } from "@/lib/utils/nif";
import { siteConfig } from "@/config/site";
import { crearPedido } from "@/lib/pedidos/store";
import { lineaPedidoSchema, direccionSchema, FORMAS_PAGO } from "@/lib/pedidos/pedido";
import { generarFormularioPago, type FormularioRedsys } from "@/lib/pago/redsys";

const checkoutSchema = z.object({
  itemsJson: z.string(),
  cif: z.string().refine(esNifOCifValido, "El CIF/NIF no es válido"),
  razonSocial: z.string().min(2),
  personaContacto: z.string().min(2),
  telefonoContacto: z.string().min(6),
  emailContacto: z.string().email(),
  referenciaPedidoCliente: z.string().optional(),
  observacionesEntrega: z.string().optional(),
  formaPago: z.enum(FORMAS_PAGO),
  envioCalle: z.string().min(3),
  envioCp: z.string().min(4),
  envioLocalidad: z.string().min(2),
  envioProvincia: z.string().min(2),
  mismaDireccionFacturacion: z.string().optional(),
  facturacionCalle: z.string().optional(),
  facturacionCp: z.string().optional(),
  facturacionLocalidad: z.string().optional(),
  facturacionProvincia: z.string().optional(),
});

export type EstadoCheckout =
  | { ok: false; mensaje: string }
  | { ok: true; pedidoId: string; formaPago: (typeof FORMAS_PAGO)[number]; redsys: FormularioRedsys | null };

export async function procesarCheckoutAction(
  _estadoPrevio: EstadoCheckout,
  formData: FormData,
): Promise<EstadoCheckout> {
  const resultado = checkoutSchema.safeParse(Object.fromEntries(formData));
  if (!resultado.success) {
    return { ok: false, mensaje: resultado.error.issues[0]?.message ?? "Revisa los datos del formulario." };
  }
  const datos = resultado.data;

  let items: unknown;
  try {
    items = JSON.parse(datos.itemsJson);
  } catch {
    return { ok: false, mensaje: "Tu carrito no es válido, vuelve a intentarlo." };
  }
  const lineasResultado = z.array(lineaPedidoSchema).min(1).safeParse(items);
  if (!lineasResultado.success) {
    return { ok: false, mensaje: "Tu carrito está vacío o contiene datos inválidos." };
  }
  const lineas = lineasResultado.data;

  const subtotal = lineas.reduce((acc, l) => acc + l.precioUnitario * l.cantidad, 0);
  const iva = subtotal * (siteConfig.comercio.ivaPorcentaje / 100);
  const total = subtotal + iva;

  const direccionEnvioResultado = direccionSchema.safeParse({
    nombre: datos.razonSocial,
    calle: datos.envioCalle,
    codigoPostal: datos.envioCp,
    localidad: datos.envioLocalidad,
    provincia: datos.envioProvincia,
    pais: "ES",
  });
  if (!direccionEnvioResultado.success) {
    return { ok: false, mensaje: "Revisa la dirección de envío." };
  }

  const usarMismaDireccion = datos.mismaDireccionFacturacion === "on";
  const direccionFacturacionResultado = direccionSchema.safeParse(
    usarMismaDireccion
      ? direccionEnvioResultado.data
      : {
          nombre: datos.razonSocial,
          calle: datos.facturacionCalle,
          codigoPostal: datos.facturacionCp,
          localidad: datos.facturacionLocalidad,
          provincia: datos.facturacionProvincia,
          pais: "ES",
        },
  );
  if (!direccionFacturacionResultado.success) {
    return { ok: false, mensaje: "Revisa la dirección de facturación." };
  }

  const sesion = await obtenerSesion();
  if (datos.formaPago === "cuenta_30_60" && !sesion) {
    return { ok: false, mensaje: "El pago a 30/60 días solo está disponible para cuentas B2B aprobadas." };
  }

  let estadoPedido: "pendiente_pago" | "pendiente_aprobacion" | "confirmado" = "pendiente_pago";
  if (datos.formaPago === "cuenta_30_60" && sesion) {
    const usuario = await buscarUsuarioPorEmail(sesion.email);
    const limite = usuario?.limiteImporteSinAprobacion;
    estadoPedido =
      sesion.rol === "comprador" && limite !== null && limite !== undefined && total > limite
        ? "pendiente_aprobacion"
        : "confirmado";
  }

  const plazoEntregaDias = Math.max(...lineas.map((l) => (l.bajoPedido ? 3 : 0)), 0);

  const pedido = await crearPedido({
    usuarioId: sesion?.id ?? null,
    fecha: new Date().toISOString(),
    estado: estadoPedido,
    lineas,
    subtotal,
    iva,
    total,
    formaPago: datos.formaPago,
    cif: datos.cif,
    razonSocial: datos.razonSocial,
    personaContacto: datos.personaContacto,
    telefonoContacto: datos.telefonoContacto,
    emailContacto: datos.emailContacto,
    referenciaPedidoCliente: datos.referenciaPedidoCliente,
    observacionesEntrega: datos.observacionesEntrega,
    direccionEnvio: direccionEnvioResultado.data,
    direccionFacturacion: direccionFacturacionResultado.data,
    plazoEntregaDias,
  });

  if (datos.formaPago !== "tarjeta") {
    return { ok: true, pedidoId: pedido.id, formaPago: datos.formaPago, redsys: null };
  }

  const redsys = generarFormularioPago({
    numeroPedido: pedido.numero,
    importeEnCentimos: Math.round(total * 100),
    urlNotificacion: `${siteConfig.urlBase}/api/redsys/notificacion`,
    urlOk: `${siteConfig.urlBase}/pedido/${pedido.id}?pago=ok`,
    urlKo: `${siteConfig.urlBase}/pedido/${pedido.id}?pago=ko`,
    descripcion: `Pedido ${pedido.numero}`,
  });

  return { ok: true, pedidoId: pedido.id, formaPago: "tarjeta", redsys };
}
