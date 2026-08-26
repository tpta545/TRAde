"use client";

export function BotonImprimir() {
  return (
    <button
      type="button"
      onClick={() => window.print()}
      className="rounded-md border border-trade-gray-200 px-4 py-2 text-sm font-medium text-trade-gray-900 hover:bg-trade-gray-050"
    >
      Guardar confirmación (PDF)
    </button>
  );
}
