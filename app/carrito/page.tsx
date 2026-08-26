"use client";

import Link from "next/link";
import Image from "next/image";
import { Minus, Plus, X } from "lucide-react";
import { useCart } from "@/lib/cart/cart-context";
import { siteConfig } from "@/config/site";

const formateadorEUR = new Intl.NumberFormat("es-ES", { style: "currency", currency: "EUR" });

export default function CarritoPage() {
  const { items, quitar, actualizarCantidad, subtotal } = useCart();

  if (items.length === 0) {
    return (
      <div className="mx-auto flex w-full max-w-2xl flex-col items-center gap-4 px-4 py-24 text-center sm:px-6">
        <h1 className="text-2xl font-heading font-semibold text-trade-gray-900">
          Tu carrito está vacío
        </h1>
        <Link href="/productos" className="font-medium text-trade-red hover:underline">
          Ver catálogo →
        </Link>
      </div>
    );
  }

  const hayLineaBajoPedido = items.some((item) => item.bajoPedido);

  return (
    <div className="mx-auto w-full max-w-4xl px-4 py-10 sm:px-6">
      <h1 className="text-2xl font-heading font-semibold text-trade-gray-900">
        Tu carrito ({items.length})
      </h1>

      <div className="mt-8 divide-y divide-trade-gray-200 border-y border-trade-gray-200">
        {items.map((item) => (
          <div key={item.productoId} className="flex gap-4 py-5">
            <Image
              src={item.imagenUrl}
              alt={item.nombre}
              width={80}
              height={80}
              className="h-20 w-20 flex-shrink-0 rounded-md border border-trade-gray-200 object-cover"
            />
            <div className="flex flex-1 flex-col gap-1">
              <p className="text-xs font-mono text-trade-gray-500">{item.referencia}</p>
              <p className="text-sm text-trade-gray-900">{item.nombre}</p>
              {item.bajoPedido && (
                <p className="text-xs font-medium text-trade-amber">Esta línea va bajo pedido</p>
              )}
              <div className="mt-2 flex items-center justify-between">
                <div className="flex items-center gap-1 rounded-md border border-trade-gray-200">
                  <button
                    type="button"
                    onClick={() => actualizarCantidad(item.productoId, item.cantidad - item.multiploVenta)}
                    className="flex h-8 w-8 items-center justify-center text-trade-gray-500 hover:text-trade-gray-900"
                    aria-label="Restar cantidad"
                  >
                    <Minus className="h-3.5 w-3.5" />
                  </button>
                  <span className="min-w-8 text-center text-sm font-mono">{item.cantidad}</span>
                  <button
                    type="button"
                    onClick={() => actualizarCantidad(item.productoId, item.cantidad + item.multiploVenta)}
                    className="flex h-8 w-8 items-center justify-center text-trade-gray-500 hover:text-trade-gray-900"
                    aria-label="Sumar cantidad"
                  >
                    <Plus className="h-3.5 w-3.5" />
                  </button>
                </div>
                <p className="font-mono text-sm text-trade-gray-900">
                  {formateadorEUR.format(item.precioTarifa * item.cantidad)}
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => quitar(item.productoId)}
              className="self-start text-trade-gray-500 hover:text-trade-red"
              aria-label={`Quitar ${item.nombre}`}
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>

      <div className="mt-6 flex flex-col items-end gap-3">
        {siteConfig.comercio.portesGratisDesde !== null && subtotal < siteConfig.comercio.portesGratisDesde && (
          <p className="text-sm text-trade-gray-500">
            Te faltan{" "}
            {formateadorEUR.format(siteConfig.comercio.portesGratisDesde - subtotal)} para envío
            gratis.
          </p>
        )}
        {hayLineaBajoPedido && (
          <p className="text-sm text-trade-amber">
            Tu pedido incluye referencias bajo pedido: el plazo se consolida al del artículo más lento.
          </p>
        )}
        <p className="text-lg font-mono font-semibold text-trade-gray-900">
          Subtotal (sin IVA): {formateadorEUR.format(subtotal)}
        </p>
        <div className="flex gap-3">
          <Link
            href="/productos"
            className="rounded-md border border-trade-gray-200 px-5 py-3 text-sm font-medium text-trade-gray-900 hover:bg-trade-gray-050"
          >
            Seguir comprando
          </Link>
          <Link
            href="/checkout"
            className="rounded-md bg-trade-red px-5 py-3 text-sm font-medium text-trade-white hover:bg-trade-red-dark"
          >
            Finalizar pedido
          </Link>
        </div>
      </div>
    </div>
  );
}
