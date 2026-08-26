import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getFamilias } from "@/lib/data/productos";
import { getFamiliaInfo } from "@/lib/data/familias";
import { ListadoProductos } from "@/components/catalogo/listado-productos";

export const revalidate = 3600;

export async function generateStaticParams() {
  const familias = await getFamilias();
  return familias.map(({ familia }) => ({ familia }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ familia: string }>;
}): Promise<Metadata> {
  const { familia } = await params;
  const info = getFamiliaInfo(familia);
  return {
    title: `${info.nombre} | Comprar online con stock y envío 24h`,
    description: info.introCorta,
    alternates: { canonical: `/productos/${familia}` },
  };
}

export default async function FamiliaPage({
  params,
  searchParams,
}: {
  params: Promise<{ familia: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const { familia } = await params;
  const sp = await searchParams;

  const familias = await getFamilias();
  if (!familias.some((f) => f.familia === familia)) notFound();

  return <ListadoProductos familiaSlug={familia} searchParams={sp} pagina={1} />;
}
