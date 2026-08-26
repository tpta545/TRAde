import Link from "next/link";
import { siteConfig } from "@/config/site";

export function BrandGrid() {
  return (
    <section className="border-y border-trade-gray-200 bg-trade-gray-050">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
        <h2 className="mb-6 text-2xl font-heading font-semibold text-trade-gray-900">
          Comprar por marca
        </h2>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-5">
          {siteConfig.marcas.map((marca) => (
            <Link
              key={marca}
              href={`/marcas/${marca.toLowerCase()}`}
              className="flex h-24 items-center justify-center rounded-lg border border-trade-gray-200 bg-trade-white font-heading text-xl font-semibold text-trade-gray-500 transition-colors hover:border-trade-red hover:text-trade-red"
            >
              {marca}
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
