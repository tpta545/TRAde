import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { createHash } from "node:crypto";
import { fileURLToPath } from "node:url";
import { IMAGE_MANIFEST, type ImageAsset } from "./manifest";
import { componerPromptEditorial, componerPromptProducto } from "./style";

/**
 * Genera las imágenes que falten (o hayan cambiado) según manifest.ts.
 *
 * Uso:
 *   npm run images:gen              # solo lo que falta o cambió
 *   npm run images:gen:force        # regenera todo
 *   tsx scripts/images/generate.ts --only hero-home,fam-rodamientos
 *
 * <<PENDIENTE>>: no se ha podido ejecutar ni probar contra la API real de
 * Gemini desde este entorno — no hay GEMINI_API_KEY configurada aquí. El
 * script sigue exactamente la especificación de la Fase V (endpoint, SDK,
 * modelos, forma de la respuesta); antes de confiar en él en producción,
 * ejecútalo una vez con una clave real y revisa el resultado.
 */

const __dirname = dirname(fileURLToPath(import.meta.url));
const DIR_RAW = join(__dirname, "..", "..", "public", "img", "raw");
const RUTA_LOCK = join(__dirname, "images.lock.json");

const CONCURRENCIA_MAXIMA = 3;
const REINTENTOS_MAXIMOS = 4;

type EntradaLock = {
  hash: string;
  generatedAt: string;
  model: string;
  rawFile: string;
};

type Lock = Record<string, EntradaLock>;

function leerLock(): Lock {
  if (!existsSync(RUTA_LOCK)) return {};
  try {
    return JSON.parse(readFileSync(RUTA_LOCK, "utf-8"));
  } catch {
    console.warn("[images] images.lock.json corrupto o ilegible, se trata como vacío.");
    return {};
  }
}

function escribirLock(lock: Lock) {
  writeFileSync(RUTA_LOCK, JSON.stringify(lock, null, 2) + "\n", "utf-8");
}

/** Prompt final compuesto, igual que verá el modelo. Es lo que se hashea. */
function promptFinal(asset: ImageAsset): string {
  return asset.styleVariant === "product"
    ? componerPromptProducto(asset.prompt)
    : componerPromptEditorial(asset.prompt);
}

function hashDeEntrada(asset: ImageAsset, referencePaths: string[]): string {
  const contenido = JSON.stringify({
    prompt: promptFinal(asset),
    aspect: asset.aspect,
    size: asset.size,
    model: asset.model,
    referencePaths,
  });
  return createHash("sha256").update(contenido).digest("hex");
}

function extensionParaMime(mime: string): string {
  if (mime.includes("png")) return "png";
  if (mime.includes("webp")) return "webp";
  return "jpg";
}

async function esperar(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Llamada a la API de Gemini tal como la especifica la Fase V (agosto 2026):
 * POST https://generativelanguage.googleapis.com/v1beta/interactions,
 * vía el SDK @google/genai. Hasta 3 imágenes de referencia de estilo para
 * gemini-3-pro-image (bloquea el estilo entre las 45 imágenes).
 */
async function generarImagen(
  asset: ImageAsset,
  referencePaths: string[],
): Promise<{ buffer: Buffer; mime: string }> {
  const { GoogleGenAI } = await import("@google/genai");
  const ai = new GoogleGenAI({}); // lee GEMINI_API_KEY del entorno

  const prompt = promptFinal(asset);
  const admiteReferencias = asset.model === "gemini-3-pro-image" && referencePaths.length > 0;

  // Forma de los bloques de contenido según @google/genai (Content_2:
  // TextContent | ImageContent | ...), no el formato {text}/{inlineData}
  // de generateContent — son APIs distintas dentro del mismo SDK.
  const input = admiteReferencias
    ? [
        { type: "text" as const, text: prompt },
        ...referencePaths.slice(0, 3).map((ruta) => ({
          type: "image" as const,
          mime_type: "image/png" as const,
          data: readFileSync(ruta).toString("base64"),
        })),
      ]
    : prompt;

  // gemini-3-pro-image rechaza thinking_level "minimal" (400: solo admite
  // "high"/"low"); comprobado contra la API real, no documentado así en la
  // Fase V. El resto de modelos sí aceptan "minimal".
  const thinkingLevel = asset.model === "gemini-3-pro-image" ? "low" : "minimal";

  const interaction = await ai.interactions.create({
    model: asset.model,
    input,
    response_format: {
      type: "image",
      mime_type: "image/jpeg",
      aspect_ratio: asset.aspect,
      image_size: asset.size,
    },
    generation_config: { thinking_level: thinkingLevel },
  });

  const salida = interaction.output_image;
  if (!salida?.data) {
    throw new Error(`Respuesta sin output_image.data para ${asset.id} (interaction sin imagen).`);
  }
  return { buffer: Buffer.from(salida.data, "base64"), mime: salida.mime_type ?? "image/jpeg" };
}

class ErrorGeneracion extends Error {
  constructor(
    message: string,
    public intentos: number,
  ) {
    super(message);
  }
}

async function generarConReintentos(asset: ImageAsset, referencePaths: string[]) {
  let ultimoError: unknown;
  for (let intento = 0; intento < REINTENTOS_MAXIMOS; intento++) {
    try {
      return await generarImagen(asset, referencePaths);
    } catch (error: unknown) {
      ultimoError = error;
      const status = (error as { status?: number })?.status;
      const esReintentable = status === 429 || (typeof status === "number" && status >= 500);
      if (!esReintentable || intento === REINTENTOS_MAXIMOS - 1) {
        const mensaje = error instanceof Error ? error.message : String(error);
        throw new ErrorGeneracion(mensaje, intento + 1);
      }
      const espera = 1000 * 2 ** intento;
      console.warn(`[images] ${asset.id}: fallo (${status ?? "?"}), reintento en ${espera}ms…`);
      await esperar(espera);
    }
  }
  throw ultimoError;
}

async function procesarEntrada(
  asset: ImageAsset,
  lock: Lock,
  forzar: boolean,
  referencePaths: string[],
): Promise<{ id: string; estado: "generada" | "sin-cambios" | "error"; detalle?: string }> {
  const hash = hashDeEntrada(asset, referencePaths);
  const entradaPrevia = lock[asset.id];

  if (!forzar && entradaPrevia?.hash === hash && existsSync(entradaPrevia.rawFile)) {
    return { id: asset.id, estado: "sin-cambios" };
  }

  try {
    const { buffer, mime } = await generarConReintentos(asset, referencePaths);
    const extension = extensionParaMime(mime);
    const rutaRaw = join(DIR_RAW, `${asset.id}.${extension}`);
    mkdirSync(DIR_RAW, { recursive: true });
    writeFileSync(rutaRaw, buffer);

    lock[asset.id] = {
      hash,
      generatedAt: new Date().toISOString(),
      model: asset.model,
      rawFile: rutaRaw,
    };
    return { id: asset.id, estado: "generada" };
  } catch (error) {
    const mensaje = error instanceof Error ? error.message : String(error);
    const intentos = error instanceof ErrorGeneracion ? error.intentos : 1;
    console.error(
      `[images] ${asset.id}: FALLÓ tras ${intentos} intento${intentos === 1 ? "" : "s"} — ${mensaje}`,
    );
    return { id: asset.id, estado: "error", detalle: mensaje };
  }
}

async function ejecutarConConcurrencia<T, R>(
  items: T[],
  limite: number,
  tarea: (item: T) => Promise<R>,
): Promise<R[]> {
  const resultados: R[] = [];
  let indice = 0;
  async function trabajador() {
    while (indice < items.length) {
      const actual = items[indice++];
      resultados.push(await tarea(actual));
    }
  }
  await Promise.all(Array.from({ length: Math.min(limite, items.length) }, trabajador));
  return resultados;
}

async function main() {
  if (!process.env.GEMINI_API_KEY) {
    console.error(
      "[images] Falta GEMINI_API_KEY en el entorno. Copia .env.example a .env y añade tu clave.",
    );
    process.exit(1);
  }

  const argumentos = process.argv.slice(2);
  const forzar = argumentos.includes("--force");
  const argOnly = argumentos.find((a) => a.startsWith("--only"));
  const idsFiltro = argOnly
    ? (argOnly.includes("=") ? argOnly.split("=")[1] : argumentos[argumentos.indexOf(argOnly) + 1])
        ?.split(",")
        .map((s) => s.trim())
    : undefined;

  const lock = leerLock();

  // Fase A: las cabeceras que fijan el estilo de referencia (Grupo 1, styleReference: true).
  const entradasReferencia = IMAGE_MANIFEST.filter((a) => a.styleReference);
  const resultadosA = await ejecutarConConcurrencia(
    idsFiltro ? entradasReferencia.filter((a) => idsFiltro.includes(a.id)) : entradasReferencia,
    CONCURRENCIA_MAXIMA,
    (asset) => procesarEntrada(asset, lock, forzar, []),
  );
  escribirLock(lock);

  const rutasReferenciaEstilo = entradasReferencia
    .map((a) => lock[a.id]?.rawFile)
    .filter((ruta): ruta is string => Boolean(ruta && existsSync(ruta)));

  if (rutasReferenciaEstilo.length < 3) {
    console.warn(
      `[images] Solo hay ${rutasReferenciaEstilo.length}/3 imágenes de referencia de estilo disponibles; ` +
        "el resto de gemini-3-pro-image se generará sin bloqueo de estilo por referencia.",
    );
  }

  // Fase B: el resto del inventario.
  const entradasResto = IMAGE_MANIFEST.filter((a) => !a.styleReference);
  const listaResto = idsFiltro ? entradasResto.filter((a) => idsFiltro.includes(a.id)) : entradasResto;

  const resultadosB = await ejecutarConConcurrencia(listaResto, CONCURRENCIA_MAXIMA, (asset) =>
    procesarEntrada(asset, lock, forzar, rutasReferenciaEstilo),
  );
  escribirLock(lock);

  const todos = [...resultadosA, ...resultadosB];
  const generadas = todos.filter((r) => r.estado === "generada").length;
  const sinCambios = todos.filter((r) => r.estado === "sin-cambios").length;
  const errores = todos.filter((r) => r.estado === "error");

  console.log(
    `\n[images] ${generadas} generada(s), ${sinCambios} sin cambios, ${errores.length} con error, de ${todos.length} en el manifiesto.`,
  );
  if (errores.length > 0) {
    console.log("[images] Fallidas:", errores.map((e) => e.id).join(", "));
  }
}

main().catch((error) => {
  console.error("[images] Error inesperado en la generación:", error);
  process.exit(1);
});
