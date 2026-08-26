"use client";

import { useActionState, useEffect } from "react";
import { enviarLeadReparacion, type EstadoFormulario } from "@/lib/leads/actions";
import { SubmitButton } from "@/components/leads/submit-button";
import { trackEvent } from "@/lib/analitica/eventos";

const ESTADO_INICIAL: EstadoFormulario = { ok: false, mensaje: "" };

export function FormularioReparacion() {
  const [estado, formAction] = useActionState(enviarLeadReparacion, ESTADO_INICIAL);

  useEffect(() => {
    if (estado.ok) trackEvent("repair_lead");
  }, [estado.ok]);

  if (estado.ok) {
    return (
      <div className="rounded-lg bg-trade-gray-050 p-6 text-trade-gray-900">
        <p className="font-medium">{estado.mensaje}</p>
      </div>
    );
  }

  return (
    <form action={formAction} className="space-y-4">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="marca" className="mb-1 block text-sm font-medium text-trade-gray-900">
            Marca *
          </label>
          <input
            id="marca"
            name="marca"
            required
            className="w-full rounded-md border border-trade-gray-200 px-3 py-2 text-sm"
          />
        </div>
        <div>
          <label htmlFor="modelo" className="mb-1 block text-sm font-medium text-trade-gray-900">
            Modelo *
          </label>
          <input
            id="modelo"
            name="modelo"
            required
            className="w-full rounded-md border border-trade-gray-200 px-3 py-2 text-sm"
          />
        </div>
      </div>

      <div>
        <label htmlFor="numeroSerie" className="mb-1 block text-sm font-medium text-trade-gray-900">
          Nº de serie (si lo tienes a mano)
        </label>
        <input
          id="numeroSerie"
          name="numeroSerie"
          className="w-full rounded-md border border-trade-gray-200 px-3 py-2 text-sm"
        />
      </div>

      <div>
        <label htmlFor="foto" className="mb-1 block text-sm font-medium text-trade-gray-900">
          Foto de la placa de características
        </label>
        <input
          id="foto"
          name="foto"
          type="file"
          accept="image/*"
          className="w-full text-sm text-trade-gray-500 file:mr-3 file:rounded-md file:border-0 file:bg-trade-gray-050 file:px-3 file:py-2 file:text-sm file:font-medium"
        />
      </div>

      <div>
        <label htmlFor="averia" className="mb-1 block text-sm font-medium text-trade-gray-900">
          ¿Qué le pasa? *
        </label>
        <textarea
          id="averia"
          name="averia"
          required
          rows={4}
          className="w-full rounded-md border border-trade-gray-200 px-3 py-2 text-sm"
        />
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
      </div>

      {!estado.ok && estado.mensaje && <p className="text-sm text-trade-red">{estado.mensaje}</p>}

      <SubmitButton>Solicitar diagnóstico</SubmitButton>
    </form>
  );
}
