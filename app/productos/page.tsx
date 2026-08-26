import type { Metadata } from "next";
import Link from "next/link";
import { getFamilias } from "@/lib/data/productos";
import { getFamiliaInfo } from "@/lib/data/familias";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Productos",
  description:
    "Rodamientos, variadores de frecuencia, motores eléctricos, neumática y arrancadores. Stock real en Algemesí y envío a toda España.",
};

export default async function ProductosPage() {
  const familias = await getFamilias();

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6">
      <Breadcrumbs items={[{ nombre: "Productos", url: "/productos" }]} />
      <h1 className="mt-2 text-3xl font-heading font-semibold text-trade-gray-900">Productos</h1>
      <p className="mt-2 max-w-2xl text-sm text-trade-gray-500">
        Distribuidor oficial de ABB, Festo, NTN, WEG e ISB. Elige una familia para ver el
        catálogo completo con precio, stock y ficha técnica.
      </p>

      <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {familias.map(({ familia, total }) => {
          const info = getFamiliaInfo(familia);
          return (
            <Link
              key={familia}
              href={`/productos/${familia}`}
              className="group flex flex-col justify-between rounded-lg border border-trade-gray-200 bg-trade-white p-5 transition-shadow hover:shadow-md"
            >
              <div>
                <h2 className="text-lg font-heading font-semibold text-trade-gray-900 group-hover:text-trade-red">
                  {info.nombre}
                </h2>
                <p className="mt-1 text-sm text-trade-gray-500">{info.introCorta}</p>
              </div>
              <p className="mt-4 font-mono text-xs text-trade-gray-500">
                {total} referencia{total === 1 ? "" : "s"} disponible{total === 1 ? "" : "s"}
              </p>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
