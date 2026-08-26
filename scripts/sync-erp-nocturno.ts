import { writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { parse } from "csv-parse/sync";
import { productoSchema, type Producto } from "../lib/schemas/producto";

/**
 * Sincronización nocturna de referencias, tarifas y stock desde el ERP
 * (Parte B.6 y Fase 5 del prompt maestro: "sin ERP conectado, esto es una
 * lista de la compra"). Pensado para ejecutarse por cron cada noche.
 *
 * <<PENDIENTE>>: no hay todavía un endpoint ni un export real del ERP de
 * TRADE al que conectarse — ver PENDIENTES.md ("ERP utilizado"). Este
 * script define el CONTRATO (de dónde lee, qué valida, dónde escribe) para
 * que conectarlo el día que exista un export real del ERP sea cambiar
 * `ERP_SYNC_SOURCE_URL`/`ERP_SYNC_SOURCE_PATH`, no reescribir la lógica.
 *
 * Fuente de datos, en este orden de prioridad:
 *   1. ERP_SYNC_SOURCE_URL   — URL que devuelve el CSV (API/export del ERP)
 *   2. ERP_SYNC_SOURCE_PATH  — ruta local a un CSV (para pruebas o un export manual por SFTP)
 * Formato del CSV: el mismo que scripts/import-productos.ts.
 *
 * Uso: npm run sync:erp
 * Cron sugerido (todas las noches a las 03:00): 0 3 * * * npm run sync:erp
 */

async function obtenerCsv(): Promise<string> {
  const urlOrigen = process.env.ERP_SYNC_SOURCE_URL;
  const rutaOrigen = process.env.ERP_SYNC_SOURCE_PATH;

  if (urlOrigen) {
    const respuesta = await fetch(urlOrigen);
    if (!respuesta.ok) {
      throw new Error(`No se pudo descargar el CSV del ERP: HTTP ${respuesta.status}`);
    }
    return respuesta.text();
  }

  if (rutaOrigen) {
    const { readFileSync } = await import("node:fs");
    return readFileSync(resolve(rutaOrigen), "utf-8");
  }

  throw new Error(
    "Configura ERP_SYNC_SOURCE_URL o ERP_SYNC_SOURCE_PATH con el origen del export del ERP. " +
      "Sin ninguna de las dos, no hay de dónde sincronizar (ver PENDIENTES.md).",
  );
}

async function main() {
  console.log(`[sync-erp] Iniciando sincronización nocturna — ${new Date().toISOString()}`);

  const csv = await obtenerCsv();
  const filas: Record<string, string>[] = parse(csv, {
    columns: true,
    skip_empty_lines: true,
    trim: true,
  });

  const productosValidos: Producto[] = [];
  const errores: { referencia: string; problemas: string[] }[] = [];

  for (const fila of filas) {
    const resultado = productoSchema.safeParse(fila);
    if (resultado.success) {
      productosValidos.push(resultado.data);
    } else {
      errores.push({
        referencia: fila.referencia || "(sin referencia)",
        problemas: resultado.error.issues.map((issue) => `${issue.path.join(".")}: ${issue.message}`),
      });
    }
  }

  if (errores.length > 0) {
    console.warn(`[sync-erp] ${errores.length} fila(s) descartada(s):`);
    for (const error of errores) {
      console.warn(`  · ${error.referencia}: ${error.problemas.join("; ")}`);
    }
  }

  if (productosValidos.length === 0) {
    console.error("[sync-erp] 0 productos válidos. No se sobrescribe el catálogo actual.");
    process.exit(1);
  }

  const destino = resolve("data/productos.seed.json");
  writeFileSync(destino, JSON.stringify(productosValidos, null, 2) + "\n", "utf-8");

  console.log(
    `[sync-erp] OK: ${productosValidos.length} producto(s) sincronizado(s) a ${destino} (${errores.length} descartado(s)).`,
  );
}

main().catch((error) => {
  console.error("[sync-erp] Sincronización fallida:", error);
  process.exit(1);
});
