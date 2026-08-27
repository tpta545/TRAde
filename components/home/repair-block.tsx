import Link from "next/link";
import { ImagenGenerada } from "@/components/media/imagen-generada";
import { siteConfig } from "@/config/site";

export function RepairBlock() {
  return (
    <section className="bg-trade-ink text-trade-white">
      <div className="mx-auto grid max-w-7xl grid-cols-1 items-center md:grid-cols-2">
        <div className="px-4 py-16 sm:px-6 md:py-24">
          <h2 className="text-3xl font-heading font-semibold sm:text-4xl">
            ¿Se ha parado la máquina? Repáralo, no lo tires.
          </h2>
          <p className="mt-4 max-w-md text-white/70">
            Reparamos variadores, motores y equipos de otras marcas. Diagnóstico, presupuesto
            cerrado antes de intervenir e informe técnico de reparación al entregarlo.
          </p>
          <div className="mt-8">
            <Link
              href="/servicios/reparacion-industrial"
              className="inline-block rounded-md bg-trade-red px-6 py-3.5 text-sm font-semibold hover:bg-trade-red-dark"
            >
              Solicitar diagnóstico
            </Link>
          </div>
        </div>

        <div className="relative h-64 md:h-full md:min-h-[420px]">
          <ImagenGenerada
            id="hero-reparacion"
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover"
          />
          <div
            className="absolute inset-0 md:hidden"
            style={{ background: "linear-gradient(0deg, rgba(17,18,20,.6) 0%, rgba(17,18,20,0) 40%)" }}
          />
        </div>
      </div>
    </section>
  );
}
