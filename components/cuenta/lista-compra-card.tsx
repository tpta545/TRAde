"use client";

import { useTransition } from "react";
import { useCart } from "@/lib/cart/cart-context";
import { eliminarListaAction } from "@/lib/cuenta/listas-actions";
import type { ListaCompra } from "@/lib/cuenta/listas";

const formateadorEUR = new Intl.NumberFormat("es-ES", { style: "currency", currency: "EUR" });

export function ListaCompraCard({ lista }: { lista: ListaCompra }) {
  const { añadirItem } = useCart();
  const [pendiente, iniciarTransicion] = useTransition();

  return (
    <div className="rounded-lg border border-trade-gray-200 p-4">
      <div className="mb-2 flex items-center justify-between">
        <h3 className="font-medium text-trade-gray-900">{lista.nombre}</h3>
        <button
          type="button"
          disabled={pendiente}
          onClick={() => iniciarTransicion(() => eliminarListaAction(lista.id))}
          className="text-xs text-trade-gray-500 hover:text-trade-red disabled:opacity-50"
        >
          Eliminar
        </button>
      </div>
      <ul className="mb-3 space-y-1 text-sm">
        {lista.items.map((item) => (
          <li key={item.productoId} className="flex justify-between text-trade-gray-500">
            <span className="font-mono text-trade-gray-900">
              {item.referencia} × {item.cantidad}
            </span>
            <span>{formateadorEUR.format(item.precioTarifa * item.cantidad)}</span>
          </li>
        ))}
      </ul>
      <button
        type="button"
        onClick={() => {
          for (const item of lista.items) {
            añadirItem({
              productoId: item.productoId,
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
        }}
        className="w-full rounded-md bg-trade-red px-3 py-2 text-xs font-medium text-trade-white hover:bg-trade-red-dark"
      >
        Añadir todo al carrito
      </button>
    </div>
  );
}
