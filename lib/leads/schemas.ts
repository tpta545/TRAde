import { z } from "zod";

export const busquedaSinResultadosSchema = z.object({
  consulta: z.string().min(2),
  telefono: z.string().min(6),
  email: z.string().email().optional().or(z.literal("")),
});

export const leadReparacionSchema = z.object({
  marca: z.string().min(1),
  modelo: z.string().min(1),
  numeroSerie: z.string().optional(),
  averia: z.string().min(10),
  telefono: z.string().min(6),
  email: z.string().email().optional().or(z.literal("")),
  nombreFoto: z.string().optional(),
});

export const leadServicioSchema = z.object({
  nombre: z.string().min(2),
  empresa: z.string().min(2),
  telefono: z.string().min(6),
  email: z.string().email().optional().or(z.literal("")),
  mensaje: z.string().min(10),
});

export const leadOfertaSchema = z.object({
  referencia: z.string().optional(),
  nombre: z.string().min(2),
  empresa: z.string().min(2),
  telefono: z.string().min(6),
  email: z.string().email().optional().or(z.literal("")),
  cantidad: z.string().optional(),
  mensaje: z.string().optional(),
});
