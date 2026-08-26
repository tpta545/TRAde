"use client";

import { useRouter } from "next/navigation";
import type { OrdenCatalogo } from "@/lib/catalog/filtros";

const OPCIONES: { valor: OrdenCatalogo; etiqueta: string }[] = [
  { valor: "relevancia", etiqueta: "Relevancia" },
  { valor: "precio-asc", etiqueta: "Precio: menor a mayor" },
  { valor: "precio-desc", etiqueta: "Precio: mayor a menor" },
  { valor: "referencia", etiqueta: "Referencia" },
  { valor: "disponibilidad", etiqueta: "Disponibilidad" },
];

export function OrderSelect({
  basePath,
  ordenActual,
  queryActual,
}: {
  basePath: string;
  ordenActual: OrdenCatalogo;
  /** resto de filtros ya aplicados, para no perderlos al cambiar el orden */
  queryActual: Record<string, string>;
}) {
  const router = useRouter();

  return (
    <div className="flex items-center gap-2">
      <label htmlFor="orden-select" className="text-trade-gray-500">
        Ordenar por
      </label>
      <select
        id="orden-select"
        defaultValue={ordenActual}
        onChange={(evento) => {
          const params = new URLSearchParams(queryActual);
          if (evento.target.value === "relevancia") {
            params.delete("orden");
          } else {
            params.set("orden", evento.target.value);
          }
          const query = params.toString();
          router.push(query ? `${basePath}?${query}` : basePath);
        }}
        className="rounded-md border border-trade-gray-200 px-2 py-1.5 text-sm"
      >
        {OPCIONES.map((opcion) => (
          <option key={opcion.valor} value={opcion.valor}>
            {opcion.etiqueta}
          </option>
        ))}
      </select>
    </div>
  );
}
