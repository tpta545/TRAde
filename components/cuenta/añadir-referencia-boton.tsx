"use client";

import { useCart } from "@/lib/cart/cart-context";
import type { LineaPedido } from "@/lib/pedidos/pedido";

export function AñadirReferenciaBoton({ linea }: { linea: LineaPedido }) {
  const { añadirItem } = useCart();

  return (
    <button
      type="button"
      onClick={() =>
        añadirItem({
          productoId: linea.productoId,
          slug: "",
          referencia: linea.referencia,
          nombre: linea.nombre,
          marca: linea.marca,
          precioTarifa: linea.precioUnitario,
          unidadVenta: "ud",
          multiploVenta: 1,
          imagenUrl: "/productos/placeholder.svg",
          bajoPedido: linea.bajoPedido,
          cantidad: 1,
        })
      }
      className="shrink-0 rounded-md border border-trade-gray-200 px-3 py-1.5 text-xs font-medium text-trade-gray-900 hover:bg-trade-gray-050"
    >
      Añadir al carrito
    </button>
  );
}
