import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { getArticuloPorSlug, getTodosLosArticulos } from "@/lib/data/blog";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { markdownBasicoAHtml } from "@/lib/utils/markdown-basico";
import { breadcrumbJsonLd } from "@/lib/seo/schema";
import { siteConfig } from "@/config/site";

export const revalidate = 3600;

const CATEGORIA_A_FAMILIA: Record<string, string> = {
  "Motores eléctricos": "motores-electricos",
  Rodamientos: "rodamientos",
  "Variadores de frecuencia": "variadores-de-frecuencia",
};

export async function generateStaticParams() {
  const articulos = await getTodosLosArticulos();
  return articulos.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const articulo = await getArticuloPorSlug(slug);
  if (!articulo) return {};
  return {
    title: articulo.titulo,
    description: articulo.resumen,
    alternates: { canonical: `/blog/${slug}` },
  };
}

export default async function ArticuloPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const articulo = await getArticuloPorSlug(slug);
  if (!articulo) notFound();

  const migas = [
    { nombre: "Blog", url: "/blog" },
    { nombre: articulo.titulo, url: `/blog/${slug}` },
  ];

  const familiaRelacionada = CATEGORIA_A_FAMILIA[articulo.categoria];

  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: articulo.titulo,
    description: articulo.resumen,
    datePublished: articulo.fechaPublicacion,
    author: { "@type": "Organization", name: siteConfig.razonSocial },
  };

  return (
    <div className="mx-auto w-full max-w-2xl px-4 py-10 sm:px-6">
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd(migas)) }}
      />
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />

      <Breadcrumbs items={migas.slice(1)} />
      <p className="mt-4 text-xs font-medium uppercase tracking-wide text-trade-red">
        {articulo.categoria}
      </p>
      <h1 className="mt-1 text-3xl font-heading font-semibold text-trade-gray-900">{articulo.titulo}</h1>
      <p className="mt-2 text-sm text-trade-gray-500">
        {new Date(articulo.fechaPublicacion).toLocaleDateString("es-ES", { dateStyle: "long" })}
      </p>

      <div
        className="prose-trade mt-8 space-y-4 text-sm leading-relaxed text-trade-gray-900 [&_h2]:mt-6 [&_h2]:font-heading [&_h2]:text-lg [&_h2]:font-semibold [&_strong]:font-semibold"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: markdownBasicoAHtml(articulo.contenido) }}
      />

      {familiaRelacionada && (
        <div className="mt-10 rounded-lg border border-trade-gray-200 p-5">
          <p className="text-sm text-trade-gray-900">
            ¿Buscas la pieza de la que habla este artículo?{" "}
            <Link href={`/productos/${familiaRelacionada}`} className="font-medium text-trade-red hover:underline">
              Ver catálogo →
            </Link>
          </p>
        </div>
      )}
    </div>
  );
}
