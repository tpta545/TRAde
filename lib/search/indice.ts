import "server-only";
import { Document } from "flexsearch";
import { getProductos } from "@/lib/data/productos";
import { getFamiliaInfo, getTodasLasFamilias } from "@/lib/data/familias";
import { siteConfig } from "@/config/site";
import sinonimosData from "@/data/sinonimos.json";
import { normalizarReferencia, normalizarTexto } from "@/lib/search/normalizar";
import type { Producto } from "@/lib/schemas/producto";

export type ResultadoBusqueda =
  | { tipo: "producto"; producto: Producto }
  | { tipo: "familia"; slug: string; nombre: string }
  | { tipo: "marca"; nombre: string };

const sinonimos: Record<string, string[]> = sinonimosData;

/** Diccionario bidireccional: cada término conocido -> conjunto de términos equivalentes. */
const mapaSinonimos: Map<string, Set<string>> = (() => {
  const mapa = new Map<string, Set<string>>();
  const añadir = (a: string, b: string) => {
    const claveA = normalizarTexto(a);
    const claveB = normalizarTexto(b);
    if (!mapa.has(claveA)) mapa.set(claveA, new Set());
    if (!mapa.has(claveB)) mapa.set(claveB, new Set());
    mapa.get(claveA)!.add(claveB);
    mapa.get(claveB)!.add(claveA);
  };
  for (const [canonico, variantes] of Object.entries(sinonimos)) {
    for (const variante of variantes) añadir(canonico, variante);
  }
  return mapa;
})();

/** Expande la consulta con sinónimos conocidos, p. ej. "drive" añade "variador". */
export function expandirConSinonimos(consulta: string): string[] {
  const normalizada = normalizarTexto(consulta.trim());
  const terminos = new Set([normalizada]);
  for (const [clave, equivalentes] of mapaSinonimos.entries()) {
    if (normalizada.includes(clave)) {
      for (const equivalente of equivalentes) terminos.add(normalizada.replace(clave, equivalente));
    }
  }
  return Array.from(terminos);
}

let indiceProductos: Document<{ id: string; texto: string }> | null = null;
let productosPorId: Map<string, Producto> | null = null;

async function obtenerIndice() {
  if (indiceProductos && productosPorId) return { indiceProductos, productosPorId };

  const productos = await getProductos();
  productosPorId = new Map(productos.map((p) => [p.id, p]));

  indiceProductos = new Document({
    tokenize: "forward",
    context: true,
    document: {
      id: "id",
      index: ["texto"],
    },
  });

  for (const producto of productos) {
    const texto = [
      producto.referencia,
      producto.referenciaNormalizada,
      producto.nombre,
      producto.marca,
      producto.familia,
      producto.subfamilia,
      producto.descripcionCorta,
      ...producto.aplicaciones,
    ].join(" ");
    indiceProductos.add({ id: producto.id, texto });
  }

  return { indiceProductos, productosPorId };
}

/**
 * Busca productos tolerando errores tipográficos y variaciones de formato de
 * referencia ("6205 2RS" / "6205-2rs" / "62052RS" son la misma consulta).
 */
export async function buscarProductos(consultaOriginal: string, limite = 20): Promise<Producto[]> {
  const consulta = consultaOriginal.trim();
  if (!consulta) return [];

  const { indiceProductos: indice, productosPorId: mapa } = await obtenerIndice();
  const refNormalizada = normalizarReferencia(consulta);

  // Coincidencia directa por referencia (con o sin separadores) va primero siempre.
  const porReferencia = refNormalizada.length >= 3
    ? [...mapa.values()].filter((p) => p.referenciaNormalizada.includes(refNormalizada))
    : [];

  const idsEncontrados = new Set(porReferencia.map((p) => p.id));
  const resultado: Producto[] = [...porReferencia];

  for (const variante of expandirConSinonimos(consulta)) {
    const coincidencias = indice.search(variante, { limit: limite, suggest: true });
    for (const grupo of coincidencias) {
      for (const id of grupo.result) {
        const idStr = String(id);
        if (idsEncontrados.has(idStr)) continue;
        const producto = mapa.get(idStr);
        if (producto) {
          resultado.push(producto);
          idsEncontrados.add(idStr);
        }
      }
    }
  }

  return resultado.slice(0, limite);
}

export type SugerenciasBusqueda = {
  productos: Producto[];
  familias: { slug: string; nombre: string }[];
  marcas: string[];
};

/** Para el desplegable del buscador de cabecera: agrupado por tipo. */
export async function sugerir(consulta: string): Promise<SugerenciasBusqueda> {
  const texto = normalizarTexto(consulta.trim());
  if (texto.length < 2) return { productos: [], familias: [], marcas: [] };

  const productos = await buscarProductos(consulta, 6);
  const familias = getTodasLasFamilias()
    .filter((f) => normalizarTexto(f.nombre).includes(texto))
    .map((f) => ({ slug: f.slug, nombre: f.nombre }));
  const marcas = siteConfig.marcas.filter((m) => normalizarTexto(m).includes(texto));

  return { productos, familias, marcas };
}

/** Familia "más cercana" a una búsqueda sin resultados, para no dejar al usuario en un callejón. */
export async function familiaMasCercana(consulta: string) {
  const texto = normalizarTexto(consulta);
  const familias = getTodasLasFamilias();
  for (const familia of familias) {
    if (texto.includes(normalizarTexto(familia.nombre)) || normalizarTexto(familia.nombre).includes(texto)) {
      return familia;
    }
  }
  return getFamiliaInfo(familias[0]?.slug ?? "rodamientos");
}
