import Link from "next/link";
import Image from "next/image";
import type { Producto } from "@/lib/schemas/producto";
import { StockBadge } from "@/components/producto/stock-badge";
import { PriceBlock } from "@/components/producto/price-block";

export function ProductCard({ producto }: { producto: Producto }) {
  const href = `/productos/${producto.familia}/${producto.subfamilia}/${producto.slug}`;
  const imagen = producto.imagenes[0];

  return (
    <Link
      href={href}
      className="group flex flex-col overflow-hidden rounded-lg border border-trade-gray-200 bg-trade-white transition-all duration-150 hover:-translate-y-1 hover:border-trade-gray-200 hover:shadow-md"
    >
      <div className="aspect-square bg-trade-gray-050">
        <Image
          src={imagen?.url ?? "/productos/placeholder.svg"}
          alt={imagen?.alt ?? producto.nombre}
          width={400}
          height={400}
          className="h-full w-full object-contain transition-transform duration-150 group-hover:scale-[1.03]"
        />
      </div>
      <div className="flex flex-1 flex-col gap-1.5 p-4">
        <p className="text-xs font-medium uppercase tracking-wide text-trade-gray-500">{producto.marca}</p>
        <p className="font-mono text-sm text-trade-gray-900">{producto.referencia}</p>
        <p className="line-clamp-2 text-sm text-trade-gray-500 group-hover:text-trade-gray-900">
          {producto.nombre}
        </p>
        {producto.atributosDestacados.length > 0 && (
          <ul className="flex flex-wrap gap-x-3 gap-y-0.5 text-xs text-trade-gray-500">
            {producto.atributosDestacados.slice(0, 3).map((clave) => (
              <li key={clave}>
                {clave}: <span className="font-mono">{producto.atributos[clave]}</span>
              </li>
            ))}
          </ul>
        )}
        <div className="mt-auto pt-2">
          <StockBadge producto={producto} compacto />
          <div className="mt-1">
            <PriceBlock precioTarifa={producto.precioTarifa} unidadVenta={producto.unidadVenta} tamano="sm" />
          </div>
        </div>
      </div>
    </Link>
  );
}
