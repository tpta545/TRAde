import type { Metadata } from "next";
import Link from "next/link";
import { FormularioLogin } from "@/components/cuenta/formulario-login";

export const metadata: Metadata = {
  title: "Iniciar sesión",
  robots: { index: false, follow: false },
};

export default function IniciarSesionPage() {
  return (
    <div className="mx-auto w-full max-w-sm px-4 py-16 sm:px-6">
      <h1 className="mb-6 text-2xl font-heading font-semibold text-trade-gray-900">Iniciar sesión</h1>
      <FormularioLogin />
      <p className="mt-6 text-center text-sm text-trade-gray-500">
        ¿Todavía no tienes cuenta B2B?{" "}
        <Link href="/cuenta/registro" className="font-medium text-trade-red hover:underline">
          Solicítala aquí
        </Link>
        .
      </p>
    </div>
  );
}
