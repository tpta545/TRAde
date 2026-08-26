import type { Metadata } from "next";
import { FileText } from "lucide-react";
import { getProductos } from "@/lib/data/productos";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Catálogos de fabricante",
  alternates: { canonical: "/recursos/catalogos" },
};

export default async function CatalogosPage() {
  const productos = await getProductos();

  const catalogos = new Map<string, string>();
  for (const producto of productos) {
    for (const doc of producto.documentos) {
      if (doc.tipo === "catalogo") catalogos.set(doc.titulo, doc.url);
    }
  }

  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-10 sm:px-6">
      <Breadcrumbs items={[{ nombre: "Catálogos", url: "/recursos/catalogos" }]} />
      <h1 className="mt-2 text-3xl font-heading font-semibold text-trade-gray-900">
        Catálogos de fabricante
      </h1>
      <p className="mt-2 text-sm text-trade-gray-500">
        Documentación oficial de las marcas que distribuimos.
      </p>

      <ul className="mt-8 space-y-3">
        {Array.from(catalogos, ([titulo, url]) => (
          <li key={url}>
            <a
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-sm text-trade-gray-900 hover:text-trade-red hover:underline"
            >
              <FileText className="h-4 w-4 text-trade-gray-500" aria-hidden />
              {titulo}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
