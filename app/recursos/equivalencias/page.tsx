import type { Metadata } from "next";
import { buscarPorReferenciaEquivalente } from "@/lib/search/equivalencias";
import { ProductCard } from "@/components/producto/product-card";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";

export const metadata: Metadata = {
  title: "Buscador de equivalencias",
  description: "Mete la referencia de cualquier marca (SKF, FAG, INA...) y te decimos cuál es la nuestra.",
  alternates: { canonical: "/recursos/equivalencias" },
};

export default async function EquivalenciasPage({
  searchParams,
}: {
  searchParams: Promise<{ ref?: string }>;
}) {
  const { ref = "" } = await searchParams;
  const resultados = ref ? await buscarPorReferenciaEquivalente(ref) : [];

  return (
    <div className="mx-auto w-full max-w-4xl px-4 py-10 sm:px-6">
      <Breadcrumbs items={[{ nombre: "Buscador de equivalencias", url: "/recursos/equivalencias" }]} />
      <h1 className="mt-2 text-3xl font-heading font-semibold text-trade-gray-900">
        Buscador de equivalencias
      </h1>
      <p className="mt-2 max-w-xl text-sm text-trade-gray-500">
        Mete la referencia de cualquier marca —SKF, FAG, INA, otro fabricante de motores o
        variadores— y te decimos si tenemos el equivalente en catálogo.
      </p>

      <form method="GET" className="mt-6 flex max-w-md gap-2">
        <input
          type="text"
          name="ref"
          defaultValue={ref}
          placeholder="Ej: SKF 6205-2RS1"
          className="w-full rounded-md border border-trade-gray-200 px-3 py-2 text-sm"
        />
        <button
          type="submit"
          className="shrink-0 rounded-md bg-trade-red px-4 py-2 text-sm font-medium text-trade-white hover:bg-trade-red-dark"
        >
          Buscar
        </button>
      </form>

      {ref && (
        <div className="mt-8">
          {resultados.length === 0 ? (
            <p className="text-sm text-trade-gray-500">
              No tenemos confirmada una equivalencia para &ldquo;{ref}&rdquo; todavía.{" "}
              <a href="/contacto" className="text-trade-red hover:underline">
                Pregúntanos directamente
              </a>{" "}
              y te lo confirmamos.
            </p>
          ) : (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {resultados.map((producto) => (
                <ProductCard key={producto.id} producto={producto} />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
