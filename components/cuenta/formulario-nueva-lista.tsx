"use client";

import { useActionState } from "react";
import { crearListaAction } from "@/lib/cuenta/listas-actions";
import { SubmitButton } from "@/components/leads/submit-button";
import { ESTADO_INICIAL_FORMULARIO } from "@/lib/formularios/estado-inicial";

export function FormularioNuevaLista() {
  const [estado, formAction] = useActionState(crearListaAction, ESTADO_INICIAL_FORMULARIO);

  return (
    <form action={formAction} className="space-y-3 rounded-lg border border-trade-gray-200 p-4">
      <div>
        <label htmlFor="nombre" className="mb-1 block text-sm font-medium text-trade-gray-900">
          Nombre de la lista
        </label>
        <input
          id="nombre"
          name="nombre"
          required
          placeholder="Ej: Línea 2 – recambios"
          className="w-full rounded-md border border-trade-gray-200 px-3 py-2 text-sm"
        />
      </div>
      <div>
        <label htmlFor="referencias" className="mb-1 block text-sm font-medium text-trade-gray-900">
          Referencias (una por línea, REFERENCIA;CANTIDAD)
        </label>
        <textarea
          id="referencias"
          name="referencias"
          rows={5}
          placeholder={"6205ZZ;10\nUCP205;4"}
          className="w-full rounded-md border border-trade-gray-200 px-3 py-2 font-mono text-sm"
        />
      </div>
      {estado.mensaje && (
        <p className={"text-sm " + (estado.ok ? "text-trade-green" : "text-trade-red")}>{estado.mensaje}</p>
      )}
      <SubmitButton>Crear lista</SubmitButton>
    </form>
  );
}
