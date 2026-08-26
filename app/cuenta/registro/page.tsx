import type { Metadata } from "next";
import { FormularioRegistro } from "@/components/cuenta/formulario-registro";

export const metadata: Metadata = {
  title: "Solicitar cuenta B2B",
  robots: { index: false, follow: false },
};

export default function RegistroPage() {
  return (
    <div className="mx-auto w-full max-w-sm px-4 py-16 sm:px-6">
      <h1 className="mb-2 text-2xl font-heading font-semibold text-trade-gray-900">Solicitar cuenta B2B</h1>
      <p className="mb-6 text-sm text-trade-gray-500">
        Revisamos tu solicitud y activamos tu cuenta con tu descuento y condiciones de pago en
        menos de 24 h laborables.
      </p>
      <FormularioRegistro />
    </div>
  );
}
