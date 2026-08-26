"use client";

import { useActionState } from "react";
import { suscribirNewsletterAction } from "@/lib/leads/newsletter-action";
import { ESTADO_INICIAL_FORMULARIO } from "@/lib/formularios/estado-inicial";

export function FormularioNewsletter() {
  const [estado, formAction] = useActionState(suscribirNewsletterAction, ESTADO_INICIAL_FORMULARIO);

  if (estado.ok) {
    return <p className="text-sm text-trade-gray-900">{estado.mensaje}</p>;
  }

  return (
    <form action={formAction} className="flex flex-col gap-2 sm:flex-row">
      <input
        type="email"
        name="email"
        required
        placeholder="tu@empresa.com"
        className="w-full rounded-md border border-trade-gray-200 px-3 py-2 text-sm sm:w-64"
      />
      <button
        type="submit"
        className="shrink-0 rounded-md bg-trade-red px-4 py-2 text-sm font-medium text-trade-white hover:bg-trade-red-dark"
      >
        Suscribirme
      </button>
      {!estado.ok && estado.mensaje && <p className="text-sm text-trade-red">{estado.mensaje}</p>}
    </form>
  );
}
