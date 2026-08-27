import type { Metadata } from "next";
import { Clock, Package, RefreshCw } from "lucide-react";
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
  title: "Mantenimiento y stock gestionado",
  description:
    "Acordamos contigo un stock mínimo de tus referencias críticas en nuestro almacén de Algemesí, para que una avería nunca dependa de un plazo de fabricante.",
  alternates: { canonical: "/servicios/mantenimiento-y-stock-gestionado" },
};

const PASOS = [
  {
    titulo: "Nos cuentas tu instalación",
    descripcion: "Qué máquinas tienes y qué referencias son críticas si fallan.",
  },
  {
    titulo: "Acordamos un stock mínimo",
    descripcion: `De tus referencias habituales, guardado en nuestro almacén de ${siteConfig.direccion.localidad}.`,
  },
  {
    titulo: "Reposición automática",
    descripcion: "Reponemos antes de que se agote, sin que tengas que pedirlo cada vez.",
  },
  {
    titulo: "Revisión periódica",
    descripcion: "Ajustamos el mínimo acordado según cómo cambie tu consumo real.",
  },
];

const FAQ = [
  {
    pregunta: "¿Qué es exactamente el stock gestionado?",
    respuesta: `Acordamos contigo un nivel mínimo de tus referencias críticas en nuestro almacén de ${siteConfig.direccion.localidad}, y lo reponemos antes de que se agote.`,
  },
  {
    pregunta: "¿Para qué tipo de instalación tiene sentido?",
    respuesta:
      "Para plantas con recambios críticos que no se pueden permitir esperar un plazo de fabricante ante una avería.",
  },
];

export default function MantenimientoYStockGestionadoPage() {
  const migas = [
    { nombre: "Mantenimiento y stock gestionado", url: "/servicios/mantenimiento-y-stock-gestionado" },
  ];

  return (
    <div>
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd(migas)) }}
      />

      <HeroServicio
        imagenId="hero-mantenimiento"
        titulo="Mantenimiento y stock gestionado"
        subtitulo={`Para plantas con recambios críticos: acordamos contigo un stock mínimo en nuestro almacén de ${siteConfig.direccion.localidad}, con reposición automática antes de que se agote.`}
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
          { icono: Package, titulo: "Stock acordado", descripcion: "Tus referencias críticas, guardadas en nuestro almacén." },
          { icono: RefreshCw, titulo: "Reposición automática", descripcion: "Reponemos antes de que se agote, sin que lo pidas." },
          { icono: Clock, titulo: "Sin esperar al fabricante", descripcion: "Una avería nunca depende del plazo de un proveedor." },
        ]}
      />

      <PasosNumerados titulo="Cómo funciona" pasos={PASOS} />

      <FranjaPrueba
        datos={[
          { valor: siteConfig.direccion.localidad, etiqueta: "almacén propio" },
          { valor: "A medida", etiqueta: "stock mínimo acordado contigo" },
          { valor: "Automática", etiqueta: "reposición antes de agotarse" },
        ]}
      />

      <FormularioNegro titulo="Cuéntanos tu instalación">
        <FormularioServicio
          tipo="mantenimiento"
          placeholderMensaje="Ej: tenemos 6 motores WEG de 7,5 kW en la línea de envasado y queremos tener siempre un rodamiento y un motor de repuesto en vuestro almacén."
        />
      </FormularioNegro>

      <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 md:py-16">
        <h2 className="mb-4 text-xl font-heading font-semibold text-trade-gray-900">Preguntas frecuentes</h2>
        <FaqAccordion items={FAQ} />
      </div>
    </div>
  );
}
