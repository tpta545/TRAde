import Link from "next/link";
import { siteConfig } from "@/config/site";
import { Topbar } from "@/components/layout/topbar";
import { SearchOmnibox } from "@/components/layout/search-omnibox";
import { CartButton } from "@/components/carrito/cart-drawer";

export function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-trade-gray-200 bg-trade-white">
      <Topbar />
      <div className="mx-auto flex max-w-7xl items-center gap-4 px-4 py-3 sm:px-6">
        <Link href="/" className="font-heading text-2xl font-bold tracking-tight text-trade-gray-900">
          {siteConfig.marca}
        </Link>
        <div className="hidden flex-1 sm:block">
          <SearchOmnibox />
        </div>
        <nav className="ml-auto flex items-center gap-1 sm:ml-0">
          <Link
            href="/cuenta"
            className="hidden rounded-md px-3 py-2 text-sm font-medium text-trade-gray-900 hover:bg-trade-gray-050 sm:block"
          >
            Mi cuenta
          </Link>
          <CartButton />
        </nav>
      </div>
      <div className="border-t border-trade-gray-200 px-4 py-2 sm:hidden">
        <SearchOmnibox />
      </div>
    </header>
  );
}
