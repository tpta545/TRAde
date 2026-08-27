import { Package, Wrench, Truck, BadgeCheck } from "lucide-react";
import { siteConfig } from "@/config/site";

const ICONOS = [Package, Truck, Wrench, BadgeCheck];

export function TrustBar() {
  const items = [
    { titulo: siteConfig.ventajas[0].titulo, descripcion: "Stock real, verificable" },
    { titulo: "Entrega en 24 h", descripcion: "Reparto propio en la Comunitat Valenciana" },
    { titulo: siteConfig.ventajas[1].titulo, descripcion: siteConfig.ventajas[1].descripcion },
    { titulo: "Distribuidor oficial", descripcion: siteConfig.marcas.join(", ") },
  ];

  return (
    <div className="border-b border-trade-gray-200 bg-trade-white">
      <div className="mx-auto grid max-w-7xl grid-cols-2 gap-6 px-4 py-8 sm:px-6 md:grid-cols-4">
        {items.map((item, indice) => {
          const Icono = ICONOS[indice];
          return (
            <div key={item.titulo} className="flex items-start gap-3">
              <Icono className="mt-0.5 h-5 w-5 shrink-0 text-trade-red" aria-hidden />
              <div>
                <p className="text-sm font-semibold text-trade-gray-900">{item.titulo}</p>
                <p className="text-xs text-trade-gray-500">{item.descripcion}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
