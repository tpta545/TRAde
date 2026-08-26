import type { Metadata } from "next";
import { siteConfig } from "@/config/site";
import { AvisoPendienteJuridico } from "@/components/legal/aviso-pendiente-juridico";

export const metadata: Metadata = {
  title: "Política de privacidad",
  robots: { index: false, follow: true },
  alternates: { canonical: "/legal/privacidad" },
};

export default function PrivacidadPage() {
  return (
    <div className="mx-auto w-full max-w-2xl px-4 py-10 text-sm leading-relaxed text-trade-gray-900 sm:px-6">
      <h1 className="mb-6 text-2xl font-heading font-semibold text-trade-gray-900">
        Política de privacidad
      </h1>
      <AvisoPendienteJuridico />

      <div className="space-y-6">
        <section>
          <h2 className="mb-2 font-semibold">1. Responsable del tratamiento</h2>
          <p>
            {siteConfig.razonSocial}, CIF {siteConfig.fiscal.cif}, {siteConfig.direccion.calle},{" "}
            {siteConfig.direccion.codigoPostal} {siteConfig.direccion.localidad}. Email de
            contacto: {siteConfig.contacto.email}.
          </p>
        </section>

        <section>
          <h2 className="mb-2 font-semibold">2. Datos que tratamos y finalidad</h2>
          <ul className="list-disc space-y-1 pl-5">
            <li>
              <strong>Cuenta B2B y pedidos:</strong> datos identificativos, fiscales y de
              contacto para gestionar el registro, los pedidos y la facturación. Base jurídica:
              ejecución de un contrato.
            </li>
            <li>
              <strong>Formularios de contacto, presupuesto y reparación:</strong> datos de
              contacto para responder a tu solicitud. Base jurídica: consentimiento (al enviar el
              formulario) e interés legítimo en atender tu consulta.
            </li>
            <li>
              <strong>Newsletter:</strong> email, con doble confirmación de alta (opt-in). Base
              jurídica: consentimiento, revocable en cualquier momento.
            </li>
            <li>
              <strong>Analítica web:</strong> datos de navegación anonimizados/agregados, solo si
              aceptas las cookies de analítica en el banner. Base jurídica: consentimiento.
            </li>
          </ul>
        </section>

        <section>
          <h2 className="mb-2 font-semibold">3. Conservación</h2>
          <p>
            Los datos de pedidos y facturación se conservan durante el plazo legal exigido a
            efectos fiscales y mercantiles. Los datos de formularios de contacto se conservan
            mientras sea necesario para atender la solicitud y, salvo indicación en contra, un
            máximo de 24 meses.
          </p>
        </section>

        <section>
          <h2 className="mb-2 font-semibold">4. Derechos</h2>
          <p>
            Puedes ejercer tus derechos de acceso, rectificación, supresión, oposición,
            portabilidad y limitación escribiendo a {siteConfig.contacto.email}, así como
            reclamar ante la Agencia Española de Protección de Datos (aepd.es) si lo consideras
            necesario.
          </p>
        </section>

        <section>
          <h2 className="mb-2 font-semibold">5. Registro de consentimientos</h2>
          <p>
            Cada consentimiento (newsletter, cookies, formularios) queda registrado con fecha y
            texto aceptado, conforme al RGPD y la LOPDGDD.
          </p>
        </section>
      </div>
    </div>
  );
}
