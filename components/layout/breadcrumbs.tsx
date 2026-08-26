import Link from "next/link";
import { ChevronRight } from "lucide-react";

export type MigaPan = { nombre: string; url: string };

export function Breadcrumbs({ items }: { items: MigaPan[] }) {
  return (
    <nav aria-label="Migas de pan" className="flex flex-wrap items-center gap-1 text-xs text-trade-gray-500">
      <Link href="/" className="hover:text-trade-gray-900">
        Inicio
      </Link>
      {items.map((item, indice) => (
        <span key={item.url} className="flex items-center gap-1">
          <ChevronRight className="h-3 w-3" aria-hidden />
          {indice === items.length - 1 ? (
            <span aria-current="page" className="text-trade-gray-900">
              {item.nombre}
            </span>
          ) : (
            <Link href={item.url} className="hover:text-trade-gray-900">
              {item.nombre}
            </Link>
          )}
        </span>
      ))}
    </nav>
  );
}
