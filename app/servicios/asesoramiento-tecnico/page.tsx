import type { Metadata } from "next";
import { Clock, Search, Wrench } from "lucide-react";
import { siteConfig } from "@/config/site";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { FormularioServicio } from "@/components/leads/formulario-servicio";
import { HeroServicio } from "@/components/servicios/hero-servicio";
import { PuntosPromesa } from "@/components/servicios/puntos-promesa";
import { PasosNumerados } from "@/components/servicios/pasos-numerados";
import { FranjaPrueba } from "@/components/servicios/franja-prueba";
import { FormularioNegro } from "@/components/servicios/formulario-negro";
import { FaqAccordion } from "@/components/ui/faq-accordion";
import { breadcrumbJsonLd } from "@/lib/seo/schema";

export const metadata: Metadata = {
  title: "Asesoramiento técnico y equivalencias",
  description:
    "Dinos qué pieza monta tu máquina y te decimos cuál te va, aunque no sea de las marcas que distribuimos.",
  alternates: { canonical: "/servicios/asesoramiento-tecnico" },
};

const PASOS = [
  {
    titulo: "Nos cuentas qué necesitas",
    descripcion: "Referencia, marca, o una foto de la pieza si no sabes la referencia exacta.",
  },
  {
    titulo: "Comparamos equivalencias",
    descripcion: "El mismo trabajo que hacemos en mostrador: buscamos entre las marcas que trabajamos.",
  },
  {
    titulo: "Te confirmamos la referencia",
    descripcion: "Te decimos si tenemos el equivalente en catálogo y si hay stock.",
  },
  {
    titulo: "Respuesta en menos de 24 h",
    descripcion: "Te contactamos en menos de 24 h laborables con la confirmación.",
  },
];

const FAQ = [
  {
    pregunta: "¿Puedo pedir la equivalencia de una marca que no vendéis?",
    respuesta:
      "Sí. Mete la referencia de cualquier fabricante — SKF, FAG, INA u otro — y te decimos si tenemos el equivalente en catálogo.",
  },
  {
    pregunta: "¿Y si no encontráis la equivalencia?",
    respuesta:
      "Si no la tenemos confirmada, pregúntanos directamente con el formulario y te la confirmamos.",
  },
];

export default function AsesoramientoTecnicoPage() {
  const migas = [{ nombre: "Asesoramiento técnico", url: "/servicios/asesoramiento-tecnico" }];

  return (
    <div>
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd(migas)) }}
      />

      <HeroServicio
        imagenId="hero-asesoramiento"
        titulo="Asesoramiento técnico y equivalencias"
        subtitulo="Dinos qué rodamiento, motor o variador monta tu máquina y te decimos cuál le va, aunque no sea de las marcas que distribuimos."
        cta={
          <a
            href={`tel:${siteConfig.contacto.telefonoInternacional}`}
            className="inline-block rounded-md bg-trade-red px-5 py-3 text-sm font-semibold text-trade-white hover:bg-trade-red-dark"
          >
            Llamar al {siteConfig.contacto.telefono}
          </a>
        }
      />

      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        <Breadcrumbs items={migas} />
      </div>

      <PuntosPromesa
        puntos={[
          { icono: Search, titulo: "Cualquier marca", descripcion: "Comparamos equivalencias aunque la referencia original no sea nuestra." },
          { icono: Clock, titulo: "Respuesta en 24 h", descripcion: "Te contactamos en menos de 24 h laborables." },
          { icono: Wrench, titulo: "Trabajo de mostrador", descripcion: "El mismo criterio técnico de siempre, ahora también online." },
        ]}
      />

      <PasosNumerados titulo="Cómo funciona" pasos={PASOS} />

      <FranjaPrueba
        datos={[
          { valor: "24 h", etiqueta: "tiempo de respuesta laborable" },
          { valor: "Cualquier marca", etiqueta: "comparamos equivalencias entre fabricantes" },
          { valor: "0", etiqueta: "compromiso de compra para preguntar" },
        ]}
      />

      <FormularioNegro titulo="Cuéntanos qué necesitas">
        <FormularioServicio
          tipo="asesoramiento"
          placeholderMensaje="Ej: necesito la equivalencia de un rodamiento SKF 6205-2RS1 que llevamos montado en una cinta transportadora."
        />
      </FormularioNegro>

      <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 md:py-16">
        <h2 className="mb-4 text-xl font-heading font-semibold text-trade-gray-900">Preguntas frecuentes</h2>
        <FaqAccordion items={FAQ} />
      </div>
    </div>
  );
}
