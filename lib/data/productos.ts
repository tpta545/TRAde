import "server-only";
import productosSeed from "@/data/productos.seed.json";
import { productosSeedSchema, type Producto } from "@/lib/schemas/producto";

/**
 * Capa de acceso a datos de producto.
 *
 * Hoy lee de un fichero JSON (adaptador de ficheros). El resto de la
 * aplicación solo debe importar desde aquí, nunca leer productos.seed.json
 * directamente: así, cuando pasemos a Postgres/Prisma o a la API del ERP
 * (Fase 5), basta con reescribir las funciones de este fichero.
 */

let cache: Producto[] | null = null;

function cargarProductos(): Producto[] {
  if (cache) return cache;
  cache = productosSeedSchema.parse(productosSeed);
  return cache;
}

export async function getProductos(): Promise<Producto[]> {
  return cargarProductos();
}

export async function getProductoBySlug(slug: string): Promise<Producto | undefined> {
  return cargarProductos().find((producto) => producto.slug === slug);
}

export async function getProductoByReferencia(
  referenciaNormalizada: string,
): Promise<Producto | undefined> {
  return cargarProductos().find(
    (producto) => producto.referenciaNormalizada === referenciaNormalizada,
  );
}

export async function getProductosPorMarca(marca: string): Promise<Producto[]> {
  return cargarProductos().filter(
    (producto) => producto.marca.toLowerCase() === marca.toLowerCase(),
  );
}

export async function getProductosPorFamilia(familia: string): Promise<Producto[]> {
  return cargarProductos().filter((producto) => producto.familia === familia);
}

export async function getFamilias(): Promise<{ familia: string; total: number }[]> {
  const conteo = new Map<string, number>();
  for (const producto of cargarProductos()) {
    conteo.set(producto.familia, (conteo.get(producto.familia) ?? 0) + 1);
  }
  return Array.from(conteo, ([familia, total]) => ({ familia, total }));
}

export async function getMarcas(): Promise<{ marca: string; total: number }[]> {
  const conteo = new Map<string, number>();
  for (const producto of cargarProductos()) {
    conteo.set(producto.marca, (conteo.get(producto.marca) ?? 0) + 1);
  }
  return Array.from(conteo, ([marca, total]) => ({ marca, total }));
}

export async function getProductosPorIds(ids: string[]): Promise<Producto[]> {
  const productos = cargarProductos();
  return ids
    .map((id) => productos.find((producto) => producto.id === id))
    .filter((producto): producto is Producto => producto !== undefined);
}

export type EquivalenciaResuelta = {
  marca: string;
  referencia: string;
  href?: string;
};

/**
 * Añade el enlace interno a una equivalencia cuando la referencia indicada
 * coincide con un producto propio del catálogo (por ejemplo, un ABB ACS580
 * que en el prompt se documenta como equivalente de un WEG CFW300 que sí
 * vendemos). Si no hay coincidencia, se queda como texto plano.
 */
export async function resolverEquivalencias(
  producto: Producto,
): Promise<EquivalenciaResuelta[]> {
  const productos = cargarProductos();
  return producto.equivalencias.map((equivalencia) => {
    const coincidencia = productos.find(
      (p) =>
        p.marca.toLowerCase() === equivalencia.marca.toLowerCase() &&
        p.referenciaNormalizada === equivalencia.referencia.toLowerCase().replace(/[^a-z0-9]/g, ""),
    );
    return {
      ...equivalencia,
      href: coincidencia
        ? `/productos/${coincidencia.familia}/${coincidencia.subfamilia}/${coincidencia.slug}`
        : equivalencia.slug
          ? `/productos/${producto.familia}/${producto.subfamilia}/${equivalencia.slug}`
          : undefined,
    };
  });
}

/**
 * Combinaciones marca+familia con al menos `minimo` productos: base de las
 * páginas programáticas /marcas/[marca]/[familia] (Fase 4, Parte 7.8).
 */
export async function getCombinacionesMarcaFamilia(
  minimo = 5,
): Promise<{ marca: string; familia: string; total: number }[]> {
  const conteo = new Map<string, { marca: string; familia: string; total: number }>();
  for (const producto of cargarProductos()) {
    const clave = `${producto.marca}::${producto.familia}`;
    const actual = conteo.get(clave);
    conteo.set(clave, {
      marca: producto.marca,
      familia: producto.familia,
      total: (actual?.total ?? 0) + 1,
    });
  }
  return Array.from(conteo.values()).filter((combinacion) => combinacion.total >= minimo);
}
