import type { Metadata } from "next";
import Link from "next/link";
import { obtenerSesion } from "@/lib/auth/session";
import { getPedidosDeUsuario, getPedidosPendientesDeAprobar } from "@/lib/pedidos/store";

export const metadata: Metadata = {
  title: "Mi cuenta",
  robots: { index: false, follow: false },
};

export default async function CuentaPage() {
  const sesion = await obtenerSesion();

  if (!sesion) {
    return (
      <div className="grid grid-cols-1 gap-6 py-16 sm:grid-cols-2">
        <div className="rounded-lg border border-trade-gray-200 p-6 text-center">
          <h1 className="mb-2 font-heading text-xl font-semibold text-trade-gray-900">
            Ya tengo cuenta
          </h1>
          <Link href="/cuenta/iniciar-sesion" className="text-sm font-medium text-trade-red hover:underline">
            Iniciar sesión →
          </Link>
        </div>
        <div className="rounded-lg border border-trade-gray-200 p-6 text-center">
          <h1 className="mb-2 font-heading text-xl font-semibold text-trade-gray-900">
            Todavía no tengo cuenta
          </h1>
          <Link href="/cuenta/registro" className="text-sm font-medium text-trade-red hover:underline">
            Solicitar cuenta B2B →
          </Link>
        </div>
      </div>
    );
  }

  const [pedidos, pendientesDeAprobar] = await Promise.all([
    getPedidosDeUsuario(sesion.id),
    sesion.rol === "aprobador" ? getPedidosPendientesDeAprobar(sesion.empresa) : Promise.resolve([]),
  ]);

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-heading font-semibold text-trade-gray-900">
        Hola, {sesion.nombre.split(" ")[0]}
      </h1>

      {pendientesDeAprobar.length > 0 && (
        <div className="rounded-lg border border-trade-amber bg-amber-50 p-4">
          <p className="text-sm font-medium text-trade-gray-900">
            Tienes {pendientesDeAprobar.length} pedido{pendientesDeAprobar.length === 1 ? "" : "s"} de tu
            empresa pendiente{pendientesDeAprobar.length === 1 ? "" : "s"} de aprobar.
          </p>
          <Link href="/cuenta/pedidos" className="text-sm font-medium text-trade-red hover:underline">
            Revisar →
          </Link>
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Link href="/cuenta/pedido-rapido" className="rounded-lg border border-trade-gray-200 p-4 hover:bg-trade-gray-050">
          <p className="font-medium text-trade-gray-900">Pedido rápido</p>
          <p className="text-xs text-trade-gray-500">Pega tu lista habitual de referencias</p>
        </Link>
        <Link href="/cuenta/pedidos" className="rounded-lg border border-trade-gray-200 p-4 hover:bg-trade-gray-050">
          <p className="font-medium text-trade-gray-900">Mis pedidos</p>
          <p className="text-xs text-trade-gray-500">{pedidos.length} pedidos realizados</p>
        </Link>
        <Link href="/cuenta/listas" className="rounded-lg border border-trade-gray-200 p-4 hover:bg-trade-gray-050">
          <p className="font-medium text-trade-gray-900">Listas de compra</p>
          <p className="text-xs text-trade-gray-500">Por máquina o línea de producción</p>
        </Link>
      </div>
    </div>
  );
}
