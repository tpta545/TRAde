import type { Metadata } from "next";
import { Clock, FileCheck, Wrench } from "lucide-react";
import { siteConfig } from "@/config/site";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { FormularioReparacion } from "@/components/leads/formulario-reparacion";
import { HeroServicio } from "@/components/servicios/hero-servicio";
import { PuntosPromesa } from "@/components/servicios/puntos-promesa";
import { PasosNumerados } from "@/components/servicios/pasos-numerados";
import { FranjaPrueba } from "@/components/servicios/franja-prueba";
import { FormularioNegro } from "@/components/servicios/formulario-negro";
import { FaqAccordion } from "@/components/ui/faq-accordion";
import { breadcrumbJsonLd } from "@/lib/seo/schema";

export const metadata: Metadata = {
  title: "Reparación de variadores, motores y equipos industriales",
  description:
    "Diagnóstico en 48 h, presupuesto cerrado antes de intervenir e informe técnico de reparación. Reparamos también marcas que no distribuimos.",
  alternates: { canonical: "/servicios/reparacion-industrial" },
};

const PASOS = [
  {
    titulo: "Nos cuentas la avería",
    descripcion: "Marca, modelo y qué le pasa, por teléfono o con el formulario. Foto de la placa si la tienes.",
  },
  {
    titulo: "Diagnóstico en 48 h",
    descripcion: "Recogemos el equipo o lo revisamos en tu planta y te damos un diagnóstico claro.",
  },
  {
    titulo: "Presupuesto cerrado",
    descripcion: "No tocamos nada sin que apruebes el precio. Sin sorpresas al final.",
  },
  {
    titulo: "Reparación e informe técnico",
    descripcion: "Al entregarlo, recibes un informe técnico de la reparación realizada.",
  },
];

const QUE_REPARAMOS = [
  "Variadores de frecuencia (ABB, WEG y otras marcas)",
  "Motores eléctricos trifásicos, cualquier potencia",
  "Arrancadores suaves y arrancadores estrella-triángulo",
  "Bombas y reductores industriales",
];

const FAQ = [
  {
    pregunta: "¿Reparáis marcas que no vendéis?",
    respuesta:
      "Sí. El servicio de reparación no está limitado a las marcas que distribuimos: diagnosticamos y presupuestamos equipos de cualquier marca antes de intervenir.",
  },
  {
    pregunta: "¿Qué pasa si el equipo no tiene arreglo?",
    respuesta: "Te lo decimos en el diagnóstico y te ofrecemos el equivalente nuevo con descuento, sin coste por el diagnóstico.",
  },
  {
    pregunta: "¿Cuánto tarda el diagnóstico?",
    respuesta: "48 horas desde que recibimos el equipo o lo revisamos en tu planta.",
  },
];

export default function ReparacionIndustrialPage() {
  const migas = [{ nombre: "Reparación industrial", url: "/servicios/reparacion-industrial" }];

  return (
    <div>
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd(migas)) }}
      />

      <HeroServicio
        imagenId="hero-reparacion"
        titulo="Reparación de variadores, motores y equipos industriales"
        subtitulo="Diagnóstico en 48 h. Presupuesto cerrado antes de tocar nada. Informe técnico de reparación al entregarlo."
        cta={
          <a
            href={`tel:${siteConfig.contacto.telefonoInternacional}`}
            className="inline-block rounded-md bg-trade-red px-5 py-3 text-sm font-semibold text-trade-white hover:bg-trade-red-dark"
          >
            Máquina parada: {siteConfig.contacto.telefono}
          </a>
        }
      />

      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        <Breadcrumbs items={migas} />
      </div>

      <PuntosPromesa
        puntos={[
          { icono: Clock, titulo: "Diagnóstico en 48 h", descripcion: "Recogemos o revisamos en planta y te damos un diagnóstico claro." },
          { icono: FileCheck, titulo: "Presupuesto cerrado", descripcion: "No tocamos nada sin que lo apruebes. Sin sorpresas al final." },
          { icono: Wrench, titulo: "Cualquier marca", descripcion: "Reparamos también equipos de marcas que no distribuimos." },
        ]}
      />

      <PasosNumerados titulo="Cómo funciona" pasos={PASOS} />

      <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 md:py-16">
        <h2 className="mb-4 text-xl font-heading font-semibold text-trade-gray-900">Qué reparamos</h2>
        <ul className="grid grid-cols-1 gap-2 text-sm text-trade-gray-900 sm:grid-cols-2">
          {QUE_REPARAMOS.map((item) => (
            <li key={item} className="flex gap-2">
              <span className="text-trade-red">·</span>
              {item}
            </li>
          ))}
        </ul>
      </div>

      <FranjaPrueba
        datos={[
          { valor: "48 h", etiqueta: "para el diagnóstico" },
          { valor: "100%", etiqueta: "presupuesto cerrado antes de intervenir" },
          { valor: "Cualquier marca", etiqueta: "también equipos que no distribuimos" },
        ]}
      />

      <FormularioNegro titulo="Solicitar diagnóstico">
        <FormularioReparacion />
      </FormularioNegro>

      <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 md:py-16">
        <h2 className="mb-4 text-xl font-heading font-semibold text-trade-gray-900">Preguntas frecuentes</h2>
        <FaqAccordion items={FAQ} />
      </div>
    </div>
  );
}
