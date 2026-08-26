import type { Metadata } from "next";
import { siteConfig } from "@/config/site";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { FormularioReparacion } from "@/components/leads/formulario-reparacion";
import { breadcrumbJsonLd } from "@/lib/seo/schema";

export const metadata: Metadata = {
  title: "Reparación de variadores, motores y equipos industriales",
  description:
    "Diagnóstico en 48 h, presupuesto cerrado antes de intervenir e informe técnico de reparación. Reparamos también marcas que no distribuimos.",
  alternates: { canonical: "/servicios/reparacion-industrial" },
};

const PASOS = [
  {
    titulo: "1. Nos cuentas la avería",
    descripcion: "Marca, modelo y qué le pasa, por teléfono o con el formulario. Foto de la placa si la tienes.",
  },
  {
    titulo: "2. Diagnóstico en 48 h",
    descripcion: "Recogemos el equipo o lo revisamos en tu planta y te damos un diagnóstico claro.",
  },
  {
    titulo: "3. Presupuesto cerrado",
    descripcion: "No tocamos nada sin que apruebes el precio. Sin sorpresas al final.",
  },
  {
    titulo: "4. Reparación e informe técnico",
    descripcion: "Al entregarlo, recibes un informe técnico de la reparación realizada.",
  },
];

const QUE_REPARAMOS = [
  "Variadores de frecuencia (ABB, WEG y otras marcas)",
  "Motores eléctricos trifásicos, cualquier potencia",
  "Arrancadores suaves y arrancadores estrella-triángulo",
  "Bombas y reductores industriales",
];

export default function ReparacionIndustrialPage() {
  const migas = [{ nombre: "Reparación industrial", url: "/servicios/reparacion-industrial" }];

  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-10 sm:px-6">
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd(migas)) }}
      />
      <Breadcrumbs items={migas} />

      <h1 className="mt-2 text-3xl font-heading font-semibold text-trade-gray-900 sm:text-4xl">
        Reparación de variadores, motores y equipos industriales
      </h1>
      <p className="mt-3 max-w-2xl text-trade-gray-500">
        Diagnóstico en 48 h. Presupuesto cerrado antes de tocar nada. Informe técnico de
        reparación al entregarlo. Si no tiene arreglo, te ofrecemos el equivalente nuevo con
        descuento.
      </p>

      <a
        href={`tel:${siteConfig.contacto.telefonoInternacional}`}
        className="mt-6 inline-block rounded-md bg-trade-ink px-5 py-3 text-sm font-medium text-trade-white hover:bg-trade-graphite"
      >
        Máquina parada: {siteConfig.contacto.telefono}
      </a>

      <div className="mt-12 grid grid-cols-1 gap-10 lg:grid-cols-2">
        <div className="space-y-10">
          <section>
            <h2 className="mb-3 text-xl font-heading font-semibold text-trade-gray-900">
              Qué reparamos
            </h2>
            <ul className="space-y-2 text-sm text-trade-gray-900">
              {QUE_REPARAMOS.map((item) => (
                <li key={item} className="flex gap-2">
                  <span className="text-trade-red">·</span>
                  {item}
                </li>
              ))}
            </ul>
          </section>

          <section>
            <h2 className="mb-3 text-xl font-heading font-semibold text-trade-gray-900">
              Cómo funciona
            </h2>
            <ol className="space-y-4">
              {PASOS.map((paso) => (
                <li key={paso.titulo}>
                  <p className="font-medium text-trade-gray-900">{paso.titulo}</p>
                  <p className="text-sm text-trade-gray-500">{paso.descripcion}</p>
                </li>
              ))}
            </ol>
          </section>
        </div>

        <div className="rounded-lg border border-trade-gray-200 p-6">
          <h2 className="mb-4 text-lg font-heading font-semibold text-trade-gray-900">
            Solicitar diagnóstico
          </h2>
          <FormularioReparacion />
        </div>
      </div>
    </div>
  );
}
