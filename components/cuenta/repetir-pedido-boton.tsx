"use client";

import { useRouter } from "next/navigation";
import { useCart } from "@/lib/cart/cart-context";
import { trackEvent } from "@/lib/analitica/eventos";
import type { LineaPedido } from "@/lib/pedidos/pedido";

export function RepetirPedidoBoton({ lineas }: { lineas: LineaPedido[] }) {
  const { añadirItem } = useCart();
  const router = useRouter();

  return (
    <button
      type="button"
      onClick={() => {
        for (const linea of lineas) {
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
            cantidad: linea.cantidad,
          });
        }
        trackEvent("reorder_clicked", { lineas: lineas.length });
        router.push("/carrito");
      }}
      className="rounded-md border border-trade-gray-200 px-3 py-1.5 text-xs font-medium text-trade-gray-900 hover:bg-trade-gray-050"
    >
      Repetir pedido
    </button>
  );
}
