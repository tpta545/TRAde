"use client";

import { useTransition } from "react";
import { aprobarPedidoAction, rechazarPedidoAction } from "@/lib/pedidos/aprobacion-actions";

export function AprobacionBotones({ pedidoId }: { pedidoId: string }) {
  const [pendiente, iniciarTransicion] = useTransition();

  return (
    <div className="flex gap-2">
      <button
        type="button"
        disabled={pendiente}
        onClick={() => iniciarTransicion(() => rechazarPedidoAction(pedidoId))}
        className="rounded-md border border-trade-gray-200 px-3 py-1.5 text-xs font-medium text-trade-gray-900 hover:bg-trade-gray-050 disabled:opacity-50"
      >
        Rechazar
      </button>
      <button
        type="button"
        disabled={pendiente}
        onClick={() => iniciarTransicion(() => aprobarPedidoAction(pedidoId))}
        className="rounded-md bg-trade-red px-3 py-1.5 text-xs font-medium text-trade-white hover:bg-trade-red-dark disabled:opacity-50"
      >
        Aprobar
      </button>
    </div>
  );
}
