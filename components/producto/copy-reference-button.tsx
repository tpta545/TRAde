"use client";

import { useState } from "react";
import { Copy, Check } from "lucide-react";

export function CopyReferenceButton({ referencia }: { referencia: string }) {
  const [copiado, setCopiado] = useState(false);

  const copiar = async () => {
    try {
      await navigator.clipboard.writeText(referencia);
      setCopiado(true);
      setTimeout(() => setCopiado(false), 1500);
    } catch {
      // Portapapeles no disponible: el usuario puede seleccionar el texto a mano.
    }
  };

  return (
    <button
      type="button"
      onClick={copiar}
      className="flex items-center gap-1 text-trade-gray-500 hover:text-trade-gray-900"
      aria-label="Copiar referencia"
    >
      {copiado ? <Check className="h-4 w-4 text-trade-green" /> : <Copy className="h-4 w-4" />}
    </button>
  );
}
