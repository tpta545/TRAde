import type { Metadata } from "next";
import { obtenerSesion } from "@/lib/auth/session";
import { CheckoutForm } from "@/components/checkout/checkout-form";

export const metadata: Metadata = {
  title: "Finalizar pedido",
  robots: { index: false, follow: false },
};

export default async function CheckoutPage() {
  const sesion = await obtenerSesion();

  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-10 sm:px-6">
      <h1 className="mb-8 text-2xl font-heading font-semibold text-trade-gray-900">Finalizar pedido</h1>
      <CheckoutForm sesion={sesion} />
    </div>
  );
}
