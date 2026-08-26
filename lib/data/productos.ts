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
