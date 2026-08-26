import type { Metadata } from "next";
import { QuickOrderPad } from "@/components/cuenta/quick-order-pad";

export const metadata: Metadata = {
  title: "Pedido rápido",
  robots: { index: false, follow: false },
};

export default function PedidoRapidoPage() {
  return (
    <div className="mx-auto w-full max-w-2xl px-4 py-10 sm:px-6">
      <h1 className="text-2xl font-heading font-semibold text-trade-gray-900">Pedido rápido</h1>
      <p className="mt-2 text-sm text-trade-gray-500">
        Para clientes recurrentes: pega tu lista de referencias y cantidades habituales y las
        añadimos todas al carrito de una vez.
      </p>
      <div className="mt-8">
        <QuickOrderPad />
      </div>
    </div>
  );
}
