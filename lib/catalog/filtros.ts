import type { Producto } from "@/lib/schemas/producto";

export const PRODUCTOS_POR_PAGINA = 24;

export type OrdenCatalogo = "relevancia" | "precio-asc" | "precio-desc" | "referencia" | "disponibilidad";

export type FiltrosCatalogo = {
  marca?: string[];
  subfamilia?: string[];
  soloStock?: boolean;
  precioMin?: number;
  precioMax?: number;
  /** clave de atributo -> [min, max] (solo atributos numéricos) */
  atributos?: Record<string, [number, number]>;
  orden?: OrdenCatalogo;
  pagina?: number;
};

/** searchParams de Next (string | string[] | undefined) -> FiltrosCatalogo tipado */
export function filtrosDesdeSearchParams(
  searchParams: Record<string, string | string[] | undefined>,
): FiltrosCatalogo {
  const comoLista = (valor: string | string[] | undefined): string[] | undefined => {
    if (!valor) return undefined;
    const lista = Array.isArray(valor) ? valor : valor.split(",");
    return lista.filter(Boolean);
  };

  const comoNumero = (valor: string | string[] | undefined): number | undefined => {
    const v = Array.isArray(valor) ? valor[0] : valor;
    const n = v ? Number(v) : undefined;
    return n !== undefined && !Number.isNaN(n) ? n : undefined;
  };

  // El FilterRail manda un rango por atributo como dos campos de formulario
  // separados: attr_<Clave>_min y attr_<Clave>_max (no se puede combinar en
  // un único valor sin JS en un <form method="GET"> nativo).
  const rangosParciales: Record<string, { min?: number; max?: number }> = {};
  for (const [clave, valor] of Object.entries(searchParams)) {
    if (!clave.startsWith("attr_") || !valor) continue;
    const esMin = clave.endsWith("_min");
    const esMax = clave.endsWith("_max");
    if (!esMin && !esMax) continue;
    const nombreAtributo = clave.replace(/^attr_/, "").replace(/_(min|max)$/, "");
    const numero = comoNumero(valor);
    if (numero === undefined) continue;
    rangosParciales[nombreAtributo] = {
      ...rangosParciales[nombreAtributo],
      [esMin ? "min" : "max"]: numero,
    };
  }
  const atributos: Record<string, [number, number]> = {};
  for (const [clave, { min, max }] of Object.entries(rangosParciales)) {
    if (min !== undefined || max !== undefined) {
      atributos[clave] = [min ?? Number.NEGATIVE_INFINITY, max ?? Number.POSITIVE_INFINITY];
    }
  }

  const ordenValido: OrdenCatalogo[] = [
    "relevancia",
    "precio-asc",
    "precio-desc",
    "referencia",
    "disponibilidad",
  ];
  const ordenParam = Array.isArray(searchParams.orden) ? searchParams.orden[0] : searchParams.orden;
  const orden = ordenValido.includes(ordenParam as OrdenCatalogo)
    ? (ordenParam as OrdenCatalogo)
    : "relevancia";

  return {
    marca: comoLista(searchParams.marca),
    subfamilia: comoLista(searchParams.subfamilia),
    soloStock: searchParams.stock === "1",
    precioMin: comoNumero(searchParams.precioMin),
    precioMax: comoNumero(searchParams.precioMax),
    atributos: Object.keys(atributos).length > 0 ? atributos : undefined,
    orden,
    pagina: comoNumero(searchParams.pagina) ?? 1,
  };
}

function valorAtributoNumerico(producto: Producto, clave: string): number | undefined {
  const valor = producto.atributos[clave];
  if (typeof valor === "number") return valor;
  if (typeof valor === "string") {
    const n = Number.parseFloat(valor.replace(",", "."));
    return Number.isNaN(n) ? undefined : n;
  }
  return undefined;
}

export function aplicarFiltros(productos: Producto[], filtros: FiltrosCatalogo): Producto[] {
  let resultado = productos;

  if (filtros.marca?.length) {
    const marcas = new Set(filtros.marca.map((m) => m.toUpperCase()));
    resultado = resultado.filter((p) => marcas.has(p.marca));
  }

  if (filtros.subfamilia?.length) {
    const subfamilias = new Set(filtros.subfamilia);
    resultado = resultado.filter((p) => subfamilias.has(p.subfamilia));
  }

  if (filtros.soloStock) {
    resultado = resultado.filter((p) => p.stock > 0);
  }

  if (filtros.precioMin !== undefined) {
    resultado = resultado.filter((p) => p.precioTarifa >= filtros.precioMin!);
  }
  if (filtros.precioMax !== undefined) {
    resultado = resultado.filter((p) => p.precioTarifa <= filtros.precioMax!);
  }

  if (filtros.atributos) {
    for (const [clave, [min, max]] of Object.entries(filtros.atributos)) {
      resultado = resultado.filter((p) => {
        const valor = valorAtributoNumerico(p, clave);
        return valor !== undefined && valor >= min && valor <= max;
      });
    }
  }

  return resultado;
}

export function ordenarProductos(productos: Producto[], orden: OrdenCatalogo = "relevancia"): Producto[] {
  const copia = [...productos];
  switch (orden) {
    case "precio-asc":
      return copia.sort((a, b) => a.precioTarifa - b.precioTarifa);
    case "precio-desc":
      return copia.sort((a, b) => b.precioTarifa - a.precioTarifa);
    case "referencia":
      return copia.sort((a, b) => a.referencia.localeCompare(b.referencia));
    case "disponibilidad":
      return copia.sort((a, b) => (b.stock > 0 ? 1 : 0) - (a.stock > 0 ? 1 : 0));
    case "relevancia":
    default:
      return copia;
  }
}

export function paginar<T>(items: T[], pagina: number, porPagina = PRODUCTOS_POR_PAGINA) {
  const totalPaginas = Math.max(1, Math.ceil(items.length / porPagina));
  const paginaActual = Math.min(Math.max(1, pagina), totalPaginas);
  const inicio = (paginaActual - 1) * porPagina;
  return {
    items: items.slice(inicio, inicio + porPagina),
    paginaActual,
    totalPaginas,
    total: items.length,
  };
}

/** Rango [min, max] por cada atributo numérico presente en el conjunto, para pintar el filtro. */
export function extraerRangosAtributos(productos: Producto[]): Record<string, [number, number]> {
  const rangos: Record<string, [number, number]> = {};
  for (const producto of productos) {
    for (const clave of producto.atributosDestacados) {
      const valor = valorAtributoNumerico(producto, clave);
      if (valor === undefined) continue;
      const actual = rangos[clave];
      rangos[clave] = actual ? [Math.min(actual[0], valor), Math.max(actual[1], valor)] : [valor, valor];
    }
  }
  return rangos;
}

export function contarPorMarca(productos: Producto[]): { marca: string; total: number }[] {
  const conteo = new Map<string, number>();
  for (const p of productos) conteo.set(p.marca, (conteo.get(p.marca) ?? 0) + 1);
  return Array.from(conteo, ([marca, total]) => ({ marca, total })).sort((a, b) =>
    a.marca.localeCompare(b.marca),
  );
}

export function contarPorSubfamilia(productos: Producto[]): { subfamilia: string; total: number }[] {
  const conteo = new Map<string, number>();
  for (const p of productos) conteo.set(p.subfamilia, (conteo.get(p.subfamilia) ?? 0) + 1);
  return Array.from(conteo, ([subfamilia, total]) => ({ subfamilia, total })).sort((a, b) =>
    a.subfamilia.localeCompare(b.subfamilia),
  );
}
