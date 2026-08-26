import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { obtenerSesion } from "@/lib/auth/session";
import { getListasDeUsuario } from "@/lib/cuenta/listas-actions";
import { FormularioNuevaLista } from "@/components/cuenta/formulario-nueva-lista";
import { ListaCompraCard } from "@/components/cuenta/lista-compra-card";

export const metadata: Metadata = {
  title: "Listas de compra",
  robots: { index: false, follow: false },
};

export default async function ListasPage() {
  const sesion = await obtenerSesion();
  if (!sesion) redirect("/cuenta/iniciar-sesion");

  const listas = await getListasDeUsuario(sesion.id);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="mb-1 text-2xl font-heading font-semibold text-trade-gray-900">
          Listas de compra
        </h1>
        <p className="text-sm text-trade-gray-500">
          Guarda tus referencias por máquina o línea de producción para pedirlas de golpe.
        </p>
      </div>

      <FormularioNuevaLista />

      {listas.length > 0 && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {listas.map((lista) => (
            <ListaCompraCard key={lista.id} lista={lista} />
          ))}
        </div>
      )}
    </div>
  );
}
