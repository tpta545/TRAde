"use client";

import { useState, useTransition } from "react";
import { procesarPedidoRapido } from "@/lib/catalog/pedido-rapido-action";
import type { LineaPedidoRapido } from "@/lib/catalog/pedido-rapido";
import { useCart } from "@/lib/cart/cart-context";
import { trackEvent } from "@/lib/analitica/eventos";

const formateadorEUR = new Intl.NumberFormat("es-ES", { style: "currency", currency: "EUR" });

export function QuickOrderPad() {
  const [texto, setTexto] = useState("");
  const [resultado, setResultado] = useState<LineaPedidoRapido[] | null>(null);
  const [pendiente, iniciarTransicion] = useTransition();
  const { añadir } = useCart();

  const procesar = () => {
    iniciarTransicion(async () => {
      const lineas = await procesarPedidoRapido(texto);
      setResultado(lineas);
    });
  };

  const añadirTodoAlCarrito = () => {
    if (!resultado) return;
    let añadidas = 0;
    for (const linea of resultado) {
      if (linea.estado === "encontrada") {
        añadir(linea.producto, linea.cantidad);
        añadidas += 1;
      }
    }
    trackEvent("quick_order_used", { lineas_encontradas: añadidas });
  };

  const encontradas = resultado?.filter((l) => l.estado === "encontrada") ?? [];
  const noEncontradas = resultado?.filter((l) => l.estado === "no_encontrada") ?? [];

  return (
    <div className="space-y-4">
      <div>
        <label htmlFor="pedido-rapido" className="mb-1 block text-sm font-medium text-trade-gray-900">
          Pega tu pedido, una línea por referencia
        </label>
        <textarea
          id="pedido-rapido"
          value={texto}
          onChange={(e) => setTexto(e.target.value)}
          placeholder={"6205ZZ;10\nACS580-01-12A7-4;1\nUCP205;4"}
          rows={8}
          className="w-full rounded-md border border-trade-gray-200 px-3 py-2 font-mono text-sm"
        />
        <p className="mt-1 text-xs text-trade-gray-500">
          Formato: <code className="font-mono">REFERENCIA;CANTIDAD</code>. También acepta separar por
          coma o tabulador. Sin cantidad, se añade el múltiplo de venta mínimo.
        </p>
      </div>

      <button
        type="button"
        onClick={procesar}
        disabled={pendiente || texto.trim().length === 0}
        className="rounded-md border border-trade-gray-200 px-4 py-2 text-sm font-medium text-trade-gray-900 hover:bg-trade-gray-050 disabled:opacity-50"
      >
        {pendiente ? "Comprobando…" : "Comprobar referencias"}
      </button>

      {resultado && (
        <div className="space-y-4 rounded-md border border-trade-gray-200 p-4">
          {encontradas.length > 0 && (
            <div>
              <p className="mb-2 text-sm font-medium text-trade-green">
                {encontradas.length} referencia{encontradas.length === 1 ? "" : "s"} encontrada
                {encontradas.length === 1 ? "" : "s"}
              </p>
              <ul className="space-y-1 text-sm">
                {encontradas.map((linea) => (
                  <li key={linea.producto.id} className="flex justify-between gap-2">
                    <span className="font-mono text-trade-gray-900">
                      {linea.producto.referencia} × {linea.cantidad}
                    </span>
                    <span className="text-trade-gray-500">
                      {formateadorEUR.format(linea.producto.precioTarifa * linea.cantidad)}
                    </span>
                  </li>
                ))}
              </ul>
              <button
                type="button"
                onClick={añadirTodoAlCarrito}
                className="mt-3 rounded-md bg-trade-red px-4 py-2 text-sm font-medium text-trade-white hover:bg-trade-red-dark"
              >
                Añadir todo al carrito
              </button>
            </div>
          )}

          {noEncontradas.length > 0 && (
            <div>
              <p className="mb-2 text-sm font-medium text-trade-amber">
                {noEncontradas.length} línea{noEncontradas.length === 1 ? "" : "s"} sin identificar
              </p>
              <ul className="space-y-1 font-mono text-sm text-trade-gray-500">
                {noEncontradas.map((linea) => (
                  <li key={linea.textoOriginal}>{linea.textoOriginal}</li>
                ))}
              </ul>
              <p className="mt-1 text-xs text-trade-gray-500">
                Revisa la referencia o{" "}
                <a href="/contacto" className="text-trade-red hover:underline">
                  escríbenos
                </a>{" "}
                y te la confirmamos.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
