import type { Metadata } from "next";
import { siteConfig } from "@/config/site";
import { AvisoPendienteJuridico } from "@/components/legal/aviso-pendiente-juridico";

export const metadata: Metadata = {
  title: "Aviso legal",
  robots: { index: false, follow: true },
  alternates: { canonical: "/legal/aviso-legal" },
};

export default function AvisoLegalPage() {
  return (
    <div className="mx-auto w-full max-w-2xl px-4 py-10 text-sm leading-relaxed text-trade-gray-900 sm:px-6">
      <h1 className="mb-6 text-2xl font-heading font-semibold text-trade-gray-900">Aviso legal</h1>
      <AvisoPendienteJuridico />

      <div className="space-y-6">
        <section>
          <h2 className="mb-2 font-semibold">1. Datos identificativos (LSSI, art. 10)</h2>
          <p>
            En cumplimiento del artículo 10 de la Ley 34/2002, de Servicios de la Sociedad de la
            Información y de Comercio Electrónico, se informa:
          </p>
          <ul className="mt-2 list-disc pl-5">
            <li>Denominación social: {siteConfig.razonSocial}</li>
            <li>Nombre comercial: {siteConfig.marca}</li>
            <li>CIF: {siteConfig.fiscal.cif}</li>
            <li>Domicilio: {siteConfig.direccion.calle}, {siteConfig.direccion.codigoPostal} {siteConfig.direccion.localidad} ({siteConfig.direccion.provincia})</li>
            <li>Datos de inscripción en el Registro Mercantil: {siteConfig.fiscal.registroMercantil}</li>
            <li>Email: {siteConfig.contacto.email}</li>
            <li>Teléfono: {siteConfig.contacto.telefono}</li>
          </ul>
        </section>

        <section>
          <h2 className="mb-2 font-semibold">2. Objeto</h2>
          <p>
            El presente aviso legal regula el uso del sitio web {siteConfig.dominio} (en
            adelante, &ldquo;el sitio web&rdquo;), del que es titular {siteConfig.razonSocial}.
          </p>
        </section>

        <section>
          <h2 className="mb-2 font-semibold">3. Condiciones de uso</h2>
          <p>
            El acceso al sitio web es gratuito. El uso del sitio web atribuye la condición de
            usuario e implica la aceptación de todas las condiciones incluidas en este Aviso
            Legal.
          </p>
        </section>

        <section>
          <h2 className="mb-2 font-semibold">4. Propiedad intelectual e industrial</h2>
          <p>
            Todos los contenidos del sitio web (textos, imágenes, fichas técnicas, marcas y
            logotipos) son titularidad de {siteConfig.razonSocial} o de sus respectivos
            fabricantes/licenciantes, y están protegidos por la normativa de propiedad
            intelectual e industrial.
          </p>
        </section>

        <section>
          <h2 className="mb-2 font-semibold">5. Legislación aplicable y jurisdicción</h2>
          <p>
            Las presentes condiciones se rigen por la legislación española. Para la resolución de
            cualquier controversia, las partes se someten a los juzgados y tribunales del
            domicilio del consumidor cuando este tenga la condición de consumidor, o de{" "}
            {siteConfig.direccion.localidad} en el resto de casos.
          </p>
        </section>
      </div>
    </div>
  );
}
