"use server";

import { guardarLead } from "@/lib/leads/store";
import {
  busquedaSinResultadosSchema,
  leadOfertaSchema,
  leadReparacionSchema,
  leadServicioSchema,
} from "@/lib/leads/schemas";

export type EstadoFormulario = { ok: boolean; mensaje: string };

function extraerCampos(formData: FormData): Record<string, string> {
  return Object.fromEntries(
    Array.from(formData.entries())
      .filter(([, valor]) => typeof valor === "string")
      .map(([clave, valor]) => [clave, valor as string]),
  );
}

export async function enviarBusquedaSinResultados(
  _estadoPrevio: EstadoFormulario,
  formData: FormData,
): Promise<EstadoFormulario> {
  const resultado = busquedaSinResultadosSchema.safeParse(extraerCampos(formData));
  if (!resultado.success) {
    return { ok: false, mensaje: "Revisa el teléfono: es obligatorio para poder confirmarte." };
  }
  await guardarLead("busqueda_sin_resultados", resultado.data);
  return { ok: true, mensaje: "Recibido. Te confirmamos en menos de 1 hora si la tenemos." };
}

export async function enviarLeadReparacion(
  _estadoPrevio: EstadoFormulario,
  formData: FormData,
): Promise<EstadoFormulario> {
  const campos = extraerCampos(formData);
  const foto = formData.get("foto");
  const nombreFoto = foto instanceof File && foto.size > 0 ? foto.name : undefined;

  const resultado = leadReparacionSchema.safeParse({ ...campos, nombreFoto });
  if (!resultado.success) {
    return {
      ok: false,
      mensaje: "Faltan datos: marca, modelo, qué le pasa y un teléfono de contacto son obligatorios.",
    };
  }
  await guardarLead("reparacion", resultado.data);
  return {
    ok: true,
    mensaje: "Recibido. Te llamamos para confirmar la recogida o el diagnóstico en 48 h.",
  };
}

export async function enviarLeadServicio(
  tipo: "asesoramiento" | "mantenimiento",
  _estadoPrevio: EstadoFormulario,
  formData: FormData,
): Promise<EstadoFormulario> {
  const resultado = leadServicioSchema.safeParse(extraerCampos(formData));
  if (!resultado.success) {
    return { ok: false, mensaje: "Rellena nombre, empresa, teléfono y cuéntanos brevemente qué necesitas." };
  }
  await guardarLead(tipo, resultado.data);
  return { ok: true, mensaje: "Recibido. Te contactamos en menos de 24 h laborables." };
}

export async function enviarLeadOferta(
  _estadoPrevio: EstadoFormulario,
  formData: FormData,
): Promise<EstadoFormulario> {
  const resultado = leadOfertaSchema.safeParse(extraerCampos(formData));
  if (!resultado.success) {
    return { ok: false, mensaje: "Rellena nombre, empresa y teléfono para poder enviarte la oferta." };
  }
  await guardarLead("oferta", resultado.data);
  return { ok: true, mensaje: "Recibido. Te enviamos la oferta en menos de 24 h laborables." };
}
