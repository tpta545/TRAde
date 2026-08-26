"use client";

import { useActionState } from "react";
import { enviarBusquedaSinResultados, type EstadoFormulario } from "@/lib/leads/actions";
import { SubmitButton } from "@/components/leads/submit-button";

const ESTADO_INICIAL: EstadoFormulario = { ok: false, mensaje: "" };

export function FormularioBusquedaSinResultados({ consulta }: { consulta: string }) {
  const [estado, formAction] = useActionState(enviarBusquedaSinResultados, ESTADO_INICIAL);

  if (estado.ok) {
    return <p className="rounded-md bg-trade-gray-050 p-4 text-sm text-trade-gray-900">{estado.mensaje}</p>;
  }

  return (
    <form action={formAction} className="space-y-3 rounded-md border border-trade-gray-200 p-4">
      <input type="hidden" name="consulta" value={consulta} />
      <p className="text-sm font-medium text-trade-gray-900">
        No encontramos &ldquo;{consulta}&rdquo;. Escríbenos la referencia y te decimos en 1 hora si la
        tenemos.
      </p>
      <input
        type="tel"
        name="telefono"
        required
        placeholder="Tu teléfono"
        className="w-full rounded-md border border-trade-gray-200 px-3 py-2 text-sm"
      />
      <input
        type="email"
        name="email"
        placeholder="Email (opcional)"
        className="w-full rounded-md border border-trade-gray-200 px-3 py-2 text-sm"
      />
      {!estado.ok && estado.mensaje && <p className="text-sm text-trade-red">{estado.mensaje}</p>}
      <SubmitButton>Avísame si la tenéis</SubmitButton>
    </form>
  );
}
