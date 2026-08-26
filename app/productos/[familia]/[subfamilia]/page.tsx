import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getProductosPorFamilia } from "@/lib/data/productos";
import { getFamiliaInfo, getSubfamiliaInfo } from "@/lib/data/familias";
import { ListadoProductos } from "@/components/catalogo/listado-productos";

export const revalidate = 3600;

export async function generateStaticParams() {
  // Se generan a partir de app/productos/[familia]/page.tsx (misma fuente de datos);
  // aquí solo necesitamos las combinaciones familia+subfamilia realmente existentes.
  const { getFamilias } = await import("@/lib/data/productos");
  const familias = await getFamilias();
  const params: { familia: string; subfamilia: string }[] = [];
  for (const { familia } of familias) {
    const productos = await getProductosPorFamilia(familia);
    const subfamilias = new Set(productos.map((p) => p.subfamilia));
    for (const subfamilia of subfamilias) params.push({ familia, subfamilia });
  }
  return params;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ familia: string; subfamilia: string }>;
}): Promise<Metadata> {
  const { familia, subfamilia } = await params;
  const familiaInfo = getFamiliaInfo(familia);
  const subInfo = getSubfamiliaInfo(familia, subfamilia);
  return {
    title: `${subInfo.nombre} | ${familiaInfo.nombre} | Comprar online con stock y envío 24h`,
    description: subInfo.introCorta || familiaInfo.introCorta,
    alternates: { canonical: `/productos/${familia}/${subfamilia}` },
  };
}

export default async function SubfamiliaPage({
  params,
  searchParams,
}: {
  params: Promise<{ familia: string; subfamilia: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const { familia, subfamilia } = await params;
  const sp = await searchParams;

  const productos = await getProductosPorFamilia(familia);
  if (!productos.some((p) => p.subfamilia === subfamilia)) notFound();

  return (
    <ListadoProductos familiaSlug={familia} subfamiliaSlug={subfamilia} searchParams={sp} pagina={1} />
  );
}
