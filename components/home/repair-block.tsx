import Link from "next/link";
import { siteConfig } from "@/config/site";

export function RepairBlock() {
  return (
    <section className="bg-trade-ink text-trade-white">
      <div className="mx-auto max-w-5xl px-4 py-16 text-center sm:px-6">
        <h2 className="text-2xl font-heading font-semibold sm:text-3xl">
          ¿Se ha parado la máquina? Repáralo, no lo tires.
        </h2>
        <p className="mx-auto mt-3 max-w-2xl text-white/70">
          Reparamos variadores, motores y equipos de otras marcas. Diagnóstico, presupuesto
          cerrado antes de intervenir e informe técnico de reparación al entregarlo.
        </p>
        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/servicios/reparacion-industrial"
            className="rounded-md bg-trade-red px-5 py-3 text-sm font-medium hover:bg-trade-red-dark"
          >
            Solicitar diagnóstico
          </Link>
          <a
            href={`tel:${siteConfig.contacto.telefonoInternacional}`}
            className="rounded-md border border-white/30 px-5 py-3 text-sm font-medium hover:border-white/60"
          >
            Llamar al {siteConfig.contacto.telefono}
          </a>
        </div>
      </div>
    </section>
  );
}
