import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { getMarcas, getProductosPorMarca } from "@/lib/data/productos";
import { getMarcaInfo } from "@/lib/data/marcas";
import { getFamiliaInfo } from "@/lib/data/familias";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { ProductCard } from "@/components/producto/product-card";

export const revalidate = 3600;

export async function generateStaticParams() {
  const marcas = await getMarcas();
  return marcas.map(({ marca }) => ({ marca: marca.toLowerCase() }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ marca: string }>;
}): Promise<Metadata> {
  const { marca } = await params;
  const info = getMarcaInfo(marca);
  return {
    title: `${info.nombre} | Distribuidor oficial`,
    description: info.descripcion,
    alternates: { canonical: `/marcas/${marca}` },
  };
}

export default async function MarcaPage({ params }: { params: Promise<{ marca: string }> }) {
  const { marca } = await params;
  const productos = await getProductosPorMarca(marca);
  if (productos.length === 0) notFound();

  const info = getMarcaInfo(marca);
  const familias = Array.from(new Set(productos.map((p) => p.familia)));

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6">
      <Breadcrumbs items={[{ nombre: "Marcas", url: "/marcas" }, { nombre: info.nombre, url: `/marcas/${marca}` }]} />

      <h1 className="mt-2 text-3xl font-heading font-semibold text-trade-gray-900">{info.nombre}</h1>
      <p className="mt-2 max-w-2xl text-sm text-trade-gray-500">{info.descripcion}</p>

      <div className="mt-4 flex flex-wrap gap-2">
        {familias.map((familiaSlug) => {
          const familiaInfo = getFamiliaInfo(familiaSlug);
          return (
            <Link
              key={familiaSlug}
              href={`/marcas/${marca}/${familiaSlug}`}
              className="rounded-full border border-trade-gray-200 px-3 py-1.5 text-sm text-trade-gray-900 hover:border-trade-red"
            >
              {familiaInfo.nombre}
            </Link>
          );
        })}
      </div>

      <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {productos.map((producto) => (
          <ProductCard key={producto.id} producto={producto} />
        ))}
      </div>
    </div>
  );
}
