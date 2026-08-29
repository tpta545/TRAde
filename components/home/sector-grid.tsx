import Link from "next/link";
import { ImagenGenerada } from "@/components/media/imagen-generada";
import { getSolucion } from "@/lib/data/soluciones";

const SECTORES_HOME = ["citricos", "ceramica", "alimentacion", "agricola"] as const;

export function SectorGrid() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 md:py-24">
      <h2 className="mb-6 text-2xl font-heading font-semibold text-trade-gray-900">
        Soluciones por sector
      </h2>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {SECTORES_HOME.map((slug) => {
          const solucion = getSolucion(slug);
          if (!solucion) return null;
          return (
            <Link
              key={slug}
              href={`/soluciones/${slug}`}
              className="group relative block aspect-[4/3] overflow-hidden rounded-sm transition-all duration-150 hover:-translate-y-1 hover:shadow-lg"
            >
              <ImagenGenerada
                id={`sector-${slug}`}
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                className="object-cover transition-transform duration-150 group-hover:scale-[1.03]"
              />
              <div
                className="absolute inset-0"
                style={{ background: "linear-gradient(0deg, rgba(17,18,20,.75) 0%, rgba(17,18,20,.1) 55%)" }}
              />
              <span className="absolute bottom-4 left-4 right-4 font-heading text-lg font-semibold text-trade-white">
                {solucion.nombre}
              </span>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
