"use client";

import { useActionState } from "react";
import { crearEquipoAction } from "@/lib/cuenta/equipos-actions";
import { SubmitButton } from "@/components/leads/submit-button";
import { ESTADO_INICIAL_FORMULARIO } from "@/lib/formularios/estado-inicial";

export function FormularioEquipo() {
  const [estado, formAction] = useActionState(crearEquipoAction, ESTADO_INICIAL_FORMULARIO);

  return (
    <form action={formAction} className="grid grid-cols-1 gap-3 rounded-lg border border-trade-gray-200 p-4 sm:grid-cols-2">
      <input
        name="nombre"
        required
        placeholder="Nombre del equipo (ej: Cinta línea 2)"
        className="rounded-md border border-trade-gray-200 px-3 py-2 text-sm sm:col-span-2"
      />
      <input name="marca" placeholder="Marca del motor/variador" className="rounded-md border border-trade-gray-200 px-3 py-2 text-sm" />
      <input name="modelo" placeholder="Modelo / referencia" className="rounded-md border border-trade-gray-200 px-3 py-2 text-sm" />
      <input name="ubicacion" placeholder="Ubicación en planta" className="rounded-md border border-trade-gray-200 px-3 py-2 text-sm sm:col-span-2" />
      {estado.mensaje && (
        <p className={"sm:col-span-2 text-sm " + (estado.ok ? "text-trade-green" : "text-trade-red")}>
          {estado.mensaje}
        </p>
      )}
      <div className="sm:col-span-2">
        <SubmitButton>Registrar equipo</SubmitButton>
      </div>
    </form>
  );
}
