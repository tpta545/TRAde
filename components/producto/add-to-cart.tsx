"use client";

import { useState } from "react";
import { Minus, Plus } from "lucide-react";
import type { Producto } from "@/lib/schemas/producto";
import { useCart } from "@/lib/cart/cart-context";
import { trackEvent } from "@/lib/analitica/eventos";

export function AddToCart({ producto }: { producto: Producto }) {
  const [cantidad, setCantidad] = useState(producto.multiploVenta);
  const { añadir } = useCart();

  const bajar = () => setCantidad((c) => Math.max(producto.multiploVenta, c - producto.multiploVenta));
  const subir = () => setCantidad((c) => c + producto.multiploVenta);

  const handleAñadir = () => {
    añadir(producto, cantidad);
    trackEvent("add_to_cart", {
      items: [
        {
          item_id: producto.referencia,
          item_name: producto.nombre,
          item_brand: producto.marca,
          price: producto.precioTarifa,
          quantity: cantidad,
        },
      ],
    });
  };

  return (
    <div className="space-y-3">
      <div className="flex items-stretch gap-2">
        <div className="flex items-center rounded-md border border-trade-gray-200">
          <button
            type="button"
            onClick={bajar}
            className="flex h-12 w-12 items-center justify-center text-trade-gray-500 hover:text-trade-gray-900"
            aria-label="Restar cantidad"
          >
            <Minus className="h-4 w-4" />
          </button>
          <span className="min-w-10 text-center font-mono text-sm">{cantidad}</span>
          <button
            type="button"
            onClick={subir}
            className="flex h-12 w-12 items-center justify-center text-trade-gray-500 hover:text-trade-gray-900"
            aria-label="Sumar cantidad"
          >
            <Plus className="h-4 w-4" />
          </button>
        </div>
        <button
          type="button"
          onClick={handleAñadir}
          className="flex-1 rounded-md bg-trade-red px-4 text-sm font-medium text-trade-white hover:bg-trade-red-dark"
        >
          Añadir al carrito
        </button>
      </div>
      {producto.multiploVenta > 1 && (
        <p className="text-xs text-trade-gray-500">Se vende en múltiplos de {producto.multiploVenta}.</p>
      )}
      <a
        href={`/contacto?asunto=oferta&referencia=${encodeURIComponent(producto.referencia)}`}
        className="block text-center text-sm font-medium text-trade-gray-900 underline decoration-trade-gray-200 underline-offset-4 hover:decoration-trade-gray-900"
      >
        Solicitar oferta para cantidades grandes
      </a>
    </div>
  );
}
