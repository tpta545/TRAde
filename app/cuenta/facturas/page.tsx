import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { obtenerSesion } from "@/lib/auth/session";

export const metadata: Metadata = {
  title: "Facturas",
  robots: { index: false, follow: false },
};

export default async function FacturasPage() {
  const sesion = await obtenerSesion();
  if (!sesion) redirect("/cuenta/iniciar-sesion");

  return (
    <div>
      <h1 className="mb-1 text-2xl font-heading font-semibold text-trade-gray-900">Facturas</h1>
      <p className="mb-6 text-sm text-trade-gray-500">Estado de cuenta y facturas de tus pedidos.</p>

      <div className="rounded-lg border border-dashed border-trade-gray-200 p-8 text-center">
        <p className="text-sm text-trade-gray-500">
          Todavía no hay facturas conectadas a esta cuenta.
        </p>
        <p className="mt-2 mx-auto max-w-md text-xs text-trade-gray-500">
          {"<<PENDIENTE>>"}: la web solo <em>expone</em> facturas emitidas por el ERP, nunca las
          genera ella misma — es un requisito de Verifactu (obligatorio para sociedades desde el 1
          de enero de 2027, Parte 10 del prompt). Esta pantalla se conecta a la numeración real de
          facturación en la Fase 5, cuando haya sincronización con el ERP.
        </p>
      </div>
    </div>
  );
}
