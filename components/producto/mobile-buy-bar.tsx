"use client";

import type { Producto } from "@/lib/schemas/producto";
import { useCart } from "@/lib/cart/cart-context";
import { trackEvent } from "@/lib/analitica/eventos";
import { PriceBlock, type SesionPrecioCliente } from "@/components/producto/price-block";

/**
 * Barra fija inferior en móvil (oculta desde lg, donde ya se ve el bloque
 * de compra completo en la columna sticky). Añade con la cantidad mínima
 * de venta; para elegir cantidad, el usuario sigue teniendo el selector
 * completo (AddToCart) más arriba en la ficha.
 */
export function MobileBuyBar({
  producto,
  sesion,
}: {
  producto: Producto;
  sesion?: SesionPrecioCliente | null;
}) {
  const { añadir } = useCart();

  const handleAñadir = () => {
    añadir(producto, producto.multiploVenta);
    trackEvent("add_to_cart", {
      items: [
        {
          item_id: producto.referencia,
          item_name: producto.nombre,
          item_brand: producto.marca,
          price: producto.precioTarifa,
          quantity: producto.multiploVenta,
        },
      ],
    });
  };

  return (
    <div
      className="fixed inset-x-0 z-40 border-t border-trade-gray-200 bg-trade-white px-4 py-3 shadow-[0_-4px_12px_rgba(0,0,0,0.08)] transition-[bottom] lg:hidden"
      style={{ bottom: "var(--consent-banner-h, 0px)" }}
    >
      <div className="mx-auto flex max-w-6xl items-center gap-3">
        <div className="flex-1">
          <PriceBlock
            precioTarifa={producto.precioTarifa}
            unidadVenta={producto.unidadVenta}
            sesion={sesion}
            tamano="sm"
          />
        </div>
        <button
          type="button"
          onClick={handleAñadir}
          className="shrink-0 rounded-md bg-trade-red px-5 py-3 text-sm font-medium text-trade-white hover:bg-trade-red-dark"
        >
          Añadir
        </button>
      </div>
    </div>
  );
}
