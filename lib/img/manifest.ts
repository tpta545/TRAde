import "server-only";
import generado from "../../scripts/images/manifest.generated.json";

/**
 * Acceso tipado al manifiesto de imágenes optimizadas (Fase V). Es la única
 * puerta de entrada: los componentes de página no deben leer
 * scripts/images/manifest.generated.json directamente.
 */

export type ImagenGeneradaInfo = {
  id: string;
  alt: string;
  aspect: string;
  blurDataURL: string;
  widths: number[];
  avif: Record<string, string>;
  webp: Record<string, string>;
};

const MANIFEST = generado as unknown as Record<string, ImagenGeneradaInfo>;

export function getImagenInfo(id: string): ImagenGeneradaInfo | undefined {
  return MANIFEST[id];
}
