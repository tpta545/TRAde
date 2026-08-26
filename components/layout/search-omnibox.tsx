"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";

type Sugerencias = {
  productos: { slug: string; familia: string; subfamilia: string; referencia: string; nombre: string; marca: string }[];
  familias: { slug: string; nombre: string }[];
  marcas: string[];
};

const VACIO: Sugerencias = { productos: [], familias: [], marcas: [] };

export function SearchOmnibox({ tamano = "md" }: { tamano?: "md" | "lg" }) {
  const router = useRouter();
  const [valor, setValor] = useState("");
  const [sugerencias, setSugerencias] = useState<Sugerencias>(VACIO);
  const [abierto, setAbierto] = useState(false);
  const contenedorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (valor.trim().length < 2) {
      setSugerencias(VACIO);
      return;
    }
    const controlador = new AbortController();
    const temporizador = setTimeout(() => {
      fetch(`/api/buscar/sugerencias?q=${encodeURIComponent(valor)}`, { signal: controlador.signal })
        .then((r) => r.json())
        .then((datos) => setSugerencias(datos))
        .catch(() => {});
    }, 150);
    return () => {
      clearTimeout(temporizador);
      controlador.abort();
    };
  }, [valor]);

  useEffect(() => {
    const cerrarSiFuera = (evento: MouseEvent) => {
      if (contenedorRef.current && !contenedorRef.current.contains(evento.target as Node)) {
        setAbierto(false);
      }
    };
    document.addEventListener("mousedown", cerrarSiFuera);
    return () => document.removeEventListener("mousedown", cerrarSiFuera);
  }, []);

  const hayResultados =
    sugerencias.productos.length + sugerencias.familias.length + sugerencias.marcas.length > 0;

  return (
    <div ref={contenedorRef} className="relative w-full">
      <form
        action="/buscar"
        method="GET"
        role="search"
        onSubmit={() => setAbierto(false)}
        className="relative"
      >
        <Search
          className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-trade-gray-500"
          aria-hidden
        />
        <input
          type="search"
          name="q"
          value={valor}
          onChange={(evento) => {
            setValor(evento.target.value);
            setAbierto(true);
          }}
          onFocus={() => setAbierto(true)}
          placeholder="Busca por referencia, marca o descripción — p. ej. 6205-2RS, ACS580, DSBC-32"
          autoComplete="off"
          className={
            "w-full rounded-md border border-trade-gray-200 bg-trade-white pl-9 pr-3 text-trade-gray-900 outline-none placeholder:text-trade-gray-500 focus:border-trade-red focus:ring-1 focus:ring-trade-red " +
            (tamano === "lg" ? "h-14 text-lg" : "h-10 text-sm")
          }
        />
      </form>

      {abierto && hayResultados && (
        <div className="absolute z-50 mt-1 w-full rounded-md border border-trade-gray-200 bg-trade-white py-2 shadow-lg">
          {sugerencias.productos.length > 0 && (
            <div className="px-2 pb-2">
              <p className="px-2 pb-1 text-xs font-semibold uppercase tracking-wide text-trade-gray-500">
                Productos
              </p>
              {sugerencias.productos.map((producto) => (
                <button
                  key={producto.slug}
                  type="button"
                  onClick={() => {
                    setAbierto(false);
                    router.push(`/productos/${producto.familia}/${producto.subfamilia}/${producto.slug}`);
                  }}
                  className="flex w-full flex-col items-start rounded px-2 py-1.5 text-left text-sm hover:bg-trade-gray-050"
                >
                  <span className="font-mono text-trade-gray-900">{producto.referencia}</span>
                  <span className="text-xs text-trade-gray-500">
                    {producto.marca} · {producto.nombre}
                  </span>
                </button>
              ))}
            </div>
          )}

          {sugerencias.familias.length > 0 && (
            <div className="border-t border-trade-gray-200 px-2 py-2">
              <p className="px-2 pb-1 text-xs font-semibold uppercase tracking-wide text-trade-gray-500">
                Familias
              </p>
              {sugerencias.familias.map((familia) => (
                <button
                  key={familia.slug}
                  type="button"
                  onClick={() => {
                    setAbierto(false);
                    router.push(`/productos/${familia.slug}`);
                  }}
                  className="block w-full rounded px-2 py-1.5 text-left text-sm text-trade-gray-900 hover:bg-trade-gray-050"
                >
                  {familia.nombre}
                </button>
              ))}
            </div>
          )}

          {sugerencias.marcas.length > 0 && (
            <div className="border-t border-trade-gray-200 px-2 py-2">
              <p className="px-2 pb-1 text-xs font-semibold uppercase tracking-wide text-trade-gray-500">
                Marcas
              </p>
              {sugerencias.marcas.map((marca) => (
                <button
                  key={marca}
                  type="button"
                  onClick={() => {
                    setAbierto(false);
                    router.push(`/marcas/${marca.toLowerCase()}`);
                  }}
                  className="block w-full rounded px-2 py-1.5 text-left text-sm text-trade-gray-900 hover:bg-trade-gray-050"
                >
                  {marca}
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
