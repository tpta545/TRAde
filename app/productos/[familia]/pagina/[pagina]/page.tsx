import { notFound } from "next/navigation";
import { getFamilias } from "@/lib/data/productos";
import { ListadoProductos } from "@/components/catalogo/listado-productos";

export const revalidate = 3600;

export default async function FamiliaPaginaPage({
  params,
  searchParams,
}: {
  params: Promise<{ familia: string; pagina: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const { familia, pagina } = await params;
  const sp = await searchParams;

  const familias = await getFamilias();
  if (!familias.some((f) => f.familia === familia)) notFound();

  const numeroPagina = Number(pagina);
  if (!Number.isInteger(numeroPagina) || numeroPagina < 2) notFound();

  return <ListadoProductos familiaSlug={familia} searchParams={sp} pagina={numeroPagina} />;
}
