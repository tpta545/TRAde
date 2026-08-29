import Link from "next/link";
import { SearchOmnibox } from "@/components/layout/search-omnibox";
import { ImagenGenerada } from "@/components/media/imagen-generada";
import { Reveal } from "@/components/ui/reveal";
import { siteConfig } from "@/config/site";

const CHIPS_BUSQUEDA_RAPIDA = [
  { etiqueta: "Rodamientos", href: "/productos/rodamientos" },
  { etiqueta: "Motores", href: "/productos/motores-electricos" },
  { etiqueta: "Variadores", href: "/productos/variadores-de-frecuencia" },
  { etiqueta: "Neumática", href: "/productos/neumatica" },
  { etiqueta: "Arrancadores", href: "/productos/arrancadores-y-proteccion" },
];

export function Hero() {
  return (
    <section className="relative flex h-[62vh] min-h-[440px] items-center overflow-hidden bg-trade-ink text-trade-white sm:h-[62vh] max-sm:h-[78vh]">
      <div className="absolute inset-0">
        <ImagenGenerada
          id="hero-home"
          sizes="100vw"
          priority
          className="hero-kenburns object-cover motion-reduce:animate-none"
        />
        {/* Degradado izquierda→derecha para sostener el texto (Parte V.3, regla 5) */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(90deg, rgba(17,18,20,.92) 0%, rgba(17,18,20,.55) 55%, rgba(17,18,20,.25) 100%)",
          }}
        />
      </div>

      <div className="relative mx-auto w-full max-w-7xl px-4 sm:px-6">
        <div className="max-w-2xl">
          <Reveal>
            <h1 className="text-4xl font-heading font-semibold leading-[1.05] sm:text-5xl lg:text-6xl">
              El recambio industrial que necesitas hoy, mañana en tu planta.
            </h1>
          </Reveal>
          <Reveal delayMs={120}>
            <p className="mt-4 max-w-xl text-white/75">
              Distribuidor oficial de {siteConfig.marcas.join(", ")}. Stock propio en{" "}
              {siteConfig.direccion.localidad}, reparto propio en toda la Comunitat Valenciana y
              envío a toda España.
            </p>
          </Reveal>

          <Reveal delayMs={240} className="mt-8 max-w-xl">
            <SearchOmnibox tamano="lg" />
          </Reveal>

          <Reveal delayMs={360} className="mt-4 flex flex-wrap items-center gap-2">
            {CHIPS_BUSQUEDA_RAPIDA.map((chip) => (
              <Link
                key={chip.href}
                href={chip.href}
                className="rounded-full border border-white/20 px-3 py-1.5 text-sm text-white/80 transition-colors hover:border-white/40 hover:text-white"
              >
                {chip.etiqueta}
              </Link>
            ))}
          </Reveal>
        </div>
      </div>
    </section>
  );
}
