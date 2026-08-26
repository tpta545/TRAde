import type { Metadata } from "next";
import { siteConfig } from "@/config/site";
import { AvisoPendienteJuridico } from "@/components/legal/aviso-pendiente-juridico";

export const metadata: Metadata = {
  title: "Condiciones generales de venta",
  robots: { index: false, follow: true },
  alternates: { canonical: "/legal/condiciones-de-venta" },
};

export default function CondicionesVentaPage() {
  return (
    <div className="mx-auto w-full max-w-2xl px-4 py-10 text-sm leading-relaxed text-trade-gray-900 sm:px-6">
      <h1 className="mb-6 text-2xl font-heading font-semibold text-trade-gray-900">
        Condiciones generales de venta
      </h1>
      <AvisoPendienteJuridico />

      <div className="space-y-6">
        <section>
          <h2 className="mb-2 font-semibold">1. Precios e IVA</h2>
          <p>
            Los precios se muestran sin IVA por defecto, con un conmutador para verlos con IVA
            incluido ({siteConfig.comercio.ivaPorcentaje}%). El IVA aplicable se muestra siempre
            antes de confirmar el pago. Para entregas intracomunitarias a empresas con NIF-IVA
            válido en el censo VIES, la venta puede quedar exenta de IVA conforme a la normativa
            de operaciones intracomunitarias — se valida automáticamente el VAT europeo indicado
            en el checkout.
          </p>
        </section>

        <section>
          <h2 className="mb-2 font-semibold">2. Plazos y portes</h2>
          <p>
            El plazo de entrega se indica en cada ficha de producto y se consolida al artículo
            más lento del pedido. Portes gratis a partir de {"<<PENDIENTE: importe>>"} €; por
            debajo de ese importe se aplica el coste de portes indicado en el carrito antes de
            confirmar el pedido.
          </p>
        </section>

        <section>
          <h2 className="mb-2 font-semibold">3. Formas de pago</h2>
          <p>
            Tarjeta (pasarela Redsys), transferencia bancaria, y pago a 30/60 días para cuentas
            B2B aprobadas por {siteConfig.razonSocial}.
          </p>
        </section>

        <section>
          <h2 className="mb-2 font-semibold">4. Derecho de desistimiento</h2>
          <p>
            Si compras como <strong>consumidor</strong> (persona física, NIF), dispones de 14
            días naturales desde la recepción del pedido para desistir de la compra sin
            necesidad de justificación, conforme al Real Decreto Legislativo 1/2007. Si compras
            como <strong>empresa</strong> (CIF) para tu actividad profesional, el derecho de
            desistimiento de consumidores no es aplicable; se aplican las condiciones de
            devolución del apartado siguiente.
          </p>
        </section>

        <section>
          <h2 className="mb-2 font-semibold">5. Devoluciones y garantía</h2>
          <p>
            Las devoluciones de producto en perfecto estado se aceptan en un plazo de 30 días.
            Todo el producto vendido incluye la garantía legal correspondiente frente a defectos
            de fabricación.
          </p>
        </section>

        <section>
          <h2 className="mb-2 font-semibold">6. Reserva de dominio</h2>
          <p>
            La propiedad de la mercancía no se transmite al comprador hasta el pago íntegro del
            precio, conforme al pacto de reserva de dominio.
          </p>
        </section>

        <section>
          <h2 className="mb-2 font-semibold">7. Facturación</h2>
          <p>
            Las facturas se emiten desde nuestro sistema de gestión (ERP) con software de
            facturación homologado conforme a Verifactu — este sitio web expone tus facturas,
            pero no las emite.
          </p>
        </section>

        <section>
          <h2 className="mb-2 font-semibold">8. Jurisdicción</h2>
          <p>
            Para cualquier controversia se aplica la legislación española, con sometimiento a
            los juzgados y tribunales del domicilio del consumidor cuando este tenga tal
            condición, o de {siteConfig.direccion.localidad} en el resto de casos.
          </p>
        </section>
      </div>
    </div>
  );
}
