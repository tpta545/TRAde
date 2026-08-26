"use client";

import { useRouter } from "next/navigation";
import { useCart } from "@/lib/cart/cart-context";
import type { Presupuesto } from "@/lib/cuenta/presupuestos";

export function ConvertirPresupuestoBoton({ presupuesto }: { presupuesto: Presupuesto }) {
  const { añadirItem } = useCart();
  const router = useRouter();

  return (
    <button
      type="button"
      onClick={() => {
        for (const item of presupuesto.itemsPropuestos) {
          añadirItem({
            productoId: item.referencia,
            slug: "",
            referencia: item.referencia,
            nombre: item.nombre,
            marca: "",
            precioTarifa: item.precioTarifa,
            unidadVenta: "ud",
            multiploVenta: 1,
            imagenUrl: "/productos/placeholder.svg",
            bajoPedido: false,
            cantidad: item.cantidad,
          });
        }
        router.push("/carrito");
      }}
      className="rounded-md bg-trade-red px-3 py-1.5 text-xs font-medium text-trade-white hover:bg-trade-red-dark"
    >
      Convertir en pedido
    </button>
  );
}
