"use client";

import { useActionState } from "react";
import { iniciarSesionAction } from "@/lib/auth/actions";
import { SubmitButton } from "@/components/leads/submit-button";
import type { EstadoFormulario } from "@/lib/leads/actions";

const ESTADO_INICIAL: EstadoFormulario = { ok: false, mensaje: "" };

export function FormularioLogin() {
  const [estado, formAction] = useActionState(iniciarSesionAction, ESTADO_INICIAL);

  return (
    <form action={formAction} className="space-y-4">
      <div>
        <label htmlFor="email" className="mb-1 block text-sm font-medium text-trade-gray-900">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          className="w-full rounded-md border border-trade-gray-200 px-3 py-2 text-sm"
        />
      </div>
      <div>
        <label htmlFor="password" className="mb-1 block text-sm font-medium text-trade-gray-900">
          Contraseña
        </label>
        <input
          id="password"
          name="password"
          type="password"
          required
          className="w-full rounded-md border border-trade-gray-200 px-3 py-2 text-sm"
        />
      </div>
      {!estado.ok && estado.mensaje && <p className="text-sm text-trade-red">{estado.mensaje}</p>}
      <SubmitButton>Iniciar sesión</SubmitButton>
      <p className="rounded-md bg-trade-gray-050 p-3 text-xs text-trade-gray-500">
        Cuentas de demostración (contraseña <span className="font-mono">demo1234</span>):{" "}
        <span className="font-mono">compras@clientedemo.es</span> (comprador),{" "}
        <span className="font-mono">aprobador@clientedemo.es</span> (aprobador),{" "}
        <span className="font-mono">admin@grupotrade.es</span> (admin, panel de insights).
      </p>
    </form>
  );
}
