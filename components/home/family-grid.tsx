import Link from "next/link";
import { getFamilias } from "@/lib/data/productos";
import { getFamiliaInfo } from "@/lib/data/familias";

export async function FamilyGrid() {
  const familias = await getFamilias();

  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
      <h2 className="mb-6 text-2xl font-heading font-semibold text-trade-gray-900">
        Comprar por familia
      </h2>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {familias.map(({ familia, total }) => {
          const info = getFamiliaInfo(familia);
          return (
            <Link
              key={familia}
              href={`/productos/${familia}`}
              className="group rounded-lg border border-trade-gray-200 bg-trade-gray-050 p-5 transition-colors hover:border-trade-red"
            >
              <h3 className="font-heading text-lg font-semibold text-trade-gray-900 group-hover:text-trade-red">
                {info.nombre}
              </h3>
              <p className="mt-1 font-mono text-sm text-trade-gray-500">
                {total} referencia{total === 1 ? "" : "s"}
              </p>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
