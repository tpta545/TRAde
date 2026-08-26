import { z } from "zod";

export const ROLES_USUARIO = ["comprador", "aprobador", "admin"] as const;
export const ESTADOS_CUENTA = ["pendiente_aprobacion", "activa", "rechazada"] as const;

export const usuarioSchema = z.object({
  id: z.string(),
  email: z.string().email(),
  passwordHash: z.string(),
  nombre: z.string(),
  empresa: z.string(),
  cif: z.string(),
  telefono: z.string(),
  rol: z.enum(ROLES_USUARIO),
  estado: z.enum(ESTADOS_CUENTA),
  /** Descuento sobre tarifa para PRICING_MODE "public_plus_net" (Parte 3). */
  descuentoPorcentaje: z.number().min(0).max(100),
  /** Solo aplica a rol "comprador": pedidos por encima de este importe quedan pendientes de aprobar. */
  limiteImporteSinAprobacion: z.number().nonnegative().nullable(),
  fechaAlta: z.string(),
});

export type Usuario = z.infer<typeof usuarioSchema>;

export type UsuarioSesion = Pick<
  Usuario,
  "id" | "email" | "nombre" | "empresa" | "rol" | "descuentoPorcentaje" | "estado"
>;
