import Link from "next/link";
import { getUltimosArticulos } from "@/lib/data/blog";
import { FormularioNewsletter } from "@/components/leads/formulario-newsletter";
import { ImagenGenerada } from "@/components/media/imagen-generada";

const ARTICULO_A_IMAGEN: Record<string, string> = {
  "como-leer-la-placa-de-caracteristicas-de-un-motor-electrico": "blog-placa-caracteristicas",
  "codigos-de-sufijo-de-rodamientos-2rs-zz-c3": "blog-sufijos-rodamientos",
  "como-interpretar-los-codigos-de-fallo-del-variador-abb-acs580": "blog-errores-variador",
  "equivalencias-de-rodamientos-entre-skf-fag-ntn-e-isb": "blog-equivalencias",
  "cuando-reparar-y-cuando-sustituir-un-variador-de-frecuencia": "blog-reparar-o-sustituir",
};

export async function BlogNewsletter() {
  const articulos = await getUltimosArticulos(3);

  return (
    <section className="bg-trade-gray-050">
      <div className="mx-auto max-w-7xl grid grid-cols-1 gap-10 px-4 py-16 sm:px-6 md:py-24 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <h2 className="mb-6 text-2xl font-heading font-semibold text-trade-gray-900">
            Últimas del blog
          </h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            {articulos.map((articulo) => {
              const imagenId = ARTICULO_A_IMAGEN[articulo.slug];
              return (
                <Link
                  key={articulo.slug}
                  href={`/blog/${articulo.slug}`}
                  className="block overflow-hidden rounded-sm border border-trade-gray-200 bg-trade-white hover:border-trade-red"
                >
                  {imagenId && (
                    <div className="relative aspect-[16/9]">
                      <ImagenGenerada id={imagenId} sizes="(max-width: 640px) 100vw, 33vw" className="object-cover" />
                    </div>
                  )}
                  <div className="p-4">
                    <p className="text-xs font-medium uppercase tracking-wide text-trade-red">
                      {articulo.categoria}
                    </p>
                    <p className="mt-1 text-sm font-medium text-trade-gray-900">{articulo.titulo}</p>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>

        <div className="rounded-sm border border-trade-gray-200 bg-trade-white p-6">
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
