import { readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { parse } from "csv-parse/sync";
import { productoSchema, type Producto } from "../lib/schemas/producto";

/**
 * Importa un CSV de referencias (formato ERP) a data/productos.seed.json,
 * validando cada fila contra el esquema de producto (lib/schemas/producto.ts).
 *
 * Uso: npm run import:productos -- ruta/al/fichero.csv
 *
 * El CSV debe tener como cabecera los mismos nombres de campo que el tipo
 * Producto. Los campos de tipo lista (aplicaciones, atributosDestacados,
 * accesorios, recambios, alternativas) se separan con "|" dentro de la celda.
 * Los campos "imagenes", "documentos", "atributos" y "equivalencias" se
 * esperan como JSON embebido en la celda.
 *
 * No detiene la importación ante una fila inválida: la descarta, informa
 * en consola qué campos faltan o son inválidos para esa referencia, y
 * continúa con el resto. Al final importa solo las filas válidas.
 */

const CAMPOS_LISTA = [
  "aplicaciones",
  "atributosDestacados",
  "accesorios",
  "recambios",
  "alternativas",
] as const;

const CAMPOS_JSON = ["imagenes", "documentos", "atributos", "equivalencias"] as const;

const CAMPOS_NUMERICOS = [
  "precioTarifa",
  "multiploVenta",
  "stock",
  "plazoEntregaDias",
] as const;

function normalizarFila(fila: Record<string, string>): Record<string, unknown> {
  const resultado: Record<string, unknown> = { ...fila };

  for (const campo of CAMPOS_LISTA) {
    const valor = fila[campo];
    resultado[campo] = valor ? valor.split("|").map((v) => v.trim()).filter(Boolean) : [];
  }

  for (const campo of CAMPOS_JSON) {
    const valor = fila[campo];
    if (!valor) {
      resultado[campo] = campo === "atributos" ? {} : [];
      continue;
    }
    try {
      resultado[campo] = JSON.parse(valor);
    } catch {
      resultado[campo] = undefined;
    }
  }

  for (const campo of CAMPOS_NUMERICOS) {
    const valor = fila[campo];
    resultado[campo] = valor === "" || valor === undefined ? undefined : Number(valor);
  }

  return resultado;
}

function main() {
  const rutaCsv = process.argv[2];
  if (!rutaCsv) {
    console.error("Uso: npm run import:productos -- ruta/al/fichero.csv");
    process.exit(1);
  }

  const contenido = readFileSync(resolve(rutaCsv), "utf-8");
  const filas: Record<string, string>[] = parse(contenido, {
    columns: true,
    skip_empty_lines: true,
    trim: true,
  });

  const productosValidos: Producto[] = [];
  const errores: { referencia: string; problemas: string[] }[] = [];

  for (const fila of filas) {
    const candidato = normalizarFila(fila);
    const resultado = productoSchema.safeParse(candidato);

    if (resultado.success) {
      productosValidos.push(resultado.data);
    } else {
      errores.push({
        referencia: fila.referencia || "(sin referencia)",
        problemas: resultado.error.issues.map(
          (issue) => `${issue.path.join(".")}: ${issue.message}`,
        ),
      });
    }
  }

  if (errores.length > 0) {
    console.log(`\n${errores.length} fila(s) descartada(s) por campos faltantes o inválidos:\n`);
    for (const error of errores) {
      console.log(`  · ${error.referencia}`);
      for (const problema of error.problemas) {
        console.log(`      - ${problema}`);
      }
    }
    console.log("");
  }

  const destino = resolve("data/productos.seed.json");
  writeFileSync(destino, JSON.stringify(productosValidos, null, 2) + "\n", "utf-8");

  console.log(
    `Importados ${productosValidos.length} producto(s) válido(s) de ${filas.length} fila(s) a ${destino}`,
  );
}

main();
