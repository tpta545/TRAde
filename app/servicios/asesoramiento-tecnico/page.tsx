import type { Metadata } from "next";
import { siteConfig } from "@/config/site";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { FormularioServicio } from "@/components/leads/formulario-servicio";
import { breadcrumbJsonLd } from "@/lib/seo/schema";

export const metadata: Metadata = {
  title: "Asesoramiento técnico y equivalencias",
  description:
    "Dinos qué pieza monta tu máquina y te decimos cuál te va, aunque no sea de las marcas que distribuimos.",
  alternates: { canonical: "/servicios/asesoramiento-tecnico" },
};

export default function AsesoramientoTecnicoPage() {
  const migas = [{ nombre: "Asesoramiento técnico", url: "/servicios/asesoramiento-tecnico" }];

  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-10 sm:px-6">
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd(migas)) }}
      />
      <Breadcrumbs items={migas} />

      <h1 className="mt-2 text-3xl font-heading font-semibold text-trade-gray-900 sm:text-4xl">
        Asesoramiento técnico y equivalencias
      </h1>
      <p className="mt-3 max-w-2xl text-trade-gray-500">
        Dinos qué rodamiento, motor o variador monta tu máquina y te decimos cuál le va —
        aunque no sea de las marcas que distribuimos. Es el trabajo del mostrador de toda la
        vida, ahora también online.
      </p>

      <a
        href={`tel:${siteConfig.contacto.telefonoInternacional}`}
        className="mt-6 inline-block rounded-md bg-trade-ink px-5 py-3 text-sm font-medium text-trade-white hover:bg-trade-graphite"
      >
        Llamar al {siteConfig.contacto.telefono}
      </a>

      <div className="mt-12 max-w-xl rounded-lg border border-trade-gray-200 p-6">
        <h2 className="mb-4 text-lg font-heading font-semibold text-trade-gray-900">
          Cuéntanos qué necesitas
        </h2>
        <FormularioServicio
          tipo="asesoramiento"
          placeholderMensaje="Ej: necesito la equivalencia de un rodamiento SKF 6205-2RS1 que llevamos montado en una cinta transportadora."
        />
      </div>
    </div>
  );
}
