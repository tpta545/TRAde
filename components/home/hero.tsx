import Link from "next/link";
import { SearchOmnibox } from "@/components/layout/search-omnibox";
import { siteConfig } from "@/config/site";

const CHIPS_BUSQUEDA_RAPIDA = [
  { etiqueta: "Rodamientos", href: "/productos/rodamientos" },
  { etiqueta: "Motores", href: "/productos/motores-electricos" },
  { etiqueta: "Variadores", href: "/productos/variadores-de-frecuencia" },
  { etiqueta: "Neumática", href: "/productos/neumatica" },
];

export function Hero() {
  return (
    <section className="bg-trade-ink text-trade-white">
      {/* TODO: sustituir por foto real del almacén de Algemesí (Parte 6 / Parte D.3 del prompt). */}
      <div className="mx-auto max-w-5xl px-4 py-16 text-center sm:px-6 sm:py-24">
        <h1 className="text-3xl font-heading font-semibold leading-tight sm:text-5xl">
          El recambio industrial que necesitas hoy, mañana en tu planta.
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-white/70">
          Distribuidor oficial de {siteConfig.marcas.join(", ")}. Stock propio en{" "}
          {siteConfig.direccion.localidad}, reparto propio en toda la Comunitat Valenciana y
          envío a toda España.
        </p>

        <div className="mx-auto mt-8 max-w-xl">
          <SearchOmnibox tamano="lg" />
        </div>

        <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
          {CHIPS_BUSQUEDA_RAPIDA.map((chip) => (
            <Link
              key={chip.href}
              href={chip.href}
              className="rounded-full border border-white/20 px-3 py-1.5 text-sm text-white/80 hover:border-white/40 hover:text-white"
            >
              {chip.etiqueta}
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
