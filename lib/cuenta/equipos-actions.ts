"use server";

import { revalidatePath } from "next/cache";
import { crearColeccion } from "@/lib/db/json-store";
import { obtenerSesion } from "@/lib/auth/session";
import type { Equipo } from "@/lib/cuenta/equipos";
import type { EstadoFormulario } from "@/lib/leads/actions";

const coleccionEquipos = crearColeccion<Equipo>("equipos");

export async function getEquiposDeUsuario(usuarioId: string): Promise<Equipo[]> {
  return coleccionEquipos.buscar((e) => e.usuarioId === usuarioId);
}

export async function crearEquipoAction(
  _estadoPrevio: EstadoFormulario,
  formData: FormData,
): Promise<EstadoFormulario> {
  const sesion = await obtenerSesion();
  if (!sesion) return { ok: false, mensaje: "Tienes que iniciar sesión." };

  const nombre = String(formData.get("nombre") ?? "").trim();
  if (!nombre) return { ok: false, mensaje: "Ponle un nombre al equipo." };

  await coleccionEquipos.insertar({
    usuarioId: sesion.id,
    nombre,
    marca: String(formData.get("marca") ?? "").trim() || undefined,
    modelo: String(formData.get("modelo") ?? "").trim() || undefined,
    ubicacion: String(formData.get("ubicacion") ?? "").trim() || undefined,
    fechaAlta: new Date().toISOString(),
  });

  revalidatePath("/cuenta/equipos");
  return { ok: true, mensaje: "Equipo registrado." };
}

export async function eliminarEquipoAction(equipoId: string): Promise<void> {
  const sesion = await obtenerSesion();
  const equipo = await coleccionEquipos.porId(equipoId);
  if (!sesion || !equipo || equipo.usuarioId !== sesion.id) throw new Error("No autorizado");
  await coleccionEquipos.eliminar(equipoId);
  revalidatePath("/cuenta/equipos");
}
