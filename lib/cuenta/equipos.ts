import { z } from "zod";

export const equipoSchema = z.object({
  id: z.string(),
  usuarioId: z.string(),
  nombre: z.string().min(1),
  marca: z.string().optional(),
  modelo: z.string().optional(),
  ubicacion: z.string().optional(),
  fechaAlta: z.string(),
});

export type Equipo = z.infer<typeof equipoSchema>;
