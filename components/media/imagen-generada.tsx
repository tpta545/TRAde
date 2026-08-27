import { getImagenInfo } from "@/lib/img/manifest";
import { ImagenGeneradaClient } from "@/components/media/imagen-generada-client";

/**
 * Envoltorio de next/image sobre las imágenes ya optimizadas por el
 * pipeline de la Fase V (public/img/generated/, AVIF pregenerado en
 * 4 anchos). Usa un loader propio en vez de dejar que next/image
 * reoptimice: ya lo hicimos nosotros con sharp.
 *
 * Requiere que el contenedor tenga `position: relative` y reserve el
 * espacio (aspect-ratio o alto fijo) — se usa siempre con `fill` para no
 * acoplar el componente a un ancho/alto concreto por caso de uso.
 *
 * Este componente lee el manifiesto en servidor (server-only) y pasa solo
 * datos serializables al cliente: el loader de next/image es una función,
 * y las funciones no pueden cruzar el límite Server → Client Component
 * como prop, así que el <Image> real vive en ImagenGeneradaClient.
 *
 * <<PENDIENTE>>: solo sirve AVIF (no hay fallback automático a WebP dentro
 * de next/image con un loader propio — su srcSet es de un único formato).
 * El WebP pregenerado queda en disco para cuando haga falta un <picture>
 * manual; con soporte de AVIF prácticamente universal en navegadores
 * evergreen, no se ha priorizado montar ese fallback en esta fase.
 */
export function ImagenGenerada({
  id,
  sizes,
  priority = false,
  className,
  alt,
}: {
  id: string;
  sizes: string;
  priority?: boolean;
  className?: string;
  /** Si no se pasa, usa el alt escrito a mano en el manifiesto. */
  alt?: string;
}) {
  const info = getImagenInfo(id);
  if (!info) return null;

  return (
    <ImagenGeneradaClient info={info} sizes={sizes} priority={priority} className={className} alt={alt} />
  );
}
