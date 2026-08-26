import { notFound } from "next/navigation";
import { getProductosPorFamilia } from "@/lib/data/productos";
import { ListadoProductos } from "@/components/catalogo/listado-productos";

export const revalidate = 3600;

export default async function SubfamiliaPaginaPage({
  params,
  searchParams,
}: {
  params: Promise<{ familia: string; subfamilia: string; pagina: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const { familia, subfamilia, pagina } = await params;
  const sp = await searchParams;

  const productos = await getProductosPorFamilia(familia);
  if (!productos.some((p) => p.subfamilia === subfamilia)) notFound();

  const numeroPagina = Number(pagina);
  if (!Number.isInteger(numeroPagina) || numeroPagina < 2) notFound();

  return (
    <ListadoProductos
      familiaSlug={familia}
      subfamiliaSlug={subfamilia}
      searchParams={sp}
      pagina={numeroPagina}
    />
  );
}
