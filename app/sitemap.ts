import type { MetadataRoute } from "next";
import { siteConfig } from "@/config/site";
import { getProductos, getFamilias, getMarcas, getCombinacionesMarcaFamilia } from "@/lib/data/productos";
import { SUBFAMILIAS } from "@/lib/data/familias";
import { getTodosLosArticulos } from "@/lib/data/blog"; // Fase 4

const MAX_URLS_POR_SITEMAP = 45000;

/**
 * Sitemap partido por bloques (Parte 8: "sitemap.xml partido... + índice").
 * Next.js genera automáticamente el índice cuando generateSitemaps()
 * devuelve más de un id; con el catálogo actual todo cabe en un único
 * bloque, pero la función corta a MAX_URLS_POR_SITEMAP para cuando el
 * catálogo crezca a las 3.000+ referencias del objetivo de la Fase 5.
 */
async function todasLasUrls(): Promise<MetadataRoute.Sitemap> {
  const [productos, familias, marcas, combinaciones, articulos] = await Promise.all([
    getProductos(),
    getFamilias(),
    getMarcas(),
    getCombinacionesMarcaFamilia(),
    getTodosLosArticulos(),
  ]);

  const urls: MetadataRoute.Sitemap = [
    { url: siteConfig.urlBase, changeFrequency: "daily", priority: 1 },
    { url: `${siteConfig.urlBase}/productos`, changeFrequency: "daily", priority: 0.9 },
    { url: `${siteConfig.urlBase}/marcas`, changeFrequency: "weekly", priority: 0.7 },
    { url: `${siteConfig.urlBase}/blog`, changeFrequency: "weekly", priority: 0.6 },
    { url: `${siteConfig.urlBase}/empresa`, changeFrequency: "monthly", priority: 0.4 },
    { url: `${siteConfig.urlBase}/contacto`, changeFrequency: "monthly", priority: 0.4 },
    { url: `${siteConfig.urlBase}/recursos/equivalencias`, changeFrequency: "monthly", priority: 0.5 },
    { url: `${siteConfig.urlBase}/recursos/catalogos`, changeFrequency: "monthly", priority: 0.3 },
    { url: `${siteConfig.urlBase}/servicios/reparacion-industrial`, changeFrequency: "monthly", priority: 0.6 },
    { url: `${siteConfig.urlBase}/servicios/asesoramiento-tecnico`, changeFrequency: "monthly", priority: 0.5 },
    {
      url: `${siteConfig.urlBase}/servicios/mantenimiento-y-stock-gestionado`,
      changeFrequency: "monthly",
      priority: 0.5,
    },
  ];

  for (const { familia } of familias) {
    urls.push({ url: `${siteConfig.urlBase}/productos/${familia}`, changeFrequency: "daily", priority: 0.8 });
    for (const subfamilia of Object.keys(SUBFAMILIAS[familia] ?? {})) {
      urls.push({
        url: `${siteConfig.urlBase}/productos/${familia}/${subfamilia}`,
        changeFrequency: "daily",
        priority: 0.7,
      });
    }
  }

  for (const { marca } of marcas) {
    urls.push({
      url: `${siteConfig.urlBase}/marcas/${marca.toLowerCase()}`,
      changeFrequency: "weekly",
      priority: 0.6,
    });
  }

  for (const { marca, familia } of combinaciones) {
    urls.push({
      url: `${siteConfig.urlBase}/marcas/${marca.toLowerCase()}/${familia}`,
      changeFrequency: "weekly",
      priority: 0.6,
    });
  }

  for (const producto of productos) {
    if (producto.estado === "activo") {
      urls.push({
        url: `${siteConfig.urlBase}/productos/${producto.familia}/${producto.subfamilia}/${producto.slug}`,
        changeFrequency: "daily",
        priority: 0.8,
      });
    }
  }

  for (const articulo of articulos) {
    urls.push({
      url: `${siteConfig.urlBase}/blog/${articulo.slug}`,
      changeFrequency: "monthly",
      priority: 0.5,
    });
  }

  return urls;
}

export async function generateSitemaps() {
  const urls = await todasLasUrls();
  const bloques = Math.max(1, Math.ceil(urls.length / MAX_URLS_POR_SITEMAP));
  return Array.from({ length: bloques }, (_, id) => ({ id }));
}

export default async function sitemap({ id }: { id: number }): Promise<MetadataRoute.Sitemap> {
  const urls = await todasLasUrls();
  const inicio = id * MAX_URLS_POR_SITEMAP;
  return urls.slice(inicio, inicio + MAX_URLS_POR_SITEMAP);
}
