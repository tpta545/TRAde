import { z } from "zod";

export const lineaPedidoSchema = z.object({
  productoId: z.string(),
  referencia: z.string(),
  nombre: z.string(),
  marca: z.string(),
  precioUnitario: z.number().nonnegative(),
  cantidad: z.number().int().positive(),
  bajoPedido: z.boolean(),
});

export const ESTADOS_PEDIDO = [
  "pendiente_aprobacion",
  "pendiente_pago",
  "confirmado",
  "preparando",
  "enviado",
  "entregado",
  "cancelado",
] as const;

export const FORMAS_PAGO = ["tarjeta", "transferencia", "cuenta_30_60"] as const;

export const direccionSchema = z.object({
  nombre: z.string().min(2),
  calle: z.string().min(3),
  codigoPostal: z.string().min(4),
  localidad: z.string().min(2),
  provincia: z.string().min(2),
  pais: z.string().default("ES"),
});

export const pedidoSchema = z.object({
  id: z.string(),
  numero: z.string(),
  usuarioId: z.string().nullable(),
  fecha: z.string(),
  estado: z.enum(ESTADOS_PEDIDO),
  lineas: z.array(lineaPedidoSchema).min(1),
  subtotal: z.number().nonnegative(),
  iva: z.number().nonnegative(),
  total: z.number().nonnegative(),
  formaPago: z.enum(FORMAS_PAGO),
  cif: z.string(),
  razonSocial: z.string(),
  personaContacto: z.string(),
  telefonoContacto: z.string(),
  emailContacto: z.string(),
  referenciaPedidoCliente: z.string().optional(),
  observacionesEntrega: z.string().optional(),
  direccionEnvio: direccionSchema,
  direccionFacturacion: direccionSchema,
  plazoEntregaDias: z.number().int().nonnegative(),
});

export type Pedido = z.infer<typeof pedidoSchema>;
export type LineaPedido = z.infer<typeof lineaPedidoSchema>;
export type Direccion = z.infer<typeof direccionSchema>;
