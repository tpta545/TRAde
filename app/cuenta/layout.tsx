import Link from "next/link";
import { obtenerSesion } from "@/lib/auth/session";
import { cerrarSesionAction } from "@/lib/auth/actions";

const ENLACES = [
  { href: "/cuenta", label: "Resumen" },
  { href: "/cuenta/pedidos", label: "Mis pedidos" },
  { href: "/cuenta/pedido-rapido", label: "Pedido rápido" },
  { href: "/cuenta/mis-referencias", label: "Mis referencias" },
  { href: "/cuenta/listas", label: "Listas de compra" },
  { href: "/cuenta/presupuestos", label: "Presupuestos" },
  { href: "/cuenta/facturas", label: "Facturas" },
  { href: "/cuenta/equipos", label: "Mis equipos" },
];

export default async function CuentaLayout({ children }: { children: React.ReactNode }) {
  const sesion = await obtenerSesion();

  if (!sesion) {
    return <div className="mx-auto w-full max-w-5xl px-4 sm:px-6">{children}</div>;
  }

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-8 px-4 py-10 sm:px-6 md:flex-row">
      <aside className="w-full shrink-0 md:w-56">
        <div className="mb-4">
          <p className="text-sm font-medium text-trade-gray-900">{sesion.nombre}</p>
          <p className="text-xs text-trade-gray-500">{sesion.empresa}</p>
        </div>
        <nav className="space-y-1">
          {ENLACES.map((enlace) => (
            <Link
              key={enlace.href}
              href={enlace.href}
              className="block rounded-md px-3 py-2 text-sm text-trade-gray-900 hover:bg-trade-gray-050"
            >
              {enlace.label}
            </Link>
          ))}
          {sesion.rol === "admin" && (
            <Link
              href="/cuenta/admin/insights"
              className="block rounded-md px-3 py-2 text-sm text-trade-gray-900 hover:bg-trade-gray-050"
            >
              Insights (admin)
            </Link>
          )}
        </nav>
        <form action={cerrarSesionAction} className="mt-4">
          <button type="submit" className="px-3 py-2 text-sm text-trade-gray-500 hover:text-trade-red">
            Cerrar sesión
          </button>
        </form>
      </aside>
      <div className="flex-1">{children}</div>
    </div>
  );
}
