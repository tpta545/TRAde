import type { LucideIcon } from "lucide-react";

export type PuntoPromesa = { icono: LucideIcon; titulo: string; descripcion: string };

/** 3 puntos de promesa (Parte V.3), en franja blanca bajo el hero. */
export function PuntosPromesa({ puntos }: { puntos: PuntoPromesa[] }) {
  return (
    <div className="mx-auto grid max-w-5xl grid-cols-1 gap-8 px-4 py-12 sm:grid-cols-3 sm:px-6 md:py-16">
      {puntos.map((punto) => (
        <div key={punto.titulo}>
          <punto.icono className="h-6 w-6 text-trade-red" aria-hidden />
          <h2 className="mt-3 font-heading text-base font-semibold text-trade-gray-900">
            {punto.titulo}
          </h2>
          <p className="mt-1 text-sm text-trade-gray-500">{punto.descripcion}</p>
        </div>
      ))}
    </div>
  );
}
