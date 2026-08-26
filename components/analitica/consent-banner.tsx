"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  CONSENTIMIENTO_ACEPTADO,
  CONSENTIMIENTO_DENEGADO,
  actualizarConsentimiento,
  leerConsentimientoGuardado,
} from "@/lib/analitica/consent";

/**
 * Banner de cookies conforme a Consent Mode v2 / AEPD: rechazar es tan
 * fácil como aceptar (mismo nivel visual, un solo clic, sin dark patterns).
 * No carga ningún script de analítica hasta que el usuario decide; ver
 * lib/analitica/gtag-script.tsx para el arranque con consentimiento
 * denegado por defecto.
 */
export function ConsentBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setVisible(leerConsentimientoGuardado() === null);
  }, []);

  if (!visible) return null;

  const decidir = (aceptar: boolean) => {
    actualizarConsentimiento(aceptar ? CONSENTIMIENTO_ACEPTADO : CONSENTIMIENTO_DENEGADO);
    setVisible(false);
  };

  return (
    <div
      role="dialog"
      aria-label="Preferencias de cookies"
      className="fixed inset-x-0 bottom-0 z-50 border-t border-trade-gray-200 bg-trade-white px-4 py-4 shadow-[0_-4px_16px_rgba(0,0,0,0.08)] sm:px-6"
    >
      <div className="mx-auto flex max-w-5xl flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <p className="max-w-2xl text-sm text-trade-gray-500">
          Usamos cookies propias imprescindibles y, si aceptas, cookies de analítica para medir
          las visitas. Puedes cambiar tu decisión cuando quieras en{" "}
          <Link href="/legal/cookies" className="font-medium text-trade-gray-900 hover:underline">
            Política de cookies
          </Link>
          .
        </p>
        <div className="flex shrink-0 gap-2">
          <button
            type="button"
            onClick={() => decidir(false)}
            className="rounded-md border border-trade-gray-200 px-4 py-2 text-sm font-medium text-trade-gray-900 hover:bg-trade-gray-050"
          >
            Rechazar
          </button>
          <button
            type="button"
            onClick={() => decidir(true)}
            className="rounded-md bg-trade-red px-4 py-2 text-sm font-medium text-trade-white hover:bg-trade-red-dark"
          >
            Aceptar
          </button>
        </div>
      </div>
    </div>
  );
}
