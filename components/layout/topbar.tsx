"use client";

import Link from "next/link";
import { siteConfig } from "@/config/site";
import { useIva } from "@/lib/context/iva-context";

export function Topbar() {
  const { ivaIncluido, toggleIva } = useIva();

  return (
    <div className="hidden bg-trade-ink text-trade-white sm:block">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-1.5 text-xs sm:px-6">
        <p>
          <a href={`tel:${siteConfig.contacto.telefonoInternacional}`} className="font-medium hover:underline">
            {siteConfig.contacto.telefono}
          </a>
          {" · "}
          Pedidos antes de las {siteConfig.comercio.horaCorteEnvioMismoDia}, entrega mañana
          {" · "}
          {siteConfig.direccion.localidad} ({siteConfig.direccion.provincia})
        </p>
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={toggleIva}
            className="flex items-center gap-1.5 rounded-full border border-white/20 px-2.5 py-1 hover:border-white/40"
            aria-pressed={ivaIncluido}
          >
            <span className={ivaIncluido ? "text-trade-white" : "text-white/50"}>IVA incluido</span>
          </button>
          <Link href="/cuenta" className="hover:underline">
            Mi cuenta
          </Link>
        </div>
      </div>
    </div>
  );
}
