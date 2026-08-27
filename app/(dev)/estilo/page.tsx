import type { Metadata } from "next";
import type { ReactNode } from "react";
import { StockBadge } from "@/components/producto/stock-badge";
import { PriceBlock } from "@/components/producto/price-block";
import { FaqAccordion } from "@/components/ui/faq-accordion";

export const metadata: Metadata = {
  title: "Guía de estilo",
  robots: { index: false, follow: false },
};

const COLORES = [
  { clase: "bg-trade-ink", nombre: "trade-ink", valor: "#111214", texto: "claro" },
  { clase: "bg-trade-graphite", nombre: "trade-graphite", valor: "#1e2024", texto: "claro" },
  { clase: "bg-trade-gray-900", nombre: "trade-gray-900", valor: "#2b2e33", texto: "claro" },
  { clase: "bg-trade-gray-500", nombre: "trade-gray-500", valor: "#6b7078", texto: "claro" },
  { clase: "bg-trade-gray-200", nombre: "trade-gray-200", valor: "#e4e6e9", texto: "oscuro" },
  { clase: "bg-trade-gray-050", nombre: "trade-gray-050", valor: "#f6f7f8", texto: "oscuro" },
  { clase: "bg-trade-white", nombre: "trade-white", valor: "#ffffff", texto: "oscuro" },
  { clase: "bg-trade-red", nombre: "trade-red", valor: "#d8232a", texto: "claro" },
  { clase: "bg-trade-red-dark", nombre: "trade-red-dark", valor: "#a4161c", texto: "claro" },
  { clase: "bg-trade-green", nombre: "trade-green (éxito / en stock)", valor: "#147d3f", texto: "claro" },
  { clase: "bg-trade-amber", nombre: "trade-amber (aviso / bajo pedido)", valor: "#b26a00", texto: "claro" },
] as const;

const ESCALA_TIPO = [
  { clase: "text-xs", etiqueta: "xs · 12px", uso: "leyendas, metadatos" },
  { clase: "text-sm", etiqueta: "sm · 14px", uso: "texto de interfaz, tablas" },
  { clase: "text-base", etiqueta: "base · 16px", uso: "cuerpo de texto" },
  { clase: "text-lg", etiqueta: "lg · 18px", uso: "intro de sección" },
  { clase: "text-2xl", etiqueta: "2xl · 24px", uso: "h2" },
  { clase: "text-3xl", etiqueta: "3xl · 32px", uso: "h1 de página" },
  { clase: "text-5xl", etiqueta: "5xl · 44px", uso: "hero, cifras grandes" },
] as const;

const RADIOS = [
  { clase: "rounded-sm", etiqueta: "sm" },
  { clase: "rounded-md", etiqueta: "md · por defecto" },
  { clase: "rounded-lg", etiqueta: "lg" },
  { clase: "rounded-xl", etiqueta: "xl" },
] as const;

const SOMBRAS = [
  { estilo: { boxShadow: "var(--shadow-sm)" }, etiqueta: "shadow-sm" },
  { estilo: { boxShadow: "var(--shadow-md)" }, etiqueta: "shadow-md" },
  { estilo: { boxShadow: "var(--shadow-lg)" }, etiqueta: "shadow-lg" },
] as const;

const PRODUCTO_STOCK = { stock: 8, ubicacionStock: "almacen" as const, plazoEntregaDias: 0 };
const PRODUCTO_BAJO_PEDIDO = { stock: 0, ubicacionStock: "proveedor" as const, plazoEntregaDias: 5 };

const FAQ_EJEMPLO = [
  {
    pregunta: "¿Esta página se indexa en Google?",
    respuesta: "No. Lleva robots: { index: false, follow: false } y no está enlazada desde ningún menú.",
  },
  {
    pregunta: "¿Dónde viven los tokens que se ven aquí?",
    respuesta: "En app/globals.css: paleta y escala tipográfica en @theme, componentes (.btn-*, .table-trade, .badge-stock-*) en @layer components.",
  },
];

function Seccion({ titulo, children }: { titulo: string; children: ReactNode }) {
  return (
    <section className="border-t border-trade-gray-200 py-10 first:border-t-0 first:pt-0">
      <h2 className="mb-6 font-heading text-2xl font-semibold text-trade-gray-900">{titulo}</h2>
      {children}
    </section>
  );
}

export default function EstiloPage() {
  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-10 sm:px-6">
      <p className="mb-1 font-mono text-xs uppercase tracking-wide text-trade-red">
        Página interna · no indexada
      </p>
      <h1 className="text-3xl font-heading font-semibold text-trade-gray-900 sm:text-4xl">
        Guía de estilo
      </h1>
      <p className="mt-3 max-w-2xl text-trade-gray-500">
        Referencia viva del sistema visual de TRADE (Parte V.4). Cada muestra usa las clases y
        tokens reales de <code className="font-mono text-sm">app/globals.css</code>, no
        aproximaciones — si algo cambia aquí, cambia en todo el sitio.
      </p>

      <Seccion titulo="Color">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
          {COLORES.map((color) => (
            <div key={color.nombre} className="overflow-hidden rounded-lg border border-trade-gray-200">
              <div
                className={`${color.clase} flex h-20 items-end p-3 ${color.texto === "claro" ? "text-trade-white" : "text-trade-gray-900"}`}
              >
                <span className="font-mono text-xs">{color.valor}</span>
              </div>
              <p className="px-3 py-2 text-xs text-trade-gray-500">{color.nombre}</p>
            </div>
          ))}
        </div>
      </Seccion>

      <Seccion titulo="Tipografía">
        <div className="space-y-4">
          {ESCALA_TIPO.map((item) => (
            <div key={item.clase} className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
              <span className="w-28 shrink-0 font-mono text-xs text-trade-gray-500">{item.etiqueta}</span>
              <span className={`${item.clase} font-heading text-trade-gray-900`}>
                Rodamiento 6205-2RS1
              </span>
              <span className="text-xs text-trade-gray-500">{item.uso}</span>
            </div>
          ))}
          <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
            <span className="w-28 shrink-0 font-mono text-xs text-trade-gray-500">mono</span>
            <span className="font-mono text-sm text-trade-gray-900">NTN 6205-2RS1-C3</span>
            <span className="text-xs text-trade-gray-500">referencias, precios, datos tabulares</span>
          </div>
        </div>
      </Seccion>

      <Seccion titulo="Radios y sombras">
        <div className="grid grid-cols-2 gap-6 sm:grid-cols-4">
          {RADIOS.map((radio) => (
            <div key={radio.clase} className="text-center">
              <div className={`${radio.clase} mx-auto h-16 w-16 bg-trade-gray-200`} />
              <p className="mt-2 font-mono text-xs text-trade-gray-500">{radio.etiqueta}</p>
            </div>
          ))}
        </div>
        <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-3">
          {SOMBRAS.map((sombra) => (
            <div key={sombra.etiqueta} className="text-center">
              <div
                className="mx-auto h-16 w-24 rounded-md bg-trade-white"
                style={sombra.estilo}
              />
              <p className="mt-2 font-mono text-xs text-trade-gray-500">{sombra.etiqueta}</p>
            </div>
          ))}
        </div>
      </Seccion>

      <Seccion titulo="Botones y foco">
        <div className="flex flex-wrap items-center gap-3">
          <button type="button" className="btn-primary">
            Añadir al carrito
          </button>
          <button type="button" className="btn-secondary">
            Solicitar diagnóstico
          </button>
          <button type="button" className="btn-ghost">
            Ver ficha
          </button>
          <button type="button" className="btn-primary" disabled>
            Enviando…
          </button>
        </div>
        <p className="mt-4 text-sm text-trade-gray-500">
          Pulsa <kbd className="rounded border border-trade-gray-200 px-1.5 py-0.5 font-mono text-xs">Tab</kbd> para
          ver el foco (trazo rojo de 2px, solo visible con teclado — no aparece al hacer clic con el ratón).
        </p>
      </Seccion>

      <Seccion titulo="Tabla">
        <div className="overflow-x-auto rounded-lg border border-trade-gray-200">
          <table className="table-trade">
            <thead>
              <tr>
                <th scope="col">Referencia</th>
                <th scope="col">Estado</th>
                <th className="text-right" scope="col">
                  Precio
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="font-mono text-trade-gray-900">NTN 6205-2RS1-C3</td>
                <td>
                  <StockBadge producto={PRODUCTO_STOCK} compacto />
                </td>
                <td className="text-right">
                  <PriceBlock precioTarifa={12.4} unidadVenta="ud" tamano="sm" />
                </td>
              </tr>
              <tr>
                <td className="font-mono text-trade-gray-900">ABB ACS580-01-12A7-4</td>
                <td>
                  <StockBadge producto={PRODUCTO_BAJO_PEDIDO} compacto />
                </td>
                <td className="text-right">
                  <PriceBlock precioTarifa={612} unidadVenta="ud" tamano="sm" />
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </Seccion>

      <Seccion titulo="Estados de stock">
        <div className="flex flex-wrap gap-8">
          <StockBadge producto={PRODUCTO_STOCK} />
          <StockBadge producto={PRODUCTO_BAJO_PEDIDO} />
        </div>
      </Seccion>

      <Seccion titulo="Motion">
        <div className="group h-24 w-48 cursor-default rounded-lg border border-trade-gray-200 bg-trade-white p-4 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md">
          <p className="text-sm font-medium text-trade-gray-900">Pasa el ratón</p>
          <p className="mt-1 text-xs text-trade-gray-500">transition, 120ms, ease estándar</p>
        </div>
        <p className="mt-4 text-sm text-trade-gray-500">
          Con <code className="font-mono text-xs">prefers-reduced-motion: reduce</code> activado en
          el sistema, todas las transiciones y animaciones del sitio se recortan a 0,01 ms.
        </p>
      </Seccion>

      <Seccion titulo="FAQ / acordeón">
        <div className="max-w-2xl">
          <FaqAccordion items={FAQ_EJEMPLO} />
        </div>
      </Seccion>
    </div>
  );
}
