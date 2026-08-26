"use server";

import { revalidatePath } from "next/cache";
import { crearColeccion } from "@/lib/db/json-store";
import { obtenerSesion } from "@/lib/auth/session";
import { guardarLead } from "@/lib/leads/store";
import type { Presupuesto } from "@/lib/cuenta/presupuestos";
import type { EstadoFormulario } from "@/lib/leads/actions";

const coleccionPresupuestos = crearColeccion<Presupuesto>("presupuestos");

export async function getPresupuestosDeUsuario(usuarioId: string): Promise<Presupuesto[]> {
  const presupuestos = await coleccionPresupuestos.buscar((p) => p.usuarioId === usuarioId);
  return presupuestos.sort((a, b) => b.fecha.localeCompare(a.fecha));
}

export async function solicitarPresupuestoAction(
  _estadoPrevio: EstadoFormulario,
  formData: FormData,
): Promise<EstadoFormulario> {
  const sesion = await obtenerSesion();
  if (!sesion) return { ok: false, mensaje: "Tienes que iniciar sesión." };

  const referencias = String(formData.get("referencias") ?? "").trim();
  const mensaje = String(formData.get("mensaje") ?? "").trim();
  if (!referencias) return { ok: false, mensaje: "Indica al menos una referencia o descripción." };

  await coleccionPresupuestos.insertar({
    usuarioId: sesion.id,
    referencias,
    mensaje,
    estado: "solicitado",
    itemsPropuestos: [],
    fecha: new Date().toISOString(),
  });

  await guardarLead("oferta", { email: sesion.email, empresa: sesion.empresa, referencias, mensaje });

  revalidatePath("/cuenta/presupuestos");
  return { ok: true, mensaje: "Presupuesto solicitado. Te respondemos en menos de 24 h laborables." };
}
