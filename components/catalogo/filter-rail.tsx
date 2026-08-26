import Link from "next/link";
import type { FiltrosCatalogo } from "@/lib/catalog/filtros";
import type { SubfamiliaInfo } from "@/lib/data/familias";

function construirHref(base: string, params: URLSearchParams) {
  const query = params.toString();
  return query ? `${base}?${query}` : base;
}

export function FilterRail({
  basePath,
  filtros,
  marcasDisponibles,
  subfamiliasDisponibles,
  rangosAtributos,
}: {
  basePath: string;
  filtros: FiltrosCatalogo;
  marcasDisponibles: { marca: string; total: number }[];
  subfamiliasDisponibles?: { info: SubfamiliaInfo; total: number }[];
  rangosAtributos: Record<string, [number, number]>;
}) {
  const marcasActivas = new Set(filtros.marca ?? []);

  const hrefToggleMarca = (marca: string) => {
    const params = new URLSearchParams();
    const nuevasMarcas = marcasActivas.has(marca)
      ? [...marcasActivas].filter((m) => m !== marca)
      : [...marcasActivas, marca];
    if (nuevasMarcas.length) params.set("marca", nuevasMarcas.join(","));
    if (filtros.subfamilia?.length) params.set("subfamilia", filtros.subfamilia.join(","));
    if (filtros.soloStock) params.set("stock", "1");
    if (filtros.orden && filtros.orden !== "relevancia") params.set("orden", filtros.orden);
    return construirHref(basePath, params);
  };

  return (
    <aside className="w-full shrink-0 space-y-6 sm:w-56">
      <form method="GET" action={basePath} className="space-y-6">
        {filtros.marca?.length ? <input type="hidden" name="marca" value={filtros.marca.join(",")} /> : null}
        {filtros.subfamilia?.length ? (
          <input type="hidden" name="subfamilia" value={filtros.subfamilia.join(",")} />
        ) : null}
        {filtros.soloStock ? <input type="hidden" name="stock" value="1" /> : null}

        <div>
          <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-trade-gray-500">Marca</h3>
          <ul className="space-y-1.5 text-sm">
            {marcasDisponibles.map(({ marca, total }) => (
              <li key={marca}>
                <Link
                  href={hrefToggleMarca(marca)}
                  className={
                    "flex items-center justify-between rounded px-1.5 py-1 hover:bg-trade-gray-050 " +
                    (marcasActivas.has(marca) ? "font-medium text-trade-red" : "text-trade-gray-900")
                  }
                >
                  <span>{marca}</span>
                  <span className="text-xs text-trade-gray-500">{total}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {subfamiliasDisponibles && subfamiliasDisponibles.length > 0 && (
          <div>
            <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-trade-gray-500">
              Subfamilia
            </h3>
            <ul className="space-y-1.5 text-sm">
              {subfamiliasDisponibles.map(({ info, total }) => (
                <li key={info.slug}>
                  <label className="flex cursor-pointer items-center justify-between gap-2 rounded px-1.5 py-1 hover:bg-trade-gray-050">
                    <span className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        name="subfamilia"
                        value={info.slug}
                        defaultChecked={filtros.subfamilia?.includes(info.slug)}
                        className="h-3.5 w-3.5 accent-trade-red"
                      />
                      {info.nombre}
                    </span>
                    <span className="text-xs text-trade-gray-500">{total}</span>
                  </label>
                </li>
              ))}
            </ul>
          </div>
        )}

        <div>
          <label className="flex cursor-pointer items-center gap-2 text-sm text-trade-gray-900">
            <input
              type="checkbox"
              name="stock"
              value="1"
              defaultChecked={filtros.soloStock}
              className="h-3.5 w-3.5 accent-trade-red"
            />
            Solo en stock
          </label>
        </div>

        <div>
          <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-trade-gray-500">
            Precio (€, sin IVA)
          </h3>
          <div className="flex items-center gap-2">
            <input
              type="number"
              name="precioMin"
              placeholder="Mín."
              defaultValue={filtros.precioMin}
              className="w-full rounded border border-trade-gray-200 px-2 py-1 text-sm"
            />
            <span className="text-trade-gray-500">–</span>
            <input
              type="number"
              name="precioMax"
              placeholder="Máx."
              defaultValue={filtros.precioMax}
              className="w-full rounded border border-trade-gray-200 px-2 py-1 text-sm"
            />
          </div>
        </div>

        {Object.entries(rangosAtributos).map(([clave, [min, max]]) => (
          <div key={clave}>
            <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-trade-gray-500">
              {clave}
            </h3>
            <div className="flex items-center gap-2">
              <input
                type="number"
                name={`attr_${clave}_min`}
                placeholder={String(min)}
                className="w-full rounded border border-trade-gray-200 px-2 py-1 text-sm"
              />
              <span className="text-trade-gray-500">–</span>
              <input
                type="number"
                name={`attr_${clave}_max`}
                placeholder={String(max)}
                className="w-full rounded border border-trade-gray-200 px-2 py-1 text-sm"
              />
            </div>
          </div>
        ))}

        <button
          type="submit"
          className="w-full rounded-md border border-trade-gray-200 py-2 text-sm font-medium text-trade-gray-900 hover:bg-trade-gray-050"
        >
          Aplicar filtros
        </button>
        {(filtros.marca?.length ||
          filtros.subfamilia?.length ||
          filtros.soloStock ||
          filtros.precioMin ||
          filtros.precioMax) && (
          <Link href={basePath} className="block text-center text-xs text-trade-gray-500 hover:underline">
            Quitar filtros
          </Link>
        )}
      </form>
    </aside>
  );
}
