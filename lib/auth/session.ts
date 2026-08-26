import "server-only";
import { cookies } from "next/headers";
import { createHmac, timingSafeEqual } from "node:crypto";
import type { UsuarioSesion } from "@/lib/auth/usuario";

const NOMBRE_COOKIE = "trade_sesion";
const UN_DIA_EN_SEGUNDOS = 60 * 60 * 24 * 30;

function obtenerSecreto(): string {
  const secreto = process.env.SESSION_SECRET;
  if (!secreto) {
    // <<PENDIENTE>>: define SESSION_SECRET en el entorno de producción.
    // Este valor por defecto solo es válido para desarrollo local.
    console.warn(
      "SESSION_SECRET no está configurado; usando un secreto de desarrollo. No usar así en producción.",
    );
    return "trade-dev-secret-cambiar-en-produccion";
  }
  return secreto;
}

function firmar(payload: string): string {
  return createHmac("sha256", obtenerSecreto()).update(payload).digest("hex");
}

export async function crearSesion(usuario: UsuarioSesion): Promise<void> {
  const payload = Buffer.from(JSON.stringify(usuario)).toString("base64url");
  const firma = firmar(payload);
  const cookieStore = await cookies();
  cookieStore.set(NOMBRE_COOKIE, `${payload}.${firma}`, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: UN_DIA_EN_SEGUNDOS,
  });
}

export async function cerrarSesion(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(NOMBRE_COOKIE);
}

export async function obtenerSesion(): Promise<UsuarioSesion | null> {
  const cookieStore = await cookies();
  const valor = cookieStore.get(NOMBRE_COOKIE)?.value;
  if (!valor) return null;

  const [payload, firma] = valor.split(".");
  if (!payload || !firma) return null;

  const firmaEsperada = firmar(payload);
  const bufA = Buffer.from(firma);
  const bufB = Buffer.from(firmaEsperada);
  if (bufA.length !== bufB.length || !timingSafeEqual(bufA, bufB)) return null;

  try {
    return JSON.parse(Buffer.from(payload, "base64url").toString("utf-8")) as UsuarioSesion;
  } catch {
    return null;
  }
}
