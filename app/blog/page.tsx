import type { Metadata } from "next";
import Link from "next/link";
import { getTodosLosArticulos } from "@/lib/data/blog";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";

export const metadata: Metadata = {
  title: "Blog técnico",
  description: "Guías técnicas de mantenimiento industrial: motores, rodamientos, variadores y reparación, escritas para el taller, no para el marketing.",
  alternates: { canonical: "/blog" },
};

export default async function BlogPage() {
  const articulos = await getTodosLosArticulos();

  return (
    <div className="mx-auto w-full max-w-4xl px-4 py-10 sm:px-6">
      <Breadcrumbs items={[{ nombre: "Blog", url: "/blog" }]} />
      <h1 className="mt-2 text-3xl font-heading font-semibold text-trade-gray-900">Blog técnico</h1>
      <p className="mt-2 text-sm text-trade-gray-500">
        Lo que busca un técnico de mantenimiento a las 7 de la mañana, no consejos genéricos.
      </p>

      <div className="mt-8 divide-y divide-trade-gray-200 border-y border-trade-gray-200">
        {articulos.map((articulo) => (
          <Link key={articulo.slug} href={`/blog/${articulo.slug}`} className="block py-6 hover:bg-trade-gray-050">
            <p className="text-xs font-medium uppercase tracking-wide text-trade-red">{articulo.categoria}</p>
            <h2 className="mt-1 font-heading text-xl font-semibold text-trade-gray-900">{articulo.titulo}</h2>
            <p className="mt-1 text-sm text-trade-gray-500">{articulo.resumen}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
