"use server";

import { redirect } from "next/navigation";
import { z } from "zod";
import { coleccionUsuarios, buscarUsuarioPorEmail, asegurarUsuariosDemo } from "@/lib/auth/usuarios-repo";
import { hashPassword, verificarPassword } from "@/lib/auth/passwords";
import { crearSesion, cerrarSesion as borrarCookieSesion } from "@/lib/auth/session";
import { esNifOCifValido } from "@/lib/utils/nif";
import { guardarLead } from "@/lib/leads/store";
import type { EstadoFormulario } from "@/lib/leads/actions";

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export async function iniciarSesionAction(
  _estadoPrevio: EstadoFormulario,
  formData: FormData,
): Promise<EstadoFormulario> {
  await asegurarUsuariosDemo();

  const resultado = loginSchema.safeParse(Object.fromEntries(formData));
  if (!resultado.success) {
    return { ok: false, mensaje: "Introduce un email y una contraseña válidos." };
  }

  const usuario = await buscarUsuarioPorEmail(resultado.data.email);
  if (!usuario || !(await verificarPassword(resultado.data.password, usuario.passwordHash))) {
    return { ok: false, mensaje: "Email o contraseña incorrectos." };
  }
  if (usuario.estado === "pendiente_aprobacion") {
    return { ok: false, mensaje: "Tu cuenta todavía está pendiente de aprobación por nuestro equipo." };
  }
  if (usuario.estado === "rechazada") {
    return { ok: false, mensaje: "Esta cuenta no está activa. Contacta con nosotros." };
  }

  await crearSesion({
    id: usuario.id,
    email: usuario.email,
    nombre: usuario.nombre,
    empresa: usuario.empresa,
    rol: usuario.rol,
    descuentoPorcentaje: usuario.descuentoPorcentaje,
    estado: usuario.estado,
  });

  redirect("/cuenta");
}

const registroSchema = z.object({
  nombre: z.string().min(2),
  empresa: z.string().min(2),
  cif: z.string().refine(esNifOCifValido, "El CIF/NIF no es válido"),
  telefono: z.string().min(6),
  email: z.string().email(),
  password: z.string().min(8, "La contraseña debe tener al menos 8 caracteres"),
});

export async function registrarCuentaAction(
  _estadoPrevio: EstadoFormulario,
  formData: FormData,
): Promise<EstadoFormulario> {
  const resultado = registroSchema.safeParse(Object.fromEntries(formData));
  if (!resultado.success) {
    return {
      ok: false,
      mensaje: resultado.error.issues[0]?.message ?? "Revisa los datos del formulario.",
    };
  }

  const yaExiste = await buscarUsuarioPorEmail(resultado.data.email);
  if (yaExiste) {
    return { ok: false, mensaje: "Ya hay una cuenta registrada con ese email." };
  }

  const passwordHash = await hashPassword(resultado.data.password);
  await coleccionUsuarios.insertar({
    email: resultado.data.email,
    passwordHash,
    nombre: resultado.data.nombre,
    empresa: resultado.data.empresa,
    cif: resultado.data.cif,
    telefono: resultado.data.telefono,
    rol: "comprador",
    estado: "pendiente_aprobacion",
    descuentoPorcentaje: 0,
    limiteImporteSinAprobacion: 0,
    fechaAlta: new Date().toISOString(),
  });

  await guardarLead("aprobacion_cuenta_b2b", {
    email: resultado.data.email,
    empresa: resultado.data.empresa,
    cif: resultado.data.cif,
  });

  return {
    ok: true,
    mensaje:
      "Solicitud recibida. Revisamos los datos y activamos tu cuenta B2B en menos de 24 h laborables.",
  };
}

export async function cerrarSesionAction(): Promise<void> {
  await borrarCookieSesion();
  redirect("/");
}
