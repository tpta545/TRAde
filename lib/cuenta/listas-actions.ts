"use server";

import { revalidatePath } from "next/cache";
import { crearColeccion } from "@/lib/db/json-store";
import { obtenerSesion } from "@/lib/auth/session";
import { parsearPedidoRapido } from "@/lib/catalog/pedido-rapido";
import type { ListaCompra } from "@/lib/cuenta/listas";
import type { EstadoFormulario } from "@/lib/leads/actions";

const coleccionListas = crearColeccion<ListaCompra>("listas-compra");

export async function getListasDeUsuario(usuarioId: string): Promise<ListaCompra[]> {
  return coleccionListas.buscar((l) => l.usuarioId === usuarioId);
}

export async function crearListaAction(
  _estadoPrevio: EstadoFormulario,
  formData: FormData,
): Promise<EstadoFormulario> {
  const sesion = await obtenerSesion();
  if (!sesion) return { ok: false, mensaje: "Tienes que iniciar sesión." };

  const nombre = String(formData.get("nombre") ?? "").trim();
  const texto = String(formData.get("referencias") ?? "");
  if (!nombre) return { ok: false, mensaje: "Ponle un nombre a la lista." };

  const lineas = await parsearPedidoRapido(texto);
  const items = lineas
    .filter((l) => l.estado === "encontrada")
    .map((l) =>
      l.estado === "encontrada"
        ? {
            productoId: l.producto.id,
            referencia: l.producto.referencia,
            nombre: l.producto.nombre,
            precioTarifa: l.producto.precioTarifa,
            cantidad: l.cantidad,
          }
        : null,
    )
    .filter((item): item is NonNullable<typeof item> => item !== null);

  if (items.length === 0) {
    return { ok: false, mensaje: "No hemos identificado ninguna referencia válida en el texto." };
  }

  await coleccionListas.insertar({
    usuarioId: sesion.id,
    nombre,
    items,
    fechaCreacion: new Date().toISOString(),
  });

  revalidatePath("/cuenta/listas");
  return { ok: true, mensaje: `Lista "${nombre}" creada con ${items.length} referencia(s).` };
}

export async function eliminarListaAction(listaId: string): Promise<void> {
  const sesion = await obtenerSesion();
  const lista = await coleccionListas.porId(listaId);
  if (!sesion || !lista || lista.usuarioId !== sesion.id) throw new Error("No autorizado");
  await coleccionListas.eliminar(listaId);
  revalidatePath("/cuenta/listas");
}
