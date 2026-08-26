"use client";

import { PRICING_MODE, siteConfig } from "@/config/site";
import { useIva } from "@/lib/context/iva-context";

const formateadorEUR = new Intl.NumberFormat("es-ES", {
  style: "currency",
  currency: "EUR",
});

function conIva(precio: number): number {
  return precio * (1 + siteConfig.comercio.ivaPorcentaje / 100);
}

export type SesionPrecioCliente = {
  /** Descuento del cliente identificado, en tanto por ciento (0-100). */
  descuentoPorcentaje: number;
};

/**
 * Bloque de precio de la ficha de producto y del listado. Soporta los tres
 * PRICING_MODE de config/site.ts (Parte 3 del prompt maestro):
 * - "public": solo precio de tarifa, visible para todos.
 * - "public_plus_net": tarifa + "TU PRECIO" cuando hay sesión con descuento.
 * - "login_only": solo precio si hay sesión.
 *
 * `sesion` llega desde el layout de cuenta (Fase 3); en el resto del sitio
 * se omite y el componente asume visitante no identificado.
 */
export function PriceBlock({
  precioTarifa,
  unidadVenta,
  sesion,
  tamano = "lg",
}: {
  precioTarifa: number;
  unidadVenta: string;
  sesion?: SesionPrecioCliente | null;
  tamano?: "sm" | "lg";
}) {
  const { ivaIncluido } = useIva();
  const etiquetaIva = ivaIncluido ? "IVA incluido" : "sin IVA";
  const precioMostrar = (precio: number) => formateadorEUR.format(ivaIncluido ? conIva(precio) : precio);

  const claseTarifa = tamano === "lg" ? "text-3xl font-heading font-semibold" : "text-lg font-semibold";

  if (PRICING_MODE === "login_only" && !sesion) {
    return (
      <div className={tamano === "lg" ? "text-lg" : "text-sm"}>
        <p className="text-trade-gray-500">
          Precio disponible para clientes con cuenta.{" "}
          <a href="/cuenta/iniciar-sesion" className="font-medium text-trade-red hover:underline">
            Inicia sesión
          </a>{" "}
          o{" "}
          <a href="/contacto" className="font-medium text-trade-red hover:underline">
            solicita acceso
          </a>
          .
        </p>
      </div>
    );
  }

  const descuentoPorcentaje = PRICING_MODE === "public_plus_net" ? sesion?.descuentoPorcentaje : undefined;
  const precioNeto =
    descuentoPorcentaje !== undefined ? precioTarifa * (1 - descuentoPorcentaje / 100) : null;

  return (
    <div className="space-y-1">
      {precioNeto !== null ? (
        <>
          <p className="text-sm text-trade-gray-500">
            Tarifa <span className="line-through">{precioMostrar(precioTarifa)}</span>
          </p>
          <p className={claseTarifa + " text-trade-gray-900"}>
            {precioMostrar(precioNeto)}
            <span className="ml-2 text-sm font-normal text-trade-green">
              TU PRECIO (-{descuentoPorcentaje}%)
            </span>
          </p>
        </>
      ) : (
        <p className={claseTarifa + " text-trade-gray-900"}>{precioMostrar(precioTarifa)}</p>
      )}
      <p className="text-xs text-trade-gray-500">
        {etiquetaIva} · por {unidadVenta}
      </p>
    </div>
  );
}
