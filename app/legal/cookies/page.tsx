import type { Metadata } from "next";
import { AvisoPendienteJuridico } from "@/components/legal/aviso-pendiente-juridico";

export const metadata: Metadata = {
  title: "Política de cookies",
  robots: { index: false, follow: true },
  alternates: { canonical: "/legal/cookies" },
};

export default function CookiesPage() {
  return (
    <div className="mx-auto w-full max-w-2xl px-4 py-10 text-sm leading-relaxed text-trade-gray-900 sm:px-6">
      <h1 className="mb-6 text-2xl font-heading font-semibold text-trade-gray-900">
        Política de cookies
      </h1>
      <AvisoPendienteJuridico />

      <div className="space-y-6">
        <section>
          <h2 className="mb-2 font-semibold">1. Qué son las cookies</h2>
          <p>
            Las cookies son pequeños archivos que se almacenan en tu navegador al visitar una
            web. Este sitio usa cookies propias imprescindibles y, solo si las aceptas, cookies
            de analítica.
          </p>
        </section>

        <section>
          <h2 className="mb-2 font-semibold">2. Cookies que usamos</h2>
          <table className="w-full border-collapse text-left text-xs">
            <thead>
              <tr className="border-b border-trade-gray-200">
                <th className="py-2 pr-4">Cookie</th>
                <th className="py-2 pr-4">Finalidad</th>
                <th className="py-2 pr-4">Tipo</th>
                <th className="py-2">Duración</th>
              </tr>
            </thead>
            <tbody className="text-trade-gray-500">
              <tr className="border-b border-trade-gray-200">
                <td className="py-2 pr-4 font-mono">trade_sesion</td>
                <td className="py-2 pr-4">Mantener la sesión de tu cuenta B2B iniciada</td>
                <td className="py-2 pr-4">Propia, técnica (imprescindible)</td>
                <td className="py-2">30 días</td>
              </tr>
              <tr className="border-b border-trade-gray-200">
                <td className="py-2 pr-4 font-mono">trade:carrito</td>
                <td className="py-2 pr-4">Recordar el contenido de tu carrito</td>
                <td className="py-2 pr-4">localStorage, técnica (imprescindible)</td>
                <td className="py-2">Persistente en tu navegador</td>
              </tr>
              <tr className="border-b border-trade-gray-200">
                <td className="py-2 pr-4 font-mono">_ga, _gid…</td>
                <td className="py-2 pr-4">Analítica de visitas (Google Analytics 4 vía GTM)</td>
                <td className="py-2 pr-4">Tercero, analítica</td>
                <td className="py-2">Hasta 13 meses</td>
              </tr>
            </tbody>
          </table>
        </section>

        <section>
          <h2 className="mb-2 font-semibold">3. Cómo cambiar tu decisión</h2>
          <p>
            Puedes aceptar o rechazar las cookies de analítica en el banner que aparece en tu
            primera visita. Rechazar es igual de fácil que aceptar. También puedes borrar las
            cookies desde la configuración de tu navegador en cualquier momento.
          </p>
        </section>
      </div>
    </div>
  );
}
