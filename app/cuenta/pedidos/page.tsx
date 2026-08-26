import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { obtenerSesion } from "@/lib/auth/session";
import { getPedidosDeUsuario, getPedidosPendientesDeAprobar } from "@/lib/pedidos/store";
import { RepetirPedidoBoton } from "@/components/cuenta/repetir-pedido-boton";
import { AprobacionBotones } from "@/components/cuenta/aprobacion-botones";

export const metadata: Metadata = {
  title: "Mis pedidos",
  robots: { index: false, follow: false },
};

const formateadorEUR = new Intl.NumberFormat("es-ES", { style: "currency", currency: "EUR" });

const ETIQUETAS_ESTADO: Record<string, string> = {
  pendiente_aprobacion: "Pendiente de aprobar",
  pendiente_pago: "Pendiente de pago",
  confirmado: "Confirmado",
  preparando: "Preparando",
  enviado: "Enviado",
  entregado: "Entregado",
  cancelado: "Cancelado",
};

export default async function PedidosPage() {
  const sesion = await obtenerSesion();
  if (!sesion) redirect("/cuenta/iniciar-sesion");

  const [pedidos, pendientesDeAprobar] = await Promise.all([
    getPedidosDeUsuario(sesion.id),
    sesion.rol === "aprobador" ? getPedidosPendientesDeAprobar(sesion.empresa) : Promise.resolve([]),
  ]);

  return (
    <div className="space-y-10">
      {pendientesDeAprobar.length > 0 && (
        <section>
          <h2 className="mb-3 font-heading text-lg font-semibold text-trade-gray-900">
            Pedidos de {sesion.empresa} pendientes de aprobar
          </h2>
          <div className="space-y-3">
            {pendientesDeAprobar.map((pedido) => (
              <div key={pedido.id} className="rounded-lg border border-trade-amber p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-mono text-sm text-trade-gray-900">{pedido.numero}</p>
                    <p className="text-xs text-trade-gray-500">
                      {pedido.personaContacto} · {formateadorEUR.format(pedido.total)}
                    </p>
                  </div>
                  <AprobacionBotones pedidoId={pedido.id} />
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      <section>
        <h1 className="mb-3 text-2xl font-heading font-semibold text-trade-gray-900">Mis pedidos</h1>
        {pedidos.length === 0 ? (
          <p className="text-sm text-trade-gray-500">
            Todavía no has hecho ningún pedido.{" "}
            <Link href="/productos" className="text-trade-red hover:underline">
              Ver catálogo →
            </Link>
          </p>
        ) : (
          <div className="divide-y divide-trade-gray-200 border-y border-trade-gray-200">
            {pedidos.map((pedido) => (
              <div key={pedido.id} className="flex flex-wrap items-center justify-between gap-3 py-4">
                <div>
                  <Link href={`/pedido/${pedido.id}`} className="font-mono text-sm text-trade-gray-900 hover:underline">
                    {pedido.numero}
                  </Link>
                  <p className="text-xs text-trade-gray-500">
                    {new Date(pedido.fecha).toLocaleDateString("es-ES")} ·{" "}
                    {ETIQUETAS_ESTADO[pedido.estado] ?? pedido.estado} ·{" "}
                    {formateadorEUR.format(pedido.total)}
                  </p>
                </div>
                <RepetirPedidoBoton lineas={pedido.lineas} />
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
