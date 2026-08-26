"use client";

import { useActionState } from "react";
import { enviarLeadServicio, type EstadoFormulario } from "@/lib/leads/actions";
import { SubmitButton } from "@/components/leads/submit-button";

const ESTADO_INICIAL: EstadoFormulario = { ok: false, mensaje: "" };

export function FormularioServicio({
  tipo,
  placeholderMensaje,
}: {
  tipo: "asesoramiento" | "mantenimiento";
  placeholderMensaje: string;
}) {
  const accionConTipo = enviarLeadServicio.bind(null, tipo);
  const [estado, formAction] = useActionState(accionConTipo, ESTADO_INICIAL);

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

      <div>
        <label htmlFor="mensaje" className="mb-1 block text-sm font-medium text-trade-gray-900">
          Cuéntanos qué necesitas *
        </label>
        <textarea
          id="mensaje"
          name="mensaje"
          required
          rows={4}
          placeholder={placeholderMensaje}
          className="w-full rounded-md border border-trade-gray-200 px-3 py-2 text-sm"
        />
      </div>

      {!estado.ok && estado.mensaje && <p className="text-sm text-trade-red">{estado.mensaje}</p>}

      <SubmitButton>Enviar solicitud</SubmitButton>
    </form>
  );
}
