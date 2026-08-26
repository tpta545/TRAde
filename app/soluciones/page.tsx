import type { Metadata } from "next";
import Link from "next/link";
import { getTodasLasSoluciones } from "@/lib/data/soluciones";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";

export const metadata: Metadata = {
  title: "Soluciones por sector",
  alternates: { canonical: "/soluciones" },
};

export default function SolucionesPage() {
  const soluciones = getTodasLasSoluciones();

  return (
    <div className="mx-auto w-full max-w-4xl px-4 py-10 sm:px-6">
      <Breadcrumbs items={[{ nombre: "Soluciones por sector", url: "/soluciones" }]} />
      <h1 className="mt-2 text-3xl font-heading font-semibold text-trade-gray-900">
        Soluciones por sector
      </h1>

      <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
        {soluciones.map((solucion) => (
          <Link
            key={solucion.slug}
            href={`/soluciones/${solucion.slug}`}
            className="rounded-lg border border-trade-gray-200 p-5 hover:border-trade-red"
          >
            <h2 className="font-heading text-lg font-semibold text-trade-gray-900">{solucion.nombre}</h2>
            <p className="mt-1 text-sm text-trade-gray-500">{solucion.resumen}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
