"use client";

import { useActionState } from "react";
import { solicitarPresupuestoAction } from "@/lib/cuenta/presupuestos-actions";
import { SubmitButton } from "@/components/leads/submit-button";
import { ESTADO_INICIAL_FORMULARIO } from "@/lib/formularios/estado-inicial";

export function FormularioPresupuesto() {
  const [estado, formAction] = useActionState(solicitarPresupuestoAction, ESTADO_INICIAL_FORMULARIO);

  return (
    <form action={formAction} className="space-y-3 rounded-lg border border-trade-gray-200 p-4">
      <div>
        <label htmlFor="referencias" className="mb-1 block text-sm font-medium text-trade-gray-900">
          Referencias o descripción de lo que necesitas *
        </label>
        <textarea
          id="referencias"
          name="referencias"
          required
          rows={4}
          placeholder={"6205ZZ x 50\nACS580-01-062A-4 x 2"}
          className="w-full rounded-md border border-trade-gray-200 px-3 py-2 font-mono text-sm"
        />
      </div>
      <div>
        <label htmlFor="mensaje" className="mb-1 block text-sm font-medium text-trade-gray-900">
          Comentarios (opcional)
        </label>
        <textarea
          id="mensaje"
          name="mensaje"
          rows={2}
          className="w-full rounded-md border border-trade-gray-200 px-3 py-2 text-sm"
        />
      </div>
      {estado.mensaje && (
        <p className={"text-sm " + (estado.ok ? "text-trade-green" : "text-trade-red")}>{estado.mensaje}</p>
      )}
      <SubmitButton>Solicitar presupuesto</SubmitButton>
    </form>
  );
}
