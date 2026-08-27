import { ImagenGenerada } from "@/components/media/imagen-generada";
import { FAMILIA_A_IMAGEN } from "@/lib/img/mapeos";

/**
 * Cabecera compacta de listado (familia/subfamilia): imagen de familia
 * oscurecida de fondo + título. Full-bleed a propósito, así que se monta
 * fuera del contenedor max-w-7xl de la página y define su propio ancho
 * interior.
 */
export function ListadoHeader({
  titulo,
  descripcion,
  familiaSlug,
}: {
  titulo: string;
  descripcion?: string;
  familiaSlug: string;
}) {
  const imagenId = FAMILIA_A_IMAGEN[familiaSlug];

  return (
    <div className="relative flex h-[200px] items-end overflow-hidden bg-trade-ink">
      {imagenId && (
        <div className="absolute inset-0">
          <ImagenGenerada id={imagenId} sizes="100vw" className="object-cover" alt="" />
          <div className="absolute inset-0 bg-trade-ink/75" />
        </div>
      )}
      <div className="relative mx-auto w-full max-w-7xl px-4 pb-6 sm:px-6">
        <h1 className="text-2xl font-heading font-semibold text-trade-white sm:text-3xl">{titulo}</h1>
        {descripcion && (
          <p className="mt-1.5 max-w-2xl text-sm text-white/75 line-clamp-2">{descripcion}</p>
        )}
      </div>
    </div>
  );
}
