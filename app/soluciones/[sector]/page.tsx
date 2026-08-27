import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Package, ShieldCheck, Truck } from "lucide-react";
import { getSolucion, getTodasLasSoluciones } from "@/lib/data/soluciones";
import { getFamiliaInfo } from "@/lib/data/familias";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { siteConfig } from "@/config/site";
import { FormularioServicio } from "@/components/leads/formulario-servicio";
import { HeroServicio } from "@/components/servicios/hero-servicio";
import { PuntosPromesa } from "@/components/servicios/puntos-promesa";
import { FormularioNegro } from "@/components/servicios/formulario-negro";
import { FaqAccordion } from "@/components/ui/faq-accordion";
import { breadcrumbJsonLd } from "@/lib/seo/schema";

export async function generateStaticParams() {
  return getTodasLasSoluciones().map((s) => ({ sector: s.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ sector: string }>;
}): Promise<Metadata> {
  const { sector } = await params;
  const solucion = getSolucion(sector);
  if (!solucion) return {};
  return {
    title: solucion.nombre,
    description: solucion.resumen,
    alternates: { canonical: `/soluciones/${sector}` },
  };
}

export default async function SolucionSectorPage({
  params,
}: {
  params: Promise<{ sector: string }>;
}) {
  const { sector } = await params;
  const solucion = getSolucion(sector);
  if (!solucion) notFound();

  const migas = [{ nombre: "Soluciones por sector", url: "/soluciones" }, { nombre: solucion.nombre, url: `/soluciones/${sector}` }];

  return (
    <div>
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd(migas)) }}
      />

      <HeroServicio
        imagenId={`sector-${sector}`}
        titulo={solucion.nombre}
        subtitulo={solucion.resumen}
        cta={
          <a
            href={`tel:${siteConfig.contacto.telefonoInternacional}`}
            className="inline-block rounded-md bg-trade-red px-5 py-3 text-sm font-semibold text-trade-white hover:bg-trade-red-dark"
          >
            Hablar con un técnico: {siteConfig.contacto.telefono}
          </a>
        }
      />

      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        <Breadcrumbs items={migas} />
      </div>

      <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 md:py-16">
        <p className="text-sm leading-relaxed text-trade-gray-900">{solucion.contenido}</p>

        <div className="mt-8 flex flex-wrap gap-2">
          {solucion.familiasRelevantes.map((familiaSlug) => {
            const info = getFamiliaInfo(familiaSlug);
            return (
              <Link
                key={familiaSlug}
                href={`/productos/${familiaSlug}`}
                className="rounded-full border border-trade-gray-200 px-3 py-1.5 text-sm text-trade-gray-900 hover:border-trade-red"
              >
                {info.nombre} →
              </Link>
            );
          })}
        </div>
      </div>

      <PuntosPromesa
        puntos={[
          { icono: Package, titulo: "Stock real", descripcion: "Lo que ves en la ficha es lo que hay en el almacén." },
          { icono: Truck, titulo: "Reparto propio", descripcion: "Entrega en 24 h en toda la Comunitat Valenciana." },
          { icono: ShieldCheck, titulo: "Asesoramiento técnico", descripcion: "Te decimos qué pieza monta tu máquina, sin compromiso." },
        ]}
      />

      <FormularioNegro titulo="Cuéntanos tu instalación">
        <FormularioServicio
          tipo="asesoramiento"
          placeholderMensaje={`Ej: tenemos una línea en ${solucion.nombre.toLowerCase()} y queremos revisar qué referencias mantener en stock.`}
        />
      </FormularioNegro>

      <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 md:py-16">
        <h2 className="mb-4 text-xl font-heading font-semibold text-trade-gray-900">Preguntas frecuentes</h2>
        <FaqAccordion items={solucion.faq} />
      </div>
    </div>
  );
}
