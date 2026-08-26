import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { getSolucion, getTodasLasSoluciones } from "@/lib/data/soluciones";
import { getFamiliaInfo } from "@/lib/data/familias";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { siteConfig } from "@/config/site";

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
    <div className="mx-auto w-full max-w-3xl px-4 py-10 sm:px-6">
      <Breadcrumbs items={migas} />
      <h1 className="mt-2 text-3xl font-heading font-semibold text-trade-gray-900">{solucion.nombre}</h1>
      <p className="mt-3 text-trade-gray-500">{solucion.resumen}</p>
      <p className="mt-6 text-sm leading-relaxed text-trade-gray-900">{solucion.contenido}</p>

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

      <a
        href={`tel:${siteConfig.contacto.telefonoInternacional}`}
        className="mt-8 inline-block rounded-md bg-trade-ink px-5 py-3 text-sm font-medium text-trade-white hover:bg-trade-graphite"
      >
        Hablar con un técnico: {siteConfig.contacto.telefono}
      </a>
    </div>
  );
}
