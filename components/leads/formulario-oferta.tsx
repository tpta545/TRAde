"use client";

import { useActionState, useEffect } from "react";
import { enviarLeadOferta, type EstadoFormulario } from "@/lib/leads/actions";
import { SubmitButton } from "@/components/leads/submit-button";
import { trackEvent } from "@/lib/analitica/eventos";

const ESTADO_INICIAL: EstadoFormulario = { ok: false, mensaje: "" };

export function FormularioOferta({ referencia }: { referencia?: string }) {
  const [estado, formAction] = useActionState(enviarLeadOferta, ESTADO_INICIAL);

  useEffect(() => {
    if (estado.ok) trackEvent("quote_requested", { referencia });
  }, [estado.ok, referencia]);

  if (estado.ok) {
    return (
      <div className="rounded-lg bg-trade-gray-050 p-6 text-trade-gray-900">
        <p className="font-medium">{estado.mensaje}</p>
      </div>
    );
  }

  return (
    <form action={formAction} className="space-y-4">
      {referencia && (
        <div className="rounded-md bg-trade-gray-050 px-3 py-2 text-sm">
          Referencia: <span className="font-mono text-trade-gray-900">{referencia}</span>
          <input type="hidden" name="referencia" value={referencia} />
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="nombre" className="mb-1 block text-sm font-medium text-trade-gray-900">
            Nombre *
          </label>
          <input
            id="nombre"
            name="nombre"
            required
            className="w-full rounded-md border border-trade-gray-200 px-3 py-2 text-sm"
          />
        </div>
        <div>
          <label htmlFor="empresa" className="mb-1 block text-sm font-medium text-trade-gray-900">
            Empresa *
          </label>
          <input
            id="empresa"
            name="empresa"
            required
            className="w-full rounded-md border border-trade-gray-200 px-3 py-2 text-sm"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="telefono" className="mb-1 block text-sm font-medium text-trade-gray-900">
            Teléfono *
          </label>
          <input
            id="telefono"
            name="telefono"
            type="tel"
            required
            className="w-full rounded-md border border-trade-gray-200 px-3 py-2 text-sm"
          />
        </div>
        <div>
          <label htmlFor="cantidad" className="mb-1 block text-sm font-medium text-trade-gray-900">
            Cantidad aproximada
          </label>
          <input
            id="cantidad"
            name="cantidad"
            className="w-full rounded-md border border-trade-gray-200 px-3 py-2 text-sm"
          />
        </div>
      </div>

      <div>
        <label htmlFor="email" className="mb-1 block text-sm font-medium text-trade-gray-900">
          Email (opcional)
        </label>
        <input
          id="email"
          name="email"
          type="email"
          className="w-full rounded-md border border-trade-gray-200 px-3 py-2 text-sm"
        />
      </div>

      <div>
        <label htmlFor="mensaje" className="mb-1 block text-sm font-medium text-trade-gray-900">
          Comentarios
        </label>
        <textarea
          id="mensaje"
          name="mensaje"
          rows={3}
          className="w-full rounded-md border border-trade-gray-200 px-3 py-2 text-sm"
        />
      </div>

      {!estado.ok && estado.mensaje && <p className="text-sm text-trade-red">{estado.mensaje}</p>}

      <SubmitButton>Solicitar oferta</SubmitButton>
    </form>
  );
}
