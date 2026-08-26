import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Phone } from "lucide-react";
import {
  getProductos,
  getProductoBySlug,
  getProductosPorIds,
  resolverEquivalencias,
} from "@/lib/data/productos";
import { getFamiliaInfo, getSubfamiliaInfo } from "@/lib/data/familias";
import { siteConfig } from "@/config/site";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { StockBadge } from "@/components/producto/stock-badge";
import { PriceBlock } from "@/components/producto/price-block";
import { AddToCart } from "@/components/producto/add-to-cart";
import { SpecTable } from "@/components/producto/spec-table";
import { DocumentList } from "@/components/producto/document-list";
import { EquivalenceTable } from "@/components/producto/equivalence-table";
import { ProductCard } from "@/components/producto/product-card";
import { CopyReferenceButton } from "@/components/producto/copy-reference-button";
import { breadcrumbJsonLd, productJsonLd } from "@/lib/seo/schema";

export const revalidate = 3600;

const FAMILIAS_REPARABLES = ["motores-electricos", "variadores-de-frecuencia", "arrancadores-y-proteccion"];

export async function generateStaticParams() {
  const productos = await getProductos();
  return productos.map((p) => ({ familia: p.familia, subfamilia: p.subfamilia, slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ familia: string; subfamilia: string; slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const producto = await getProductoBySlug(slug);
  if (!producto) return {};

  const disponibilidad =
    producto.stock > 0
      ? "En stock, envío en 24h."
      : `Bajo pedido, entrega en ${producto.plazoEntregaDias} días.`;
  const descripcion = `${producto.descripcionCorta} ${disponibilidad}`.slice(0, 160);

  return {
    title: `${producto.nombre} ${producto.referencia} | ${producto.marca}`,
    description: descripcion,
    alternates: {
      canonical: `/productos/${producto.familia}/${producto.subfamilia}/${producto.slug}`,
    },
  };
}

export default async function FichaProductoPage({
  params,
}: {
  params: Promise<{ familia: string; subfamilia: string; slug: string }>;
}) {
  const { familia, subfamilia, slug } = await params;
  const producto = await getProductoBySlug(slug);

  if (!producto || producto.familia !== familia || producto.subfamilia !== subfamilia) {
    notFound();
  }

  const familiaInfo = getFamiliaInfo(familia);
  const subfamiliaInfo = getSubfamiliaInfo(familia, subfamilia);
  const equivalencias = await resolverEquivalencias(producto);
  const relacionados = await getProductosPorIds([
    ...producto.alternativas,
    ...producto.accesorios,
    ...producto.recambios,
  ]);
  const esReparable = FAMILIAS_REPARABLES.includes(familia);

  const migas = [
    { nombre: "Productos", url: "/productos" },
    { nombre: familiaInfo.nombre, url: `/productos/${familia}` },
    { nombre: subfamiliaInfo.nombre, url: `/productos/${familia}/${subfamilia}` },
    { nombre: producto.referencia, url: `/productos/${familia}/${subfamilia}/${slug}` },
  ];

  const imagen = producto.imagenes[0];

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6">
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd(producto)) }}
      />
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd(migas)) }}
      />

      <Breadcrumbs items={migas.slice(1)} />

      <div className="mt-6 grid grid-cols-1 gap-10 lg:grid-cols-2">
        {/* Galería */}
        <div>
          <div className="aspect-square overflow-hidden rounded-lg border border-trade-gray-200 bg-trade-gray-050">
            <Image
              src={imagen?.url ?? "/productos/placeholder.svg"}
              alt={imagen?.alt ?? producto.nombre}
              width={800}
              height={800}
              className="h-full w-full object-cover"
              priority
            />
          </div>
        </div>

        {/* Compra */}
        <div className="space-y-5">
          <div>
            <div className="flex items-center gap-2">
              <Link
                href={`/marcas/${producto.marca.toLowerCase()}`}
                className="text-sm font-semibold uppercase tracking-wide text-trade-gray-500 hover:text-trade-gray-900"
              >
                {producto.marca}
              </Link>
            </div>
            <div className="mt-1 flex items-center gap-2">
              <p className="font-mono text-lg text-trade-gray-500">Ref. {producto.referencia}</p>
              <CopyReferenceButton referencia={producto.referencia} />
            </div>
            <h1 className="mt-1 text-2xl font-heading font-semibold text-trade-gray-900 sm:text-3xl">
              {producto.nombre}
            </h1>
          </div>

          <StockBadge producto={producto} />

          <PriceBlock precioTarifa={producto.precioTarifa} unidadVenta={producto.unidadVenta} />

          <AddToCart producto={producto} />

          <ul className="space-y-1 border-t border-trade-gray-200 pt-4 text-xs text-trade-gray-500">
            <li>
              {siteConfig.comercio.portesGratisDesde !== null
                ? `Envío gratis desde ${siteConfig.comercio.portesGratisDesde} €`
                : "Portes calculados en el carrito"}
            </li>
            <li>Devolución en 30 días</li>
            <li>Factura con IVA</li>
            <li>Pago con tarjeta o a 30 días con cuenta aprobada</li>
          </ul>

          <p className="flex items-center gap-2 text-sm text-trade-gray-900">
            <Phone className="h-4 w-4 text-trade-red" aria-hidden />
            ¿Dudas con esta referencia? Llámanos al{" "}
            <a href={`tel:${siteConfig.contacto.telefonoInternacional}`} className="font-medium hover:underline">
              {siteConfig.contacto.telefono}
            </a>
            . Te decimos si te encaja.
          </p>
        </div>
      </div>

      {/* Secciones a ancho completo, desplegadas (no tabs ocultos) */}
      <div className="mt-16 space-y-12 border-t border-trade-gray-200 pt-10">
        <section>
          <h2 className="mb-4 text-xl font-heading font-semibold text-trade-gray-900">
            Características técnicas
          </h2>
          <SpecTable atributos={producto.atributos} />
        </section>

        <section>
          <h2 className="mb-4 text-xl font-heading font-semibold text-trade-gray-900">
            Descripción y aplicaciones
          </h2>
          <p className="max-w-3xl whitespace-pre-line text-sm leading-relaxed text-trade-gray-900">
            {producto.descripcionLarga}
          </p>
          {producto.aplicaciones.length > 0 && (
            <ul className="mt-3 flex flex-wrap gap-2">
              {producto.aplicaciones.map((aplicacion) => (
                <li
                  key={aplicacion}
                  className="rounded-full bg-trade-gray-050 px-3 py-1 text-xs text-trade-gray-500"
                >
                  {aplicacion}
                </li>
              ))}
            </ul>
          )}
        </section>

        <section>
          <h2 className="mb-4 text-xl font-heading font-semibold text-trade-gray-900">Documentación</h2>
          <DocumentList documentos={producto.documentos} />
        </section>

        <section>
          <h2 className="mb-4 text-xl font-heading font-semibold text-trade-gray-900">Equivalencias</h2>
          <EquivalenceTable equivalencias={equivalencias} />
        </section>

        {relacionados.length > 0 && (
          <section>
            <h2 className="mb-4 text-xl font-heading font-semibold text-trade-gray-900">
              Productos relacionados
            </h2>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {relacionados.map((relacionado) => (
                <ProductCard key={relacionado.id} producto={relacionado} />
              ))}
            </div>
          </section>
        )}

        {esReparable && (
          <section className="rounded-lg bg-trade-ink px-6 py-8 text-trade-white sm:px-10">
            <h2 className="text-xl font-heading font-semibold">¿Ya lo tienes y ha fallado?</h2>
            <p className="mt-2 max-w-2xl text-sm text-white/70">
              Podemos repararlo. Diagnóstico, presupuesto cerrado antes de intervenir e informe
              técnico de reparación al entregarlo — también si no es una marca que distribuimos.
            </p>
            <Link
              href="/servicios/reparacion-industrial"
              className="mt-4 inline-block rounded-md bg-trade-red px-4 py-2 text-sm font-medium hover:bg-trade-red-dark"
            >
              Solicitar diagnóstico
            </Link>
          </section>
        )}
      </div>
    </div>
  );
}
