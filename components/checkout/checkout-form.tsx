"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/lib/cart/cart-context";
import { procesarCheckoutAction, type EstadoCheckout } from "@/lib/pedidos/checkout-actions";
import type { UsuarioSesion } from "@/lib/auth/usuario";
import { trackEvent } from "@/lib/analitica/eventos";
import { siteConfig } from "@/config/site";

const formateadorEUR = new Intl.NumberFormat("es-ES", { style: "currency", currency: "EUR" });
const ESTADO_INICIAL: EstadoCheckout = { ok: false, mensaje: "" };

export function CheckoutForm({ sesion }: { sesion: UsuarioSesion | null }) {
  const { items, subtotal, vaciar } = useCart();
  const [estado, formAction] = useActionState(procesarCheckoutAction, ESTADO_INICIAL);
  const [mismaDireccion, setMismaDireccion] = useState(true);
  const router = useRouter();
  const formularioRedsysRef = useRef<HTMLFormElement>(null);

  const iva = subtotal * (siteConfig.comercio.ivaPorcentaje / 100);
  const total = subtotal + iva;

  useEffect(() => {
    if (!estado.ok) return;
    trackEvent("begin_checkout", { value: total, currency: "EUR" });
    vaciar();
    if (estado.formaPago === "tarjeta" && estado.redsys) {
      trackEvent("add_payment_info", { payment_type: "tarjeta" });
      formularioRedsysRef.current?.submit();
      return;
    }
    router.push(`/pedido/${estado.pedidoId}`);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [estado]);

  if (estado.ok && estado.formaPago === "tarjeta" && estado.redsys) {
    return (
      <div className="mx-auto max-w-md py-24 text-center">
        <p className="text-trade-gray-500">Te llevamos a la pasarela de pago segura…</p>
        <form ref={formularioRedsysRef} method="POST" action={estado.redsys.urlAccion} className="mt-4">
          <input type="hidden" name="Ds_SignatureVersion" value={estado.redsys.Ds_SignatureVersion} />
          <input type="hidden" name="Ds_MerchantParameters" value={estado.redsys.Ds_MerchantParameters} />
          <input type="hidden" name="Ds_Signature" value={estado.redsys.Ds_Signature} />
          <button type="submit" className="text-sm font-medium text-trade-red hover:underline">
            Si no continúa automáticamente, pulsa aquí
          </button>
        </form>
      </div>
    );
  }

  return (
    <form action={formAction} className="grid grid-cols-1 gap-8 lg:grid-cols-3">
      <input type="hidden" name="itemsJson" value={JSON.stringify(
        items.map((item) => ({
          productoId: item.productoId,
          referencia: item.referencia,
          nombre: item.nombre,
          marca: item.marca,
          precioUnitario: item.precioTarifa,
          cantidad: item.cantidad,
          bajoPedido: item.bajoPedido,
        })),
      )} />

      <div className="space-y-4 lg:col-span-2">
        <details open className="rounded-lg border border-trade-gray-200 p-4">
          <summary className="cursor-pointer font-heading text-lg font-semibold text-trade-gray-900">
            1. Datos de empresa y contacto
          </summary>
          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Campo label="CIF / NIF *" name="cif" defaultValue={sesion ? undefined : ""} required />
            <Campo label="Razón social *" name="razonSocial" defaultValue={sesion?.empresa} required />
            <Campo label="Persona de contacto *" name="personaContacto" defaultValue={sesion?.nombre} required />
            <Campo label="Teléfono de contacto *" name="telefonoContacto" type="tel" required />
            <Campo label="Email de contacto *" name="emailContacto" type="email" defaultValue={sesion?.email} required />
            <Campo label="Nº de pedido interno (opcional)" name="referenciaPedidoCliente" />
          </div>
        </details>

        <details open className="rounded-lg border border-trade-gray-200 p-4">
          <summary className="cursor-pointer font-heading text-lg font-semibold text-trade-gray-900">
            2. Dirección de envío y facturación
          </summary>
          <div className="mt-4 space-y-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-trade-gray-500">Envío</p>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Campo label="Calle y número *" name="envioCalle" required className="sm:col-span-2" />
              <Campo label="Código postal *" name="envioCp" required />
              <Campo label="Localidad *" name="envioLocalidad" required />
              <Campo label="Provincia *" name="envioProvincia" required />
            </div>

            <label className="flex items-center gap-2 text-sm text-trade-gray-900">
              <input
                type="checkbox"
                name="mismaDireccionFacturacion"
                defaultChecked
                onChange={(e) => setMismaDireccion(e.target.checked)}
                className="h-3.5 w-3.5 accent-trade-red"
              />
              Facturar a la misma dirección
            </label>

            {!mismaDireccion && (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <p className="col-span-full text-xs font-semibold uppercase tracking-wide text-trade-gray-500">
                  Facturación
                </p>
                <Campo label="Calle y número *" name="facturacionCalle" required className="sm:col-span-2" />
                <Campo label="Código postal *" name="facturacionCp" required />
                <Campo label="Localidad *" name="facturacionLocalidad" required />
                <Campo label="Provincia *" name="facturacionProvincia" required />
              </div>
            )}
          </div>
        </details>

        <details className="rounded-lg border border-trade-gray-200 p-4">
          <summary className="cursor-pointer font-heading text-lg font-semibold text-trade-gray-900">
            3. Observaciones de entrega
          </summary>
          <div className="mt-4">
            <textarea
              name="observacionesEntrega"
              rows={3}
              placeholder="Horario de recepción, persona a la que preguntar, acceso al almacén…"
              className="w-full rounded-md border border-trade-gray-200 px-3 py-2 text-sm"
            />
          </div>
        </details>

        <details open className="rounded-lg border border-trade-gray-200 p-4">
          <summary className="cursor-pointer font-heading text-lg font-semibold text-trade-gray-900">
            4. Pago
          </summary>
          <div className="mt-4 space-y-2">
            <OpcionPago
              name="formaPago"
              value="tarjeta"
              defaultChecked
              titulo="Tarjeta"
              descripcion="Pago seguro con Redsys, cargo inmediato."
            />
            <OpcionPago
              name="formaPago"
              value="transferencia"
              titulo="Transferencia bancaria"
              descripcion="Te enviamos los datos bancarios; preparamos el pedido al confirmar el ingreso."
            />
            <OpcionPago
              name="formaPago"
              value="cuenta_30_60"
              titulo="Pago a 30/60 días"
              descripcion={
                sesion
                  ? "Solo para cuentas B2B aprobadas."
                  : "Solo para cuentas B2B aprobadas — inicia sesión para verla disponible."
              }
              disabled={!sesion}
            />
          </div>
        </details>
      </div>

      <aside className="h-fit rounded-lg border border-trade-gray-200 p-5">
        <h2 className="mb-4 font-heading text-lg font-semibold text-trade-gray-900">Resumen</h2>
        <ul className="mb-4 space-y-1 text-sm text-trade-gray-500">
          {items.map((item) => (
            <li key={item.productoId} className="flex justify-between gap-2">
              <span className="truncate">
                {item.cantidad} × {item.referencia}
              </span>
              <span className="font-mono">{formateadorEUR.format(item.precioTarifa * item.cantidad)}</span>
            </li>
          ))}
        </ul>
        <div className="space-y-1 border-t border-trade-gray-200 pt-3 text-sm">
          <div className="flex justify-between">
            <span className="text-trade-gray-500">Subtotal</span>
            <span className="font-mono">{formateadorEUR.format(subtotal)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-trade-gray-500">IVA ({siteConfig.comercio.ivaPorcentaje}%)</span>
            <span className="font-mono">{formateadorEUR.format(iva)}</span>
          </div>
          <div className="flex justify-between font-semibold text-trade-gray-900">
            <span>Total</span>
            <span className="font-mono">{formateadorEUR.format(total)}</span>
          </div>
        </div>
        {!estado.ok && estado.mensaje && <p className="mt-3 text-sm text-trade-red">{estado.mensaje}</p>}
        <button
          type="submit"
          className="mt-4 w-full rounded-md bg-trade-red px-4 py-3 text-sm font-medium text-trade-white hover:bg-trade-red-dark"
        >
          Confirmar pedido
        </button>
      </aside>
    </form>
  );
}

function Campo({
  label,
  name,
  type = "text",
  required,
  defaultValue,
  className = "",
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
  defaultValue?: string;
  className?: string;
}) {
  return (
    <div className={className}>
      <label htmlFor={name} className="mb-1 block text-sm font-medium text-trade-gray-900">
        {label}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        required={required}
        defaultValue={defaultValue}
        className="w-full rounded-md border border-trade-gray-200 px-3 py-2 text-sm"
      />
    </div>
  );
}

function OpcionPago({
  name,
  value,
  titulo,
  descripcion,
  defaultChecked,
  disabled,
}: {
  name: string;
  value: string;
  titulo: string;
  descripcion: string;
  defaultChecked?: boolean;
  disabled?: boolean;
}) {
  return (
    <label
      className={
        "flex cursor-pointer items-start gap-3 rounded-md border border-trade-gray-200 p-3 has-checked:border-trade-red " +
        (disabled ? "cursor-not-allowed opacity-50" : "")
      }
    >
      <input
        type="radio"
        name={name}
        value={value}
        defaultChecked={defaultChecked}
        disabled={disabled}
        className="mt-1 accent-trade-red"
      />
      <span>
        <span className="block text-sm font-medium text-trade-gray-900">{titulo}</span>
        <span className="block text-xs text-trade-gray-500">{descripcion}</span>
      </span>
    </label>
  );
}
