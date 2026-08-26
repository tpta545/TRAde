import type { Producto } from "@/lib/schemas/producto";
import { siteConfig } from "@/config/site";

function formatearPlazo(plazoEntregaDias: number): string {
  if (plazoEntregaDias === 0) return "";
  if (plazoEntregaDias === 1) return "Entrega estimada mañana";
  return `Entrega estimada en ${plazoEntregaDias} días laborables`;
}

export function StockBadge({
  producto,
  compacto = false,
}: {
  producto: Pick<Producto, "stock" | "ubicacionStock" | "plazoEntregaDias">;
  compacto?: boolean;
}) {
  const enStock = producto.stock > 0;

  if (enStock) {
    return (
      <div className="flex items-center gap-2 text-sm font-medium text-trade-green">
        <span className="h-2 w-2 rounded-full bg-trade-green" aria-hidden />
        <span>
          En stock{!compacto && ` · ${producto.stock} uds`}
          {!compacto &&
            ` · Envío hoy si pides antes de las ${siteConfig.comercio.horaCorteEnvioMismoDia}`}
        </span>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2 text-sm font-medium text-trade-amber">
      <span className="h-2 w-2 rounded-full bg-trade-amber" aria-hidden />
      <span>Bajo pedido{!compacto && ` · ${formatearPlazo(producto.plazoEntregaDias)}`}</span>
    </div>
  );
}
