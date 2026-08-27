"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { LayoutGrid, List } from "lucide-react";
import type { Producto } from "@/lib/schemas/producto";
import { ProductCard } from "@/components/producto/product-card";
import { StockBadge } from "@/components/producto/stock-badge";
import { PriceBlock } from "@/components/producto/price-block";

type Vista = "tarjetas" | "tabla";

export function VistaProductos({ items }: { items: Producto[] }) {
  const [vista, setVista] = useState<Vista>("tarjetas");

  return (
    <div>
      <div className="mb-4 flex justify-end">
        <div className="inline-flex rounded-md border border-trade-gray-200 p-0.5">
          <button
            type="button"
            onClick={() => setVista("tarjetas")}
            aria-pressed={vista === "tarjetas"}
            aria-label="Vista de tarjetas"
            className={
              "flex h-7 w-7 items-center justify-center rounded " +
              (vista === "tarjetas"
                ? "bg-trade-gray-900 text-trade-white"
                : "text-trade-gray-500 hover:text-trade-gray-900")
            }
          >
            <LayoutGrid className="h-4 w-4" aria-hidden />
          </button>
          <button
            type="button"
            onClick={() => setVista("tabla")}
            aria-pressed={vista === "tabla"}
            aria-label="Vista de tabla"
            className={
              "flex h-7 w-7 items-center justify-center rounded " +
              (vista === "tabla"
                ? "bg-trade-gray-900 text-trade-white"
                : "text-trade-gray-500 hover:text-trade-gray-900")
            }
          >
            <List className="h-4 w-4" aria-hidden />
          </button>
        </div>
      </div>

      {vista === "tarjetas" ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((producto) => (
            <ProductCard key={producto.id} producto={producto} />
          ))}
        </div>
      ) : (
        <div className="overflow-x-auto rounded-lg border border-trade-gray-200">
          <table className="table-trade">
            <thead>
              <tr>
                <th scope="col">Referencia</th>
                <th scope="col">Marca</th>
                <th scope="col">Stock</th>
                <th className="text-right" scope="col">
                  Precio
                </th>
              </tr>
            </thead>
            <tbody>
              {items.map((producto) => {
                const href = `/productos/${producto.familia}/${producto.subfamilia}/${producto.slug}`;
                const imagen = producto.imagenes[0];
                return (
                  <tr key={producto.id}>
                    <td>
                      <Link href={href} className="flex items-center gap-3">
                        <span className="relative h-10 w-10 shrink-0 overflow-hidden rounded border border-trade-gray-200 bg-trade-gray-050">
                          <Image
                            src={imagen?.url ?? "/productos/placeholder.svg"}
                            alt=""
                            width={40}
                            height={40}
                            className="h-full w-full object-contain"
                          />
                        </span>
                        <span>
                          <span className="block font-mono text-trade-gray-900">{producto.referencia}</span>
                          <span className="line-clamp-1 block text-xs text-trade-gray-500">
                            {producto.nombre}
                          </span>
                        </span>
                      </Link>
                    </td>
                    <td className="text-trade-gray-500">{producto.marca}</td>
                    <td>
                      <StockBadge producto={producto} compacto />
                    </td>
                    <td className="text-right">
                      <PriceBlock
                        precioTarifa={producto.precioTarifa}
                        unidadVenta={producto.unidadVenta}
                        tamano="sm"
                      />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
