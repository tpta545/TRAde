import Link from "next/link";
import { getUltimosArticulos } from "@/lib/data/blog";
import { FormularioNewsletter } from "@/components/leads/formulario-newsletter";

export async function BlogNewsletter() {
  const articulos = await getUltimosArticulos(3);

  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
      <div className="grid grid-cols-1 gap-10 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <h2 className="mb-6 text-2xl font-heading font-semibold text-trade-gray-900">
            Últimas del blog
          </h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            {articulos.map((articulo) => (
              <Link
                key={articulo.slug}
                href={`/blog/${articulo.slug}`}
                className="rounded-lg border border-trade-gray-200 p-4 hover:border-trade-red"
              >
                <p className="text-xs font-medium uppercase tracking-wide text-trade-red">
                  {articulo.categoria}
                </p>
                <p className="mt-1 text-sm font-medium text-trade-gray-900">{articulo.titulo}</p>
              </Link>
            ))}
          </div>
        </div>

        <div className="rounded-lg bg-trade-gray-050 p-6">
          <h2 className="mb-2 font-heading text-lg font-semibold text-trade-gray-900">
            Newsletter técnica
          </h2>
          <p className="mb-4 text-sm text-trade-gray-500">
            Un correo al mes con guías de mantenimiento, sin spam comercial.
          </p>
          <FormularioNewsletter />
        </div>
      </div>
    </section>
  );
}
