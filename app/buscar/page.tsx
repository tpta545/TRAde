import type { Metadata } from "next";
import Link from "next/link";
import { buscarProductos, familiaMasCercana } from "@/lib/search/indice";
import { getProductosPorFamilia } from "@/lib/data/productos";
import { guardarLead } from "@/lib/leads/store";
import { ProductCard } from "@/components/producto/product-card";
import { FormularioBusquedaSinResultados } from "@/components/leads/formulario-busqueda-sin-resultados";
import { TrackOnMount } from "@/components/analitica/track-on-mount";

export const metadata: Metadata = {
  title: "Buscar",
  robots: { index: false, follow: true },
};

export default async function BuscarPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q = "" } = await searchParams;
  const consulta = q.trim();
  const resultados = consulta ? await buscarProductos(consulta) : [];

  if (consulta && resultados.length === 0) {
    // Registro de toda búsqueda sin resultado (Parte 7.4): la mejor lista
    // de qué referencias dar de alta a continuación, tenga o no el
    // visitante interés en dejar sus datos de contacto.
    await guardarLead("busqueda_sin_resultados", { consulta, conContacto: false });
  }

  const familiaCercana = consulta && resultados.length === 0 ? await familiaMasCercana(consulta) : null;
  const productosFamiliaCercana = familiaCercana
    ? (await getProductosPorFamilia(familiaCercana.slug)).slice(0, 6)
    : [];

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6">
      <h1 className="text-2xl font-heading font-semibold text-trade-gray-900">
        {consulta ? (
          <>
            Resultados para &ldquo;{consulta}&rdquo;{" "}
            <span className="text-base font-normal text-trade-gray-500">({resultados.length})</span>
          </>
        ) : (
          "Buscar"
        )}
      </h1>

      {!consulta && (
        <p className="mt-2 text-sm text-trade-gray-500">
          Escribe una referencia, marca o descripción en el buscador de la cabecera.
        </p>
      )}

      {consulta && resultados.length > 0 && (
        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {resultados.map((producto) => (
            <ProductCard key={producto.id} producto={producto} />
          ))}
        </div>
      )}

      {consulta && resultados.length === 0 && (
        <div className="mt-8 max-w-xl space-y-8">
          <TrackOnMount evento="search_no_results" parametros={{ search_term: consulta }} />
          <FormularioBusquedaSinResultados consulta={consulta} />

          {familiaCercana && productosFamiliaCercana.length > 0 && (
            <div>
              <p className="mb-3 text-sm text-trade-gray-500">
                Mientras tanto, esto es lo más parecido que tenemos en{" "}
                <Link href={`/productos/${familiaCercana.slug}`} className="font-medium text-trade-red hover:underline">
                  {familiaCercana.nombre}
                </Link>
                :
              </p>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {productosFamiliaCercana.map((producto) => (
                  <ProductCard key={producto.id} producto={producto} />
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
