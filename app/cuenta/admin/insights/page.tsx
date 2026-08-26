import type { Metadata } from "next";
import { redirect, notFound } from "next/navigation";
import { obtenerSesion } from "@/lib/auth/session";
import { leerLeads } from "@/lib/leads/store";

export const metadata: Metadata = {
  title: "Insights",
  robots: { index: false, follow: false },
};

function contarPorClave(entradas: Record<string, unknown>[], clave: string): { valor: string; total: number }[] {
  const conteo = new Map<string, number>();
  for (const entrada of entradas) {
    const valor = String(entrada[clave] ?? "");
    if (!valor) continue;
    conteo.set(valor, (conteo.get(valor) ?? 0) + 1);
  }
  return Array.from(conteo, ([valor, total]) => ({ valor, total })).sort((a, b) => b.total - a.total);
}

export default async function InsightsPage() {
  const sesion = await obtenerSesion();
  if (!sesion) redirect("/cuenta/iniciar-sesion");
  if (sesion.rol !== "admin") notFound();

  const [busquedasSinResultado, vistasSinStock] = await Promise.all([
    leerLeads("busqueda_sin_resultados"),
    leerLeads("vista_sin_stock"),
  ]);

  const topBusquedas = contarPorClave(busquedasSinResultado, "consulta").slice(0, 20);
  const topVistasSinStock = contarPorClave(vistasSinStock, "referencia").slice(0, 20);

  return (
    <div className="space-y-10">
      <div>
        <h1 className="mb-1 text-2xl font-heading font-semibold text-trade-gray-900">
          Insights (admin)
        </h1>
        <p className="text-sm text-trade-gray-500">
          Datos reales acumulados desde que el sitio está en marcha. Sin datos inventados: lo que
          no se ha registrado todavía, no aparece.
        </p>
      </div>

      <section>
        <h2 className="mb-3 font-heading text-lg font-semibold text-trade-gray-900">
          Top búsquedas sin resultado ({busquedasSinResultado.length} total)
        </h2>
        {topBusquedas.length === 0 ? (
          <p className="text-sm text-trade-gray-500">Todavía no hay ninguna búsqueda sin resultado registrada.</p>
        ) : (
          <table className="w-full max-w-xl border-collapse text-sm">
            <tbody>
              {topBusquedas.map((item) => (
                <tr key={item.valor} className="border-b border-trade-gray-200">
                  <td className="py-2 font-mono text-trade-gray-900">{item.valor}</td>
                  <td className="py-2 text-right text-trade-gray-500">{item.total}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>

      <section>
        <h2 className="mb-3 font-heading text-lg font-semibold text-trade-gray-900">
          Referencias más vistas sin stock ({vistasSinStock.length} total)
        </h2>
        {topVistasSinStock.length === 0 ? (
          <p className="text-sm text-trade-gray-500">Todavía no hay ninguna vista de ficha sin stock registrada.</p>
        ) : (
          <table className="w-full max-w-xl border-collapse text-sm">
            <tbody>
              {topVistasSinStock.map((item) => (
                <tr key={item.valor} className="border-b border-trade-gray-200">
                  <td className="py-2 font-mono text-trade-gray-900">{item.valor}</td>
                  <td className="py-2 text-right text-trade-gray-500">{item.total}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>

      <section>
        <h2 className="mb-3 font-heading text-lg font-semibold text-trade-gray-900">
          Carritos abandonados por importe
        </h2>
        <p className="max-w-xl text-sm text-trade-gray-500">
          {"<<PENDIENTE>>"}: el carrito vive solo en el navegador del visitante (localStorage), así
          que hoy no hay visibilidad de servidor sobre carritos abandonados. Requiere seguimiento
          de sesión o cuenta de usuario en cada cambio de carrito antes de poder mostrar este dato
          — ver PENDIENTES.md. No se muestran cifras inventadas.
        </p>
      </section>
    </div>
  );
}
