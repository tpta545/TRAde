"use client";

import { useActionState } from "react";
import { registrarCuentaAction } from "@/lib/auth/actions";
import { SubmitButton } from "@/components/leads/submit-button";
import type { EstadoFormulario } from "@/lib/leads/actions";

const ESTADO_INICIAL: EstadoFormulario = { ok: false, mensaje: "" };

export function FormularioRegistro() {
  const [estado, formAction] = useActionState(registrarCuentaAction, ESTADO_INICIAL);

  if (estado.ok) {
    return <p className="rounded-md bg-trade-gray-050 p-4 text-sm text-trade-gray-900">{estado.mensaje}</p>;
  }

  return (
    <form action={formAction} className="space-y-4">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Campo label="Tu nombre *" name="nombre" required />
        <Campo label="Empresa *" name="empresa" required />
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Campo label="CIF *" name="cif" required placeholder="B12345674" />
        <Campo label="Teléfono *" name="telefono" type="tel" required />
      </div>
      <Campo label="Email *" name="email" type="email" required />
      <Campo label="Contraseña *" name="password" type="password" required />
      {!estado.ok && estado.mensaje && <p className="text-sm text-trade-red">{estado.mensaje}</p>}
      <SubmitButton>Solicitar cuenta B2B</SubmitButton>
    </form>
  );
}

function Campo({
  label,
  name,
  type = "text",
  required,
  placeholder,
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
  placeholder?: string;
}) {
  return (
    <div>
      <label htmlFor={name} className="mb-1 block text-sm font-medium text-trade-gray-900">
        {label}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        required={required}
        placeholder={placeholder}
        className="w-full rounded-md border border-trade-gray-200 px-3 py-2 text-sm"
      />
    </div>
  );
}
