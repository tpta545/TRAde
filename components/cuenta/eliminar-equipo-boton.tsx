"use client";

import { useTransition } from "react";
import { eliminarEquipoAction } from "@/lib/cuenta/equipos-actions";

export function EliminarEquipoBoton({ equipoId }: { equipoId: string }) {
  const [pendiente, iniciarTransicion] = useTransition();
  return (
    <button
      type="button"
      disabled={pendiente}
      onClick={() => iniciarTransicion(() => eliminarEquipoAction(equipoId))}
      className="text-xs text-trade-gray-500 hover:text-trade-red disabled:opacity-50"
    >
      Eliminar
    </button>
  );
}
