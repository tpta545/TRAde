import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getCombinacionesMarcaFamilia, getProductosPorMarca } from "@/lib/data/productos";
import { getMarcaInfo } from "@/lib/data/marcas";
import { getFamiliaInfo } from "@/lib/data/familias";
import { generarIntroMarcaFamilia } from "@/lib/seo/marca-familia-intro";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { ProductCard } from "@/components/producto/product-card";
import { faqJsonLd } from "@/lib/seo/schema";

export const revalidate = 3600;
const MINIMO_PRODUCTOS = 5;

export async function generateStaticParams() {
  const combinaciones = await getCombinacionesMarcaFamilia(MINIMO_PRODUCTOS);
  return combinaciones.map((c) => ({ marca: c.marca.toLowerCase(), familia: c.familia }));
}

async function obtenerDatos(marca: string, familia: string) {
  const productosDeMarca = await getProductosPorMarca(marca);
  const productos = productosDeMarca.filter((p) => p.familia === familia);
  return productos;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ marca: string; familia: string }>;
}): Promise<Metadata> {
  const { marca, familia } = await params;
  const productos = await obtenerDatos(marca, familia);
  const marcaInfo = getMarcaInfo(marca);
  const familiaInfo = getFamiliaInfo(familia);

  return {
    title: `${familiaInfo.nombre} ${marcaInfo.nombre} | Distribuidor oficial`,
    description: `${familiaInfo.nombre} de ${marcaInfo.nombre}: ${productos.length} referencias en catálogo con stock real y envío 24h.`,
    alternates: { canonical: `/marcas/${marca}/${familia}` },
    // Combinaciones con menos del mínimo de productos no aportan contenido diferencial: fuera del índice.
    robots: productos.length < MINIMO_PRODUCTOS ? { index: false, follow: true } : undefined,
  };
}

export default async function MarcaFamiliaPage({
  params,
}: {
  params: Promise<{ marca: string; familia: string }>;
}) {
  const { marca, familia } = await params;
  const productos = await obtenerDatos(marca, familia);
  if (productos.length === 0) notFound();

  const marcaInfo = getMarcaInfo(marca);
  const familiaInfo = getFamiliaInfo(familia);
  const intro = generarIntroMarcaFamilia(marcaInfo, familiaInfo, productos);

  const faq = [
    {
      pregunta: `¿Tenéis stock real de ${familiaInfo.nombre.toLowerCase()} ${marcaInfo.nombre}?`,
      respuesta: `Sí, ${productos.filter((p) => p.stock > 0).length} de las ${productos.length} referencias de esta combinación tienen stock verificable en nuestro almacén de Algemesí ahora mismo; el resto va bajo pedido con el plazo indicado en cada ficha.`,
    },
    {
      pregunta: `¿Sois distribuidor oficial de ${marcaInfo.nombre}?`,
      respuesta: `Sí, Transmisiones del Este (TRADE) es distribuidor oficial de ${marcaInfo.nombre}.`,
    },
  ];

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6">
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd(faq)) }}
      />

      <Breadcrumbs
        items={[
          { nombre: "Marcas", url: "/marcas" },
          { nombre: marcaInfo.nombre, url: `/marcas/${marca}` },
          { nombre: familiaInfo.nombre, url: `/marcas/${marca}/${familia}` },
        ]}
      />

      <h1 className="mt-2 text-3xl font-heading font-semibold text-trade-gray-900">
        {familiaInfo.nombre} {marcaInfo.nombre}
      </h1>
      <p className="mt-3 max-w-3xl text-sm leading-relaxed text-trade-gray-900">{intro}</p>

      <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {productos.map((producto) => (
          <ProductCard key={producto.id} producto={producto} />
        ))}
      </div>

      <div className="mt-12 max-w-3xl border-t border-trade-gray-200 pt-8">
        <h2 className="mb-4 text-xl font-heading font-semibold text-trade-gray-900">
          Preguntas frecuentes
        </h2>
        <div className="divide-y divide-trade-gray-200">
          {faq.map((item) => (
            <details key={item.pregunta} className="py-3">
              <summary className="cursor-pointer font-medium text-trade-gray-900">{item.pregunta}</summary>
              <p className="mt-2 text-sm text-trade-gray-500">{item.respuesta}</p>
            </details>
          ))}
        </div>
      </div>
    </div>
  );
}
