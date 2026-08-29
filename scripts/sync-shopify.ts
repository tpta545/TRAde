import { writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { productoSchema, MARCAS, type Producto } from "../lib/schemas/producto";

/**
 * Sincronización del catálogo desde Shopify (Admin API, GraphQL) a
 * data/productos.seed.json — mismo destino y mismo contrato de validación
 * que scripts/sync-erp-nocturno.ts. Shopify se usa solo como gestor de
 * producto: el carrito, el checkout (Redsys) y las cuentas B2B no cambian.
 *
 * Convenciones para cargar un producto en Shopify (ver SHOPIFY-SYNC.md
 * para el detalle con ejemplos):
 *   - Vendor           → marca (debe ser exactamente ABB, FESTO, NTN, WEG o ISB)
 *   - SKU de la variante → referencia
 *   - Precio de la variante → precioTarifa
 *   - Inventario de la variante → stock
 *   - Handle (lo genera Shopify) → slug / id
 *   - Tags "familia:<slug>" y "subfamilia:<slug>" → familia / subfamilia
 *   - Metafields opcionales, namespace "trade" (atributos, aplicaciones,
 *     equivalencias, documentos, accesorios, recambios, alternativas,
 *     unidad_venta, multiplo_venta, plazo_entrega_dias, ubicacion_stock,
 *     sustituido_por) — sin ellos, el producto se importa igual con los
 *     valores por defecto que se documentan más abajo.
 *
 * Solo se sincronizan productos con estado "active" o "archived" en
 * Shopify (los "draft" no están listos para publicar). "archived" se
 * mapea a estado "descatalogado" — útil para mantener la referencia
 * cruzada de sustituidoPor/alternativas sin que aparezca en el listado.
 *
 * Uso: npm run sync:shopify
 * Cron sugerido (cada 30 min): 0,30 * * * * npm run sync:shopify
 */

const DOMINIO = process.env.SHOPIFY_STORE_DOMAIN;
const TOKEN = process.env.SHOPIFY_ADMIN_API_ACCESS_TOKEN;
const VERSION_API = process.env.SHOPIFY_API_VERSION || "2025-01";

type NodoMetafield = { key: string; value: string };

type NodoProducto = {
  id: string;
  title: string;
  handle: string;
  vendor: string;
  status: "ACTIVE" | "ARCHIVED" | "DRAFT";
  descriptionHtml: string;
  tags: string[];
  images: { nodes: { url: string; altText: string | null }[] };
  variants: {
    nodes: { sku: string | null; price: string; barcode: string | null; inventoryQuantity: number | null }[];
  };
  metafields: { nodes: NodoMetafield[] };
};

const QUERY = /* GraphQL */ `
  query ProductosTrade($cursor: String) {
    products(first: 50, after: $cursor, query: "status:active OR status:archived") {
      pageInfo {
        hasNextPage
        endCursor
      }
      nodes {
        id
        title
        handle
        vendor
        status
        descriptionHtml
        tags
        images(first: 10) {
          nodes {
            url
            altText
          }
        }
        variants(first: 1) {
          nodes {
            sku
            price
            barcode
            inventoryQuantity
          }
        }
        metafields(namespace: "trade", first: 20) {
          nodes {
            key
            value
          }
        }
      }
    }
  }
`;

async function pedirPagina(cursor: string | null): Promise<{
  nodos: NodoProducto[];
  siguienteCursor: string | null;
}> {
  const respuesta = await fetch(`https://${DOMINIO}/admin/api/${VERSION_API}/graphql.json`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Shopify-Access-Token": TOKEN!,
    },
    body: JSON.stringify({ query: QUERY, variables: { cursor } }),
  });

  if (!respuesta.ok) {
    throw new Error(`Shopify Admin API respondió HTTP ${respuesta.status}: ${await respuesta.text()}`);
  }

  const cuerpo = await respuesta.json();
  if (cuerpo.errors) {
    throw new Error(`Shopify Admin API devolvió errores: ${JSON.stringify(cuerpo.errors)}`);
  }

  const conexion = cuerpo.data.products;
  return {
    nodos: conexion.nodes,
    siguienteCursor: conexion.pageInfo.hasNextPage ? conexion.pageInfo.endCursor : null,
  };
}

async function obtenerTodosLosProductos(): Promise<NodoProducto[]> {
  const todos: NodoProducto[] = [];
  let cursor: string | null = null;
  do {
    const pagina = await pedirPagina(cursor);
    todos.push(...pagina.nodos);
    cursor = pagina.siguienteCursor;
  } while (cursor);
  return todos;
}

function metafield(nodo: NodoProducto, clave: string): string | undefined {
  return nodo.metafields.nodes.find((m) => m.key === clave)?.value;
}

function metafieldJson<T>(nodo: NodoProducto, clave: string, porDefecto: T): T {
  const valor = metafield(nodo, clave);
  if (!valor) return porDefecto;
  try {
    return JSON.parse(valor) as T;
  } catch {
    console.warn(`[sync-shopify] ${nodo.handle}: metafield "${clave}" no es JSON válido, se ignora.`);
    return porDefecto;
  }
}

function extraerDeTags(tags: string[], prefijo: string): string | undefined {
  const tag = tags.find((t) => t.toLowerCase().startsWith(`${prefijo}:`));
  return tag?.slice(prefijo.length + 1).trim();
}

function limpiarHtml(html: string): string {
  return html
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/\s+/g, " ")
    .trim();
}

function normalizarReferencia(referencia: string): string {
  return referencia.toLowerCase().replace(/[^a-z0-9]/g, "");
}

function mapearProducto(nodo: NodoProducto): unknown {
  const variante = nodo.variants.nodes[0];
  const familia = extraerDeTags(nodo.tags, "familia");
  const subfamilia = extraerDeTags(nodo.tags, "subfamilia");
  const textoLargo = limpiarHtml(nodo.descriptionHtml || nodo.title);
  const atributos = metafieldJson<Record<string, string | number>>(nodo, "atributos", {});
  const stock = variante?.inventoryQuantity ?? 0;

  return {
    id: nodo.handle,
    referencia: variante?.sku ?? "",
    referenciaNormalizada: normalizarReferencia(variante?.sku ?? ""),
    marca: (nodo.vendor || "").trim().toUpperCase(),
    nombre: nodo.title,
    slug: nodo.handle,
    familia: familia ?? "",
    subfamilia: subfamilia ?? "",
    descripcionCorta: textoLargo.length > 197 ? `${textoLargo.slice(0, 197)}…` : textoLargo || nodo.title,
    descripcionLarga: textoLargo || nodo.title,
    aplicaciones: metafieldJson(nodo, "aplicaciones", []),
    atributos,
    atributosDestacados: metafieldJson(nodo, "atributos_destacados", Object.keys(atributos).slice(0, 4)),
    imagenes:
      nodo.images.nodes.length > 0
        ? nodo.images.nodes.map((img) => ({ url: img.url, alt: img.altText || nodo.title }))
        : [{ url: "/productos/placeholder.svg", alt: nodo.title }],
    documentos: metafieldJson(nodo, "documentos", []),
    precioTarifa: Number(variante?.price ?? 0),
    unidadVenta: metafield(nodo, "unidad_venta") || "ud",
    multiploVenta: Number(metafield(nodo, "multiplo_venta") || 1),
    ean: variante?.barcode || undefined,
    stock,
    ubicacionStock: metafield(nodo, "ubicacion_stock") || (stock > 0 ? "almacen" : "proveedor"),
    plazoEntregaDias: Number(metafield(nodo, "plazo_entrega_dias") ?? (stock > 0 ? 0 : 5)),
    equivalencias: metafieldJson(nodo, "equivalencias", []),
    accesorios: metafieldJson(nodo, "accesorios", []),
    recambios: metafieldJson(nodo, "recambios", []),
    alternativas: metafieldJson(nodo, "alternativas", []),
    estado: nodo.status === "ARCHIVED" ? "descatalogado" : "activo",
    sustituidoPor: metafield(nodo, "sustituido_por") || undefined,
  };
}

async function main() {
  if (!DOMINIO || !TOKEN) {
    throw new Error(
      "Configura SHOPIFY_STORE_DOMAIN (ej: mi-tienda.myshopify.com) y " +
        "SHOPIFY_ADMIN_API_ACCESS_TOKEN (App personalizada → Admin API access token) en .env. " +
        "Ver SHOPIFY-SYNC.md.",
    );
  }

  console.log(`[sync-shopify] Iniciando sincronización desde ${DOMINIO} — ${new Date().toISOString()}`);

  const nodos = await obtenerTodosLosProductos();
  console.log(`[sync-shopify] ${nodos.length} producto(s) recibido(s) de Shopify.`);

  const productosValidos: Producto[] = [];
  const errores: { referencia: string; problemas: string[] }[] = [];

  for (const nodo of nodos) {
    const candidato = mapearProducto(nodo);
    const resultado = productoSchema.safeParse(candidato);
    if (resultado.success) {
      productosValidos.push(resultado.data);
    } else {
      errores.push({
        referencia: `${nodo.handle} (${nodo.vendor} — ${nodo.title})`,
        problemas: resultado.error.issues.map((issue) => `${issue.path.join(".")}: ${issue.message}`),
      });
    }
  }

  if (errores.length > 0) {
    console.warn(`[sync-shopify] ${errores.length} producto(s) descartado(s):`);
    for (const error of errores) {
      console.warn(`  · ${error.referencia}: ${error.problemas.join("; ")}`);
    }
    const marcasValidas = MARCAS.join(", ");
    console.warn(
      `[sync-shopify] Recordatorio: "Proveedor" (vendor) debe ser exactamente una de estas marcas: ${marcasValidas}. ` +
        `Familia/subfamilia se leen de tags "familia:<slug>" y "subfamilia:<slug>".`,
    );
  }

  if (productosValidos.length === 0) {
    console.error("[sync-shopify] 0 productos válidos. No se sobrescribe el catálogo actual.");
    process.exit(1);
  }

  const destino = resolve("data/productos.seed.json");
  writeFileSync(destino, JSON.stringify(productosValidos, null, 2) + "\n", "utf-8");

  console.log(
    `[sync-shopify] OK: ${productosValidos.length} producto(s) sincronizado(s) a ${destino} (${errores.length} descartado(s)).`,
  );
}

main().catch((error) => {
  console.error("[sync-shopify] Sincronización fallida:", error);
  process.exit(1);
});
