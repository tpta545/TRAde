import type { Metadata } from "next";
import { getProductos } from "@/lib/data/productos";

export const metadata: Metadata = {
  title: "Productos",
  description:
    "Catálogo de prueba de la Fase 0: 25 referencias reales de ABB, Festo, NTN, WEG e ISB cargadas desde /lib/data.",
};

const formateadorEUR = new Intl.NumberFormat("es-ES", {
  style: "currency",
  currency: "EUR",
});

export default async function ProductosPage() {
  const productos = await getProductos();

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6">
      <p className="text-xs font-mono uppercase tracking-wide text-trade-gray-500">
        Fase 0 — listado de verificación, sin diseño final
      </p>
      <h1 className="mt-1 text-3xl font-heading font-semibold text-trade-gray-900">
        Productos ({productos.length})
      </h1>
      <p className="mt-2 max-w-2xl text-sm text-trade-gray-500">
        Datos servidos por <code className="font-mono">lib/data/productos.ts</code> desde{" "}
        <code className="font-mono">data/productos.seed.json</code>, validados con Zod. La
        ficha de producto completa y los filtros por familia llegan en la Fase 1.
      </p>

      <div className="mt-8 overflow-x-auto rounded-lg border border-trade-gray-200">
        <table className="w-full min-w-[720px] border-collapse text-sm">
          <thead>
            <tr className="border-b border-trade-gray-200 bg-trade-gray-050 text-left text-xs uppercase tracking-wide text-trade-gray-500">
              <th className="px-4 py-3 font-medium">Marca</th>
              <th className="px-4 py-3 font-medium">Referencia</th>
              <th className="px-4 py-3 font-medium">Nombre</th>
              <th className="px-4 py-3 font-medium">Familia</th>
              <th className="px-4 py-3 font-medium text-right">Precio (tarifa)</th>
              <th className="px-4 py-3 font-medium text-right">Stock</th>
            </tr>
          </thead>
          <tbody>
            {productos.map((producto) => (
              <tr key={producto.id} className="border-b border-trade-gray-200 last:border-0">
                <td className="px-4 py-3 text-trade-gray-500">{producto.marca}</td>
                <td className="px-4 py-3 font-mono text-trade-gray-900">{producto.referencia}</td>
                <td className="px-4 py-3 text-trade-gray-900">{producto.nombre}</td>
                <td className="px-4 py-3 text-trade-gray-500">
                  {producto.familia} / {producto.subfamilia}
                </td>
                <td className="px-4 py-3 text-right font-mono text-trade-gray-900">
                  {formateadorEUR.format(producto.precioTarifa)}
                </td>
                <td className="px-4 py-3 text-right">
                  {producto.stock > 0 ? (
                    <span className="text-trade-green">{producto.stock} ud</span>
                  ) : (
                    <span className="text-trade-amber">bajo pedido</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
