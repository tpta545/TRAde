import { existsSync, mkdirSync, readdirSync, writeFileSync } from "node:fs";
import { join, dirname, basename, extname } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";
import { IMAGE_MANIFEST } from "./manifest";

/**
 * Optimiza cada imagen de public/img/raw/ a AVIF + WebP en los anchos
 * [480, 768, 1280, 1920], y genera un blurDataURL de 16px. Escribe el
 * resultado en scripts/images/manifest.generated.json, que es lo que lee
 * `<ImagenGenerada>` en la app (ver lib/img/).
 *
 * Uso: npm run images:optimize
 */

const __dirname = dirname(fileURLToPath(import.meta.url));
const DIR_RAW = join(__dirname, "..", "..", "public", "img", "raw");
const DIR_GENERATED = join(__dirname, "..", "..", "public", "img", "generated");
const RUTA_MANIFEST_GENERADO = join(__dirname, "manifest.generated.json");

const ANCHOS = [480, 768, 1280, 1920] as const;
const CALIDAD_AVIF = 55;
const CALIDAD_WEBP = 72;

type ImagenGenerada = {
  id: string;
  alt: string;
  aspect: string;
  blurDataURL: string;
  widths: number[];
  /** {ancho}: "/img/generated/<id>-{ancho}.avif" (y .webp) */
  avif: Record<number, string>;
  webp: Record<number, string>;
};

function encontrarRaw(id: string): string | null {
  if (!existsSync(DIR_RAW)) return null;
  const candidato = readdirSync(DIR_RAW).find((f) => basename(f, extname(f)) === id);
  return candidato ? join(DIR_RAW, candidato) : null;
}

async function optimizarUna(id: string): Promise<ImagenGenerada | null> {
  const rutaRaw = encontrarRaw(id);
  if (!rutaRaw) {
    console.warn(`[optimize] ${id}: no hay fuente en public/img/raw/, se omite (¿falta generarla?).`);
    return null;
  }

  const asset = IMAGE_MANIFEST.find((a) => a.id === id)!;
  const imagenBase = sharp(rutaRaw);
  const metadatos = await imagenBase.metadata();
  const anchoOriginal = metadatos.width ?? 1920;

  const avif: Record<number, string> = {};
  const webp: Record<number, string> = {};

  for (const ancho of ANCHOS) {
    if (ancho > anchoOriginal) continue; // no ampliar por encima del original

    const avifBuffer = await sharp(rutaRaw).resize(ancho).avif({ quality: CALIDAD_AVIF }).toBuffer();
    const rutaAvif = join(DIR_GENERATED, `${id}-${ancho}.avif`);
    writeFileSync(rutaAvif, avifBuffer);
    avif[ancho] = `/img/generated/${id}-${ancho}.avif`;

    const webpBuffer = await sharp(rutaRaw).resize(ancho).webp({ quality: CALIDAD_WEBP }).toBuffer();
    const rutaWebp = join(DIR_GENERATED, `${id}-${ancho}.webp`);
    writeFileSync(rutaWebp, webpBuffer);
    webp[ancho] = `/img/generated/${id}-${ancho}.webp`;
  }

  const bufferBlur = await sharp(rutaRaw).resize(16).jpeg({ quality: 40 }).toBuffer();
  const blurDataURL = `data:image/jpeg;base64,${bufferBlur.toString("base64")}`;

  return {
    id,
    alt: asset.alt,
    aspect: asset.aspect,
    blurDataURL,
    widths: Object.keys(avif).map(Number),
    avif,
    webp,
  };
}

async function main() {
  mkdirSync(DIR_GENERATED, { recursive: true });

  const resultado: Record<string, ImagenGenerada> = {};
  let ok = 0;
  let omitidas = 0;

  for (const asset of IMAGE_MANIFEST) {
    try {
      const generada = await optimizarUna(asset.id);
      if (generada) {
        resultado[asset.id] = generada;
        ok++;
      } else {
        omitidas++;
      }
    } catch (error) {
      console.error(`[optimize] ${asset.id}: error optimizando —`, error);
      omitidas++;
    }
  }

  writeFileSync(RUTA_MANIFEST_GENERADO, JSON.stringify(resultado, null, 2) + "\n", "utf-8");
  console.log(`[optimize] ${ok} imagen(es) optimizada(s), ${omitidas} omitida(s). → ${RUTA_MANIFEST_GENERADO}`);
}

main().catch((error) => {
  console.error("[optimize] Error inesperado:", error);
  process.exit(1);
});
