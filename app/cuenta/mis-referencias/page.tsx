import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { obtenerSesion } from "@/lib/auth/session";
import { getPedidosDeUsuario } from "@/lib/pedidos/store";
import type { LineaPedido } from "@/lib/pedidos/pedido";
import { AñadirReferenciaBoton } from "@/components/cuenta/añadir-referencia-boton";

export const metadata: Metadata = {
  title: "Mis referencias",
  robots: { index: false, follow: false },
};

const formateadorEUR = new Intl.NumberFormat("es-ES", { style: "currency", currency: "EUR" });

export default async function MisReferenciasPage() {
  const sesion = await obtenerSesion();
  if (!sesion) redirect("/cuenta/iniciar-sesion");

  const pedidos = await getPedidosDeUsuario(sesion.id);

  const referencias = new Map<string, LineaPedido & { vecesComprada: number }>();
  for (const pedido of pedidos) {
    for (const linea of pedido.lineas) {
      const existente = referencias.get(linea.productoId);
      if (existente) {
        existente.vecesComprada += 1;
      } else {
        referencias.set(linea.productoId, { ...linea, vecesComprada: 1 });
      }
    }
  }
  const listado = Array.from(referencias.values()).sort((a, b) => b.vecesComprada - a.vecesComprada);

  return (
    <div>
      <h1 className="mb-1 text-2xl font-heading font-semibold text-trade-gray-900">Mis referencias</h1>
      <p className="mb-6 text-sm text-trade-gray-500">
        Lo que ya nos has comprado, para pedirlo de nuevo en un clic.
      </p>

      {listado.length === 0 ? (
        <p className="text-sm text-trade-gray-500">Todavía no tienes ningún pedido registrado.</p>
      ) : (
        <div className="divide-y divide-trade-gray-200 border-y border-trade-gray-200">
          {listado.map((linea) => (
            <div key={linea.productoId} className="flex items-center justify-between gap-4 py-3">
              <div>
                <p className="font-mono text-sm text-trade-gray-900">{linea.referencia}</p>
                <p className="text-xs text-trade-gray-500">
                  {linea.nombre} · comprada {linea.vecesComprada} vez{linea.vecesComprada === 1 ? "" : "es"} ·{" "}
                  {formateadorEUR.format(linea.precioUnitario)}/ud
                </p>
              </div>
              <AñadirReferenciaBoton linea={linea} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
