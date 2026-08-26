import type { Metadata } from "next";
import Link from "next/link";
import { getMarcas } from "@/lib/data/productos";
import { getMarcaInfo } from "@/lib/data/marcas";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Marcas",
  description: "Distribuidor oficial de ABB, Festo, NTN, WEG e ISB.",
  alternates: { canonical: "/marcas" },
};

export default async function MarcasPage() {
  const marcas = await getMarcas();

  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-10 sm:px-6">
      <Breadcrumbs items={[{ nombre: "Marcas", url: "/marcas" }]} />
      <h1 className="mt-2 text-3xl font-heading font-semibold text-trade-gray-900">Marcas</h1>

      <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
        {marcas.map(({ marca, total }) => {
          const info = getMarcaInfo(marca);
          return (
            <Link
              key={marca}
              href={`/marcas/${info.slug}`}
              className="rounded-lg border border-trade-gray-200 p-5 hover:border-trade-red"
            >
              <h2 className="font-heading text-xl font-semibold text-trade-gray-900">{info.nombre}</h2>
              <p className="mt-1 text-sm text-trade-gray-500">{info.gama}</p>
              <p className="mt-2 font-mono text-xs text-trade-gray-500">{total} referencias</p>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
