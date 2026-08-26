"use client";

import Link from "next/link";
import Image from "next/image";
import { ShoppingCart, X, Minus, Plus } from "lucide-react";
import { useCart } from "@/lib/cart/cart-context";
import { siteConfig } from "@/config/site";

const formateadorEUR = new Intl.NumberFormat("es-ES", { style: "currency", currency: "EUR" });

export function CartButton() {
  const { abrirCarrito, totalUnidades } = useCart();
  return (
    <button
      type="button"
      onClick={abrirCarrito}
      className="relative flex h-10 w-10 items-center justify-center rounded-md text-trade-gray-900 hover:bg-trade-gray-050"
      aria-label={`Carrito, ${totalUnidades} unidades`}
    >
      <ShoppingCart className="h-5 w-5" />
      {totalUnidades > 0 && (
        <span className="absolute -right-1 -top-1 flex h-4.5 min-w-4.5 items-center justify-center rounded-full bg-trade-red px-1 text-[10px] font-medium text-trade-white">
          {totalUnidades}
        </span>
      )}
    </button>
  );
}

export function CartDrawer() {
  const {
    items,
    abierto,
    cerrarCarrito,
    quitar,
    actualizarCantidad,
    subtotal,
  } = useCart();

  const faltaParaPortesGratis =
    siteConfig.comercio.portesGratisDesde !== null
      ? Math.max(0, siteConfig.comercio.portesGratisDesde - subtotal)
      : null;

  const hayLineaBajoPedido = items.some((item) => item.bajoPedido);

  if (!abierto) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <button
        type="button"
        aria-label="Cerrar carrito"
        onClick={cerrarCarrito}
        className="absolute inset-0 bg-trade-ink/40"
      />
      <div className="relative flex h-full w-full max-w-sm flex-col bg-trade-white shadow-xl">
        <div className="flex items-center justify-between border-b border-trade-gray-200 px-4 py-3">
          <h2 className="font-heading text-lg font-semibold text-trade-gray-900">
            Tu carrito ({items.length})
          </h2>
          <button
            type="button"
            onClick={cerrarCarrito}
            className="rounded-md p-1 text-trade-gray-500 hover:bg-trade-gray-050"
            aria-label="Cerrar"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {items.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-3 px-6 text-center">
            <p className="text-trade-gray-500">Tu carrito está vacío.</p>
            <Link
              href="/productos"
              onClick={cerrarCarrito}
              className="text-sm font-medium text-trade-red hover:underline"
            >
              Seguir comprando →
            </Link>
          </div>
        ) : (
          <>
            <ul className="flex-1 overflow-y-auto divide-y divide-trade-gray-200 px-4">
              {items.map((item) => (
                <li key={item.productoId} className="flex gap-3 py-4">
                  <Image
                    src={item.imagenUrl}
                    alt={item.nombre}
                    width={64}
                    height={64}
                    className="h-16 w-16 flex-shrink-0 rounded-md border border-trade-gray-200 object-cover"
                  />
                  <div className="flex flex-1 flex-col gap-1">
                    <p className="text-xs font-mono text-trade-gray-500">{item.referencia}</p>
                    <p className="text-sm leading-tight text-trade-gray-900">{item.nombre}</p>
                    {item.bajoPedido && (
                      <p className="text-xs font-medium text-trade-amber">Esta línea va bajo pedido</p>
                    )}
                    <div className="mt-1 flex items-center justify-between">
                      <div className="flex items-center gap-1 rounded-md border border-trade-gray-200">
                        <button
                          type="button"
                          onClick={() =>
                            actualizarCantidad(
                              item.productoId,
                              item.cantidad - item.multiploVenta,
                            )
                          }
                          className="flex h-7 w-7 items-center justify-center text-trade-gray-500 hover:text-trade-gray-900"
                          aria-label="Restar cantidad"
                        >
                          <Minus className="h-3 w-3" />
                        </button>
                        <span className="min-w-6 text-center text-sm font-mono">{item.cantidad}</span>
                        <button
                          type="button"
                          onClick={() =>
                            actualizarCantidad(
                              item.productoId,
                              item.cantidad + item.multiploVenta,
                            )
                          }
                          className="flex h-7 w-7 items-center justify-center text-trade-gray-500 hover:text-trade-gray-900"
                          aria-label="Sumar cantidad"
                        >
                          <Plus className="h-3 w-3" />
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
                </li>
              ))}
            </ul>

            <div className="border-t border-trade-gray-200 px-4 py-4 space-y-3">
              {faltaParaPortesGratis !== null && faltaParaPortesGratis > 0 && (
                <p className="text-xs text-trade-gray-500">
                  Te faltan {formateadorEUR.format(faltaParaPortesGratis)} para envío gratis.
                </p>
              )}
              {faltaParaPortesGratis === null && (
                <p className="text-xs text-trade-gray-500">
                  Portes calculados en el siguiente paso.{" "}
                  <span className="font-mono">&lt;&lt;PENDIENTE: umbral de portes gratis&gt;&gt;</span>
                </p>
              )}
              {hayLineaBajoPedido && (
                <p className="text-xs text-trade-amber">
                  Tu pedido incluye referencias bajo pedido: el plazo de entrega se consolida al
                  del artículo más lento.
                </p>
              )}
              <div className="flex items-center justify-between text-sm">
                <span className="text-trade-gray-500">Subtotal (sin IVA)</span>
                <span className="font-mono font-medium text-trade-gray-900">
                  {formateadorEUR.format(subtotal)}
                </span>
              </div>
              <Link
                href="/checkout"
                onClick={cerrarCarrito}
                className="block w-full rounded-md bg-trade-red px-4 py-3 text-center text-sm font-medium text-trade-white hover:bg-trade-red-dark"
              >
                Finalizar pedido
              </Link>
              <button
                type="button"
                onClick={cerrarCarrito}
                className="block w-full text-center text-sm font-medium text-trade-gray-500 hover:text-trade-gray-900"
              >
                Seguir comprando
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
