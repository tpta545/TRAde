import type { MetadataRoute } from "next";
import { siteConfig } from "@/config/site";
import { getProductos, getFamilias, getMarcas, getCombinacionesMarcaFamilia } from "@/lib/data/productos";
import { SUBFAMILIAS } from "@/lib/data/familias";
import { getTodosLosArticulos } from "@/lib/data/blog";
import { getTodasLasSoluciones } from "@/lib/data/soluciones";

/**
 * Un único sitemap.xml mientras el catálogo quepa cómodo en él.
 *
 * <<PENDIENTE>>: la Parte 8 del prompt pide partir el sitemap en varios
 * ficheros (sitemap-productos-1.xml...) + índice cuando el catálogo crezca
 * hacia las 3.000+ referencias del objetivo de la Fase 5. Next.js soporta
 * eso vía generateSitemaps(), pero cambia la URL a /sitemap/[id].xml en vez
 * de /sitemap.xml — hay que actualizar también robots.txt cuando se active.
 * Con 25 referencias de seed no compensa la complejidad todavía; el límite
 * recomendado por sitemaps.org es 45.000 URLs por fichero.
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
    { url: `${siteConfig.urlBase}/soluciones`, changeFrequency: "monthly", priority: 0.4 },
  ];

  for (const solucion of getTodasLasSoluciones()) {
    urls.push({
      url: `${siteConfig.urlBase}/soluciones/${solucion.slug}`,
      changeFrequency: "monthly",
      priority: 0.4,
    });
  }

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

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  return todasLasUrls();
}
