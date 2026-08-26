import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { CheckCircle2, XCircle, Clock } from "lucide-react";
import { getPedido } from "@/lib/pedidos/store";
import { siteConfig } from "@/config/site";
import { BotonImprimir } from "@/components/checkout/boton-imprimir";
import { TrackOnMount } from "@/components/analitica/track-on-mount";

export const metadata: Metadata = {
  title: "Confirmación de pedido",
  robots: { index: false, follow: false },
};

const formateadorEUR = new Intl.NumberFormat("es-ES", { style: "currency", currency: "EUR" });

export default async function PedidoPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ pago?: string }>;
}) {
  const { id } = await params;
  const { pago } = await searchParams;
  const pedido = await getPedido(id);
  if (!pedido) notFound();

  const pagoFallido = pago === "ko";

  return (
    <div className="mx-auto w-full max-w-2xl px-4 py-16 sm:px-6 print:py-4">
      <div className="text-center">
        {pagoFallido ? (
          <XCircle className="mx-auto h-12 w-12 text-trade-red" />
        ) : pedido.estado === "pendiente_aprobacion" ? (
          <Clock className="mx-auto h-12 w-12 text-trade-amber" />
        ) : (
          <CheckCircle2 className="mx-auto h-12 w-12 text-trade-green" />
        )}

        <h1 className="mt-4 text-2xl font-heading font-semibold text-trade-gray-900">
          {pagoFallido
            ? "El pago no se ha completado"
            : pedido.estado === "pendiente_aprobacion"
              ? "Pedido registrado, pendiente de aprobación"
              : "¡Gracias! Pedido confirmado"}
        </h1>
        <p className="mt-1 font-mono text-trade-gray-500">{pedido.numero}</p>

        {pagoFallido && (
          <Link href="/checkout" className="mt-4 inline-block text-sm font-medium text-trade-red hover:underline">
            Volver a intentar el pago →
          </Link>
        )}
        {pedido.estado === "pendiente_aprobacion" && (
          <p className="mx-auto mt-2 max-w-md text-sm text-trade-gray-500">
            Este pedido supera el límite de aprobación automática de tu cuenta. Un aprobador de{" "}
            {pedido.razonSocial} tiene que confirmarlo antes de prepararlo.
          </p>
        )}
      </div>

      <div className="mt-10 rounded-lg border border-trade-gray-200 p-6 print:border-0 print:p-0">
        <div className="mb-4 flex items-center justify-between text-sm text-trade-gray-500">
          <span>{new Date(pedido.fecha).toLocaleDateString("es-ES", { dateStyle: "long" })}</span>
          <span>
            Plazo estimado:{" "}
            {pedido.plazoEntregaDias === 0 ? "envío hoy" : `${pedido.plazoEntregaDias} días laborables`}
          </span>
        </div>

        <ul className="divide-y divide-trade-gray-200">
          {pedido.lineas.map((linea) => (
            <li key={linea.productoId} className="flex justify-between gap-4 py-3 text-sm">
              <div>
                <p className="font-mono text-trade-gray-900">{linea.referencia}</p>
                <p className="text-trade-gray-500">
                  {linea.nombre} · {linea.cantidad} ud
                </p>
              </div>
              <p className="font-mono text-trade-gray-900">
                {formateadorEUR.format(linea.precioUnitario * linea.cantidad)}
              </p>
            </li>
          ))}
        </ul>

        <div className="mt-4 space-y-1 border-t border-trade-gray-200 pt-4 text-sm">
          <div className="flex justify-between">
            <span className="text-trade-gray-500">Subtotal</span>
            <span className="font-mono">{formateadorEUR.format(pedido.subtotal)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-trade-gray-500">IVA</span>
            <span className="font-mono">{formateadorEUR.format(pedido.iva)}</span>
          </div>
          <div className="flex justify-between font-semibold text-trade-gray-900">
            <span>Total</span>
            <span className="font-mono">{formateadorEUR.format(pedido.total)}</span>
          </div>
        </div>
      </div>

      <div className="mt-6 flex flex-wrap items-center justify-center gap-4 print:hidden">
        <BotonImprimir />
        <Link href="/productos" className="text-sm font-medium text-trade-red hover:underline">
          Seguir comprando →
        </Link>
      </div>

      {!pagoFallido && pedido.estado !== "pendiente_aprobacion" && (
        <TrackOnMount
          evento="purchase"
          parametros={{
            transaction_id: pedido.numero,
            value: pedido.total,
            currency: "EUR",
            items: pedido.lineas.map((l) => ({
              item_id: l.referencia,
              item_name: l.nombre,
              item_brand: l.marca,
              price: l.precioUnitario,
              quantity: l.cantidad,
            })),
          }}
        />
      )}

      <p className="mt-8 text-center text-xs text-trade-gray-500 print:hidden">
        ¿Dudas con este pedido? Llámanos al{" "}
        <a href={`tel:${siteConfig.contacto.telefonoInternacional}`} className="hover:underline">
          {siteConfig.contacto.telefono}
        </a>
        .
      </p>
    </div>
  );
}
