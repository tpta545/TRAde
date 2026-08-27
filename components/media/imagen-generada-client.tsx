"use client";

import Image from "next/image";
import type { ImagenGeneradaInfo } from "@/lib/img/manifest";

/**
 * Renderiza la imagen a partir de datos ya resueltos en servidor (ImagenGenerada).
 * Vive en cliente porque el loader propio de next/image es una función y las
 * funciones no cruzan el límite Server → Client Component como prop.
 */
export function ImagenGeneradaClient({
  info,
  sizes,
  priority = false,
  className,
  alt,
}: {
  info: ImagenGeneradaInfo;
  sizes: string;
  priority?: boolean;
  className?: string;
  alt?: string;
}) {
  const anchosDisponibles = info.widths.slice().sort((a, b) => a - b);
  const anchoMayor = anchosDisponibles[anchosDisponibles.length - 1];

  const loader = ({ width }: { width: number }) => {
    const elegido = anchosDisponibles.find((w) => w >= width) ?? anchoMayor;
    return info.avif[String(elegido)] ?? info.avif[String(anchoMayor)];
  };

  return (
    <Image
      loader={loader}
      src={info.avif[String(anchoMayor)]}
      alt={alt ?? info.alt}
      fill
      sizes={sizes}
      placeholder="blur"
      blurDataURL={info.blurDataURL}
      priority={priority}
      fetchPriority={priority ? "high" : undefined}
      className={className}
    />
  );
}
