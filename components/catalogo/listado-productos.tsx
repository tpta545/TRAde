import Link from "next/link";
import { getProductosPorFamilia } from "@/lib/data/productos";
import {
  aplicarFiltros,
  contarPorMarca,
  contarPorSubfamilia,
  extraerRangosAtributos,
  filtrosDesdeSearchParams,
  ordenarProductos,
  paginar,
  type OrdenCatalogo,
} from "@/lib/catalog/filtros";
import { getFamiliaInfo, getSubfamiliaInfo } from "@/lib/data/familias";
import { FilterRail } from "@/components/catalogo/filter-rail";
import { OrderSelect } from "@/components/catalogo/order-select";
import { ProductCard } from "@/components/producto/product-card";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { faqJsonLd } from "@/lib/seo/schema";

export async function ListadoProductos({
  familiaSlug,
  subfamiliaSlug,
  searchParams,
  pagina,
}: {
  familiaSlug: string;
  subfamiliaSlug?: string;
  searchParams: Record<string, string | string[] | undefined>;
  pagina: number;
}) {
  const familiaInfo = getFamiliaInfo(familiaSlug);
  const subfamiliaInfo = subfamiliaSlug ? getSubfamiliaInfo(familiaSlug, subfamiliaSlug) : undefined;

  const todosDeLaFamilia = await getProductosPorFamilia(familiaSlug);
  const universo = subfamiliaSlug
    ? todosDeLaFamilia.filter((p) => p.subfamilia === subfamiliaSlug)
    : todosDeLaFamilia;

  const filtros = { ...filtrosDesdeSearchParams(searchParams), pagina };
  const filtrados = ordenarProductos(aplicarFiltros(universo, filtros), filtros.orden);
  const { items, paginaActual, totalPaginas, total } = paginar(filtrados, pagina);

  const basePath = subfamiliaSlug
    ? `/productos/${familiaSlug}/${subfamiliaSlug}`
    : `/productos/${familiaSlug}`;

  const subfamiliasDisponibles = subfamiliaSlug
    ? undefined
    : contarPorSubfamilia(todosDeLaFamilia).map(({ subfamilia, total: totalSub }) => ({
        info: getSubfamiliaInfo(familiaSlug, subfamilia),
        total: totalSub,
      }));

  const migas = subfamiliaInfo
    ? [
        { nombre: "Productos", url: "/productos" },
        { nombre: familiaInfo.nombre, url: `/productos/${familiaSlug}` },
        { nombre: subfamiliaInfo.nombre, url: basePath },
      ]
    : [
        { nombre: "Productos", url: "/productos" },
        { nombre: familiaInfo.nombre, url: basePath },
      ];

  const queryActual: Record<string, string> = {};
  if (filtros.marca?.length) queryActual.marca = filtros.marca.join(",");
  if (filtros.subfamilia?.length) queryActual.subfamilia = filtros.subfamilia.join(",");
  if (filtros.soloStock) queryActual.stock = "1";

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6">
      <Breadcrumbs items={migas.slice(1)} />
      <h1 className="mt-2 text-3xl font-heading font-semibold text-trade-gray-900">
        {subfamiliaInfo?.nombre ?? familiaInfo.nombre}
      </h1>
      <p className="mt-2 max-w-3xl text-sm text-trade-gray-500">
        {subfamiliaInfo?.introCorta || familiaInfo.introCorta}
      </p>

      <div className="mt-8 flex flex-col gap-8 sm:flex-row">
        <FilterRail
          basePath={basePath}
          filtros={filtros}
          marcasDisponibles={contarPorMarca(universo)}
          subfamiliasDisponibles={subfamiliasDisponibles}
          rangosAtributos={extraerRangosAtributos(universo)}
        />

        <div className="flex-1">
          <div className="mb-4 flex items-center justify-between gap-4 text-sm">
            <p className="text-trade-gray-500">{total} referencia{total === 1 ? "" : "s"}</p>
            <OrderSelect basePath={basePath} ordenActual={filtros.orden ?? "relevancia"} queryActual={queryActual} />
          </div>

          {items.length === 0 ? (
            <div className="rounded-lg border border-dashed border-trade-gray-200 p-12 text-center">
              <p className="text-trade-gray-500">No hay referencias que cumplan estos filtros.</p>
              <Link href={basePath} className="mt-2 inline-block text-sm font-medium text-trade-red hover:underline">
                Quitar filtros
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {items.map((producto) => (
                <ProductCard key={producto.id} producto={producto} />
              ))}
            </div>
          )}

          {totalPaginas > 1 && (
            <nav aria-label="Paginación" className="mt-8 flex items-center justify-center gap-2 text-sm">
              {Array.from({ length: totalPaginas }, (_, i) => i + 1).map((numeroPagina) => (
                <Link
                  key={numeroPagina}
                  href={numeroPagina === 1 ? basePath : `${basePath}/pagina/${numeroPagina}`}
                  className={
                    "flex h-8 w-8 items-center justify-center rounded-md " +
                    (numeroPagina === paginaActual
                      ? "bg-trade-red text-trade-white"
                      : "text-trade-gray-900 hover:bg-trade-gray-050")
                  }
                >
                  {numeroPagina}
                </Link>
              ))}
            </nav>
          )}

          {/* Contenido técnico solo en la vista de familia completa, sin filtros ni paginar más allá de 1 */}
          {!subfamiliaSlug && familiaInfo.contenidoTecnico && paginaActual === 1 && (
            <div className="mt-16 space-y-10 border-t border-trade-gray-200 pt-10">
              <article className="prose-trade max-w-3xl whitespace-pre-line text-sm leading-relaxed text-trade-gray-900">
                {familiaInfo.contenidoTecnico}
              </article>

              {familiaInfo.faq.length > 0 && (
                <div className="max-w-3xl">
                  <h2 className="mb-4 text-xl font-heading font-semibold text-trade-gray-900">
                    Preguntas frecuentes
                  </h2>
                  <div className="divide-y divide-trade-gray-200">
                    {familiaInfo.faq.map((item) => (
                      <details key={item.pregunta} className="py-3">
                        <summary className="cursor-pointer font-medium text-trade-gray-900">
                          {item.pregunta}
                        </summary>
                        <p className="mt-2 text-sm text-trade-gray-500">{item.respuesta}</p>
                      </details>
                    ))}
                  </div>
                  <script
                    type="application/ld+json"
                    // eslint-disable-next-line react/no-danger
                    dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd(familiaInfo.faq)) }}
                  />
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
