import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { obtenerSesion } from "@/lib/auth/session";
import { getPresupuestosDeUsuario } from "@/lib/cuenta/presupuestos-actions";
import { FormularioPresupuesto } from "@/components/cuenta/formulario-presupuesto";
import { ConvertirPresupuestoBoton } from "@/components/cuenta/convertir-presupuesto-boton";

export const metadata: Metadata = {
  title: "Presupuestos",
  robots: { index: false, follow: false },
};

export default async function PresupuestosPage() {
  const sesion = await obtenerSesion();
  if (!sesion) redirect("/cuenta/iniciar-sesion");

  const presupuestos = await getPresupuestosDeUsuario(sesion.id);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="mb-1 text-2xl font-heading font-semibold text-trade-gray-900">Presupuestos</h1>
        <p className="text-sm text-trade-gray-500">
          Pide precio para cantidades grandes o referencias que no ves publicadas.
        </p>
      </div>

      <FormularioPresupuesto />

      {presupuestos.length > 0 && (
        <div className="space-y-3">
          {presupuestos.map((presupuesto) => (
            <div key={presupuesto.id} className="rounded-lg border border-trade-gray-200 p-4">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="whitespace-pre-line font-mono text-xs text-trade-gray-900">
                    {presupuesto.referencias}
                  </p>
                  <p className="mt-1 text-xs text-trade-gray-500">
                    {new Date(presupuesto.fecha).toLocaleDateString("es-ES")}
                  </p>
                </div>
                <span
                  className={
                    "shrink-0 rounded-full px-2.5 py-1 text-xs font-medium " +
                    (presupuesto.estado === "recibido"
                      ? "bg-green-50 text-trade-green"
                      : "bg-trade-gray-050 text-trade-gray-500")
                  }
                >
                  {presupuesto.estado === "recibido" ? "Respondido" : "Solicitado"}
                </span>
              </div>
              {presupuesto.estado === "recibido" && presupuesto.itemsPropuestos.length > 0 ? (
                <div className="mt-3">
                  <ConvertirPresupuestoBoton presupuesto={presupuesto} />
                </div>
              ) : (
                <p className="mt-2 text-xs text-trade-gray-500">
                  Te respondemos por teléfono o email en menos de 24 h laborables.
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
