import type { Metadata } from "next";
import { siteConfig } from "@/config/site";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { FormularioServicio } from "@/components/leads/formulario-servicio";
import { breadcrumbJsonLd } from "@/lib/seo/schema";

export const metadata: Metadata = {
  title: "Mantenimiento y stock gestionado",
  description:
    "Acordamos contigo un stock mínimo de tus referencias críticas en nuestro almacén de Algemesí, para que una avería nunca dependa de un plazo de fabricante.",
  alternates: { canonical: "/servicios/mantenimiento-y-stock-gestionado" },
};

export default function MantenimientoYStockGestionadoPage() {
  const migas = [
    { nombre: "Mantenimiento y stock gestionado", url: "/servicios/mantenimiento-y-stock-gestionado" },
  ];

  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-10 sm:px-6">
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd(migas)) }}
      />
      <Breadcrumbs items={migas} />

      <h1 className="mt-2 text-3xl font-heading font-semibold text-trade-gray-900 sm:text-4xl">
        Mantenimiento y stock gestionado
      </h1>
      <p className="mt-3 max-w-2xl text-trade-gray-500">
        Para plantas con recambios críticos que no se pueden permitir esperar: acordamos
        contigo un stock mínimo de tus referencias habituales en nuestro almacén de{" "}
        {siteConfig.direccion.localidad}, con reposición automática antes de que se agote.
      </p>

      <a
        href={`tel:${siteConfig.contacto.telefonoInternacional}`}
        className="mt-6 inline-block rounded-md bg-trade-ink px-5 py-3 text-sm font-medium text-trade-white hover:bg-trade-graphite"
      >
        Llamar al {siteConfig.contacto.telefono}
      </a>

      <div className="mt-12 max-w-xl rounded-lg border border-trade-gray-200 p-6">
        <h2 className="mb-4 text-lg font-heading font-semibold text-trade-gray-900">
          Cuéntanos tu instalación
        </h2>
        <FormularioServicio
          tipo="mantenimiento"
          placeholderMensaje="Ej: tenemos 6 motores WEG de 7,5 kW en la línea de envasado y queremos tener siempre un rodamiento y un motor de repuesto en vuestro almacén."
        />
      </div>
    </div>
  );
}
