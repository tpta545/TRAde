import { z } from "zod";

export const itemPresupuestoSchema = z.object({
  referencia: z.string(),
  nombre: z.string(),
  precioTarifa: z.number().nonnegative(),
  cantidad: z.number().int().positive(),
});

export const presupuestoSchema = z.object({
  id: z.string(),
  usuarioId: z.string(),
  referencias: z.string(),
  mensaje: z.string().optional(),
  estado: z.enum(["solicitado", "recibido"]),
  itemsPropuestos: z.array(itemPresupuestoSchema).default([]),
  fecha: z.string(),
});

export type Presupuesto = z.infer<typeof presupuestoSchema>;
