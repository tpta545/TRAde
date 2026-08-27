import type { ReactNode } from "react";
import { ImagenGenerada } from "@/components/media/imagen-generada";

/**
 * Hero 16:9 con degradado, compartido por las plantillas de /servicios/* y
 * /soluciones/[sector] (Parte V.3: "hero 16:9 con overlay").
 */
export function HeroServicio({
  imagenId,
  titulo,
  subtitulo,
  cta,
}: {
  imagenId: string;
  titulo: string;
  subtitulo: string;
  cta?: ReactNode;
}) {
  return (
    <div className="relative aspect-[16/9] max-h-[420px] w-full overflow-hidden bg-trade-ink sm:aspect-[16/7]">
      <ImagenGenerada id={imagenId} sizes="100vw" priority className="object-cover" alt="" />
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(90deg, rgba(17,18,20,.92) 0%, rgba(17,18,20,.55) 55%, rgba(17,18,20,.25) 100%)",
        }}
      />
      <div className="relative flex h-full items-end">
        <div className="mx-auto w-full max-w-5xl px-4 pb-8 sm:px-6 sm:pb-12">
          <h1 className="max-w-2xl text-3xl font-heading font-semibold text-trade-white sm:text-4xl">
            {titulo}
          </h1>
          <p className="mt-3 max-w-xl text-white/75">{subtitulo}</p>
          {cta && <div className="mt-6">{cta}</div>}
        </div>
      </div>
    </div>
  );
}
