import "server-only";
import { crearColeccion } from "@/lib/db/json-store";
import { hashPassword } from "@/lib/auth/passwords";
import type { Usuario } from "@/lib/auth/usuario";

export const coleccionUsuarios = crearColeccion<Usuario>("usuarios");

/**
 * Dos cuentas DEMO (misma empresa ficticia, un comprador y un aprobador)
 * para poder probar el flujo multiusuario sin datos reales de cliente.
 * Se crean solo si el almacén está vacío. Contraseña de ambas: "demo1234".
 */
export async function asegurarUsuariosDemo(): Promise<void> {
  const existentes = await coleccionUsuarios.todos();
  if (existentes.length > 0) return;

  const passwordHash = await hashPassword("demo1234");
  const ahora = new Date().toISOString();

  await coleccionUsuarios.insertar({
    email: "compras@clientedemo.es",
    passwordHash,
    nombre: "Compras Demo",
    empresa: "Cliente Demo S.L.",
    cif: "B00000000",
    telefono: "600000000",
    rol: "comprador",
    estado: "activa",
    descuentoPorcentaje: 15,
    limiteImporteSinAprobacion: 500,
    fechaAlta: ahora,
  });

  await coleccionUsuarios.insertar({
    email: "aprobador@clientedemo.es",
    passwordHash,
    nombre: "Aprobador Demo",
    empresa: "Cliente Demo S.L.",
    cif: "B00000000",
    telefono: "600000001",
    rol: "aprobador",
    estado: "activa",
    descuentoPorcentaje: 15,
    limiteImporteSinAprobacion: null,
    fechaAlta: ahora,
  });
}

export async function buscarUsuarioPorEmail(email: string): Promise<Usuario | undefined> {
  return coleccionUsuarios.buscarUno((u) => u.email.toLowerCase() === email.toLowerCase());
}
