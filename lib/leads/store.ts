import "server-only";
import { appendFile, mkdir } from "node:fs/promises";
import { join } from "node:path";

/**
 * Almacén de leads (formularios de contacto/reparación/oferta y log de
 * búsquedas sin resultado). Hoy escribe a un fichero JSONL local en
 * `.data/`, pensado para desarrollo y demo.
 *
 * <<PENDIENTE>>: en producción esto necesita (a) un email real de aviso al
 * equipo comercial (p. ej. vía Resend/SendGrid, con RESEND_API_KEY en
 * variables de entorno) y (b) persistencia que sobreviva a un despliegue
 * serverless sin disco persistente (una tabla en la base de datos o un CRM).
 * Ver PENDIENTES.md. La interfaz de esta función (guardarLead) no cambia
 * cuando se conecte esa integración real: solo su implementación.
 */

const DIRECTORIO_LEADS = join(process.cwd(), ".data");

export type TipoLead =
  | "reparacion"
  | "asesoramiento"
  | "mantenimiento"
  | "oferta"
  | "contacto"
  | "busqueda_sin_resultados"
  | "aprobacion_cuenta_b2b"
  | "newsletter";

export async function guardarLead(tipo: TipoLead, datos: Record<string, unknown>): Promise<void> {
  const entrada = {
    tipo,
    fecha: new Date().toISOString(),
    ...datos,
  };

  console.log(`[lead:${tipo}]`, JSON.stringify(entrada));

  try {
    await mkdir(DIRECTORIO_LEADS, { recursive: true });
    await appendFile(join(DIRECTORIO_LEADS, `${tipo}.jsonl`), JSON.stringify(entrada) + "\n", "utf-8");
  } catch (error) {
    // En un entorno serverless de solo lectura esto puede fallar: no debe
    // romper el envío del formulario, el console.log de arriba ya deja
    // constancia del lead en los logs del servidor.
    console.error(`No se pudo persistir el lead ${tipo} en disco:`, error);
  }
}
