import Link from "next/link";
import { siteConfig } from "@/config/site";

export default function Home() {
  return (
    <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col items-start justify-center gap-4 px-6 py-24">
      <p className="font-mono text-xs uppercase tracking-wide text-trade-gray-500">
        Fase 0 — cimientos
      </p>
      <h1 className="text-3xl font-heading font-semibold text-trade-gray-900">
        {siteConfig.marca}
      </h1>
      <p className="max-w-xl text-trade-gray-500">
        Esta home todavía no lleva el diseño definitivo (llega en la Fase 4). Lo que hay
        montado hoy es la base técnica: tipos de datos, capa de acceso a datos y catálogo
        de verificación.
      </p>
      <Link
        href="/productos"
        className="rounded-md bg-trade-red px-4 py-2 text-sm font-medium text-trade-white hover:bg-trade-red-dark"
      >
        Ver catálogo de verificación →
      </Link>
    </main>
  );
}
