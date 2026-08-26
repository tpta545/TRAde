import { z } from "zod";

export const itemListaSchema = z.object({
  productoId: z.string(),
  referencia: z.string(),
  nombre: z.string(),
  precioTarifa: z.number().nonnegative(),
  cantidad: z.number().int().positive(),
});

export const listaCompraSchema = z.object({
  id: z.string(),
  usuarioId: z.string(),
  nombre: z.string().min(1),
  items: z.array(itemListaSchema),
  fechaCreacion: z.string(),
});

export type ItemLista = z.infer<typeof itemListaSchema>;
export type ListaCompra = z.infer<typeof listaCompraSchema>;
