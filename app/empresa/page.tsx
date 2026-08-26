import type { Metadata } from "next";
import { siteConfig } from "@/config/site";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";

export const metadata: Metadata = {
  title: "Empresa",
  description: `Quiénes somos: ${siteConfig.razonSocial}, distribuidor industrial en Algemesí (Valencia).`,
  alternates: { canonical: "/empresa" },
};

export default function EmpresaPage() {
  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-10 sm:px-6">
      <Breadcrumbs items={[{ nombre: "Empresa", url: "/empresa" }]} />
      <h1 className="mt-2 text-3xl font-heading font-semibold text-trade-gray-900">
        {siteConfig.razonSocial}
      </h1>

      <div className="mt-6 space-y-4 text-sm leading-relaxed text-trade-gray-900">
        <p>
          Somos distribuidor oficial de {siteConfig.marcas.join(", ")} en transmisión de
          potencia, suministro industrial y recambio, con almacén propio en{" "}
          {siteConfig.direccion.localidad} ({siteConfig.direccion.provincia}) y reparto propio en
          toda la Comunitat Valenciana.
        </p>
        <p>
          Además de la venta de producto, tenemos servicio técnico propio de reparación de
          motores, variadores y equipos industriales, con diagnóstico, presupuesto cerrado antes
          de intervenir e informe técnico de reparación al entregarlo.
        </p>
      </div>

      <div className="mt-10 rounded-lg border border-dashed border-trade-gray-200 p-6">
        <p className="text-sm font-medium text-trade-gray-900">{"<<PENDIENTE>>"}</p>
        <p className="mt-2 text-sm text-trade-gray-500">
          Esta página necesita, para estar completa según la Parte 7.1 y la Parte D.3 del prompt:
          fotos reales del almacén, del equipo y de la furgoneta de reparto (nada de banco de
          imágenes), año de fundación, número de empleados, m² de almacén y certificaciones si
          las hay. Ver <code className="font-mono">PENDIENTES.md</code>.
        </p>
      </div>

      <div className="mt-8 grid grid-cols-1 gap-4 text-sm sm:grid-cols-2">
        <div>
          <p className="font-medium text-trade-gray-900">Dirección</p>
          <p className="text-trade-gray-500">
            {siteConfig.direccion.calle}
            <br />
            {siteConfig.direccion.codigoPostal} {siteConfig.direccion.localidad} (
            {siteConfig.direccion.provincia})
          </p>
        </div>
        <div>
          <p className="font-medium text-trade-gray-900">Horario</p>
          <p className="text-trade-gray-500">{siteConfig.horario.texto}</p>
        </div>
      </div>
    </div>
  );
}
