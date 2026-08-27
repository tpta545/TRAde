import Link from "next/link";
import { getFamilias } from "@/lib/data/productos";
import { getFamiliaInfo } from "@/lib/data/familias";
import { ImagenGenerada } from "@/components/media/imagen-generada";
import { FAMILIA_A_IMAGEN } from "@/lib/img/mapeos";

export async function FamilyGrid() {
  const familias = await getFamilias();

  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 md:py-24">
      <h2 className="mb-6 text-2xl font-heading font-semibold text-trade-gray-900">
        Comprar por familia
      </h2>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
        {familias.map(({ familia, total }) => {
          const info = getFamiliaInfo(familia);
          const imagenId = FAMILIA_A_IMAGEN[familia];
          return (
            <Link
              key={familia}
              href={`/productos/${familia}`}
              className="group overflow-hidden rounded-sm border border-trade-gray-200 transition-colors hover:border-trade-red"
            >
              <div className="relative aspect-[4/3] bg-trade-gray-050">
                {imagenId && (
                  <ImagenGenerada
                    id={imagenId}
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
                    className="object-cover transition-transform duration-150 group-hover:scale-[1.03]"
                  />
                )}
              </div>
              <div className="p-4">
                <h3 className="font-heading text-base font-semibold text-trade-gray-900 group-hover:text-trade-red">
                  {info.nombre}
                </h3>
                <p className="mt-1 font-mono text-xs text-trade-gray-500">
                  {total} referencia{total === 1 ? "" : "s"}
                </p>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
