import type { Metadata } from "next";
import { siteConfig } from "@/config/site";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { FormularioOferta } from "@/components/leads/formulario-oferta";
import { breadcrumbJsonLd } from "@/lib/seo/schema";

export const metadata: Metadata = {
  title: "Contacto",
  description: `${siteConfig.razonSocial} — ${siteConfig.direccion.calle}, ${siteConfig.direccion.localidad} (${siteConfig.direccion.provincia}). ${siteConfig.contacto.telefono}.`,
  alternates: { canonical: "/contacto" },
};

export default async function ContactoPage({
  searchParams,
}: {
  searchParams: Promise<{ referencia?: string }>;
}) {
  const { referencia } = await searchParams;
  const migas = [{ nombre: "Contacto", url: "/contacto" }];

  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-10 sm:px-6">
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd(migas)) }}
      />
      <Breadcrumbs items={migas} />

      <h1 className="mt-2 text-3xl font-heading font-semibold text-trade-gray-900">Contacto</h1>

      <div className="mt-8 grid grid-cols-1 gap-10 lg:grid-cols-2">
        <div className="space-y-6 text-sm">
          <div>
            <h2 className="mb-1 font-heading text-lg font-semibold text-trade-gray-900">
              {siteConfig.razonSocial}
            </h2>
            <p className="text-trade-gray-500">
              {siteConfig.direccion.calle}
              <br />
              {siteConfig.direccion.codigoPostal} {siteConfig.direccion.localidad} (
              {siteConfig.direccion.provincia})
            </p>
          </div>
          <div>
            <p>
              <a href={`tel:${siteConfig.contacto.telefonoInternacional}`} className="font-medium text-trade-gray-900 hover:underline">
                {siteConfig.contacto.telefono}
              </a>
            </p>
            <p>
              <a href={`mailto:${siteConfig.contacto.email}`} className="text-trade-gray-500 hover:underline">
                {siteConfig.contacto.email}
              </a>
            </p>
          </div>
          <p className="text-trade-gray-500">{siteConfig.horario.texto}</p>
        </div>

        <div className="rounded-lg border border-trade-gray-200 p-6">
          <h2 className="mb-4 text-lg font-heading font-semibold text-trade-gray-900">
            {referencia ? "Solicitar oferta" : "Escríbenos"}
          </h2>
          <FormularioOferta referencia={referencia} />
        </div>
      </div>
    </div>
  );
}
