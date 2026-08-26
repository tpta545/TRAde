import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { obtenerSesion } from "@/lib/auth/session";
import { getEquiposDeUsuario } from "@/lib/cuenta/equipos-actions";
import { FormularioEquipo } from "@/components/cuenta/formulario-equipo";
import { EliminarEquipoBoton } from "@/components/cuenta/eliminar-equipo-boton";

export const metadata: Metadata = {
  title: "Mis equipos",
  robots: { index: false, follow: false },
};

export default async function EquiposPage() {
  const sesion = await obtenerSesion();
  if (!sesion) redirect("/cuenta/iniciar-sesion");

  const equipos = await getEquiposDeUsuario(sesion.id);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="mb-1 text-2xl font-heading font-semibold text-trade-gray-900">Mis equipos</h1>
        <p className="text-sm text-trade-gray-500">
          Registra tus máquinas para llevar el histórico de recambios y reparaciones.
        </p>
      </div>

      <FormularioEquipo />

      {equipos.length > 0 && (
        <div className="divide-y divide-trade-gray-200 border-y border-trade-gray-200">
          {equipos.map((equipo) => (
            <div key={equipo.id} className="flex items-center justify-between gap-4 py-3">
              <div>
                <p className="text-sm font-medium text-trade-gray-900">{equipo.nombre}</p>
                <p className="text-xs text-trade-gray-500">
                  {[equipo.marca, equipo.modelo, equipo.ubicacion].filter(Boolean).join(" · ")}
                </p>
              </div>
              <EliminarEquipoBoton equipoId={equipo.id} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
