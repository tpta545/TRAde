import type { ReactNode } from "react";

/** Formulario corto sobre fondo negro (Parte V.3), franja de conversión antes de la FAQ. */
export function FormularioNegro({ titulo, children }: { titulo: string; children: ReactNode }) {
  return (
    <div className="bg-trade-ink">
      <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 md:py-16">
        <h2 className="mb-6 text-2xl font-heading font-semibold text-trade-white">{titulo}</h2>
        <div className="rounded-lg bg-trade-white p-6">{children}</div>
      </div>
    </div>
  );
}
