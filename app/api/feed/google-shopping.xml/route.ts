import { NextResponse } from "next/server";
import { getProductos } from "@/lib/data/productos";
import { siteConfig } from "@/config/site";

/**
 * Feed de Google Merchant Center (RSS 2.0 + espacio de nombres g:), Parte 8:
 * "En suministro industrial, Shopping sobre referencias con stock es de lo
 * que mejor funciona". Sirve todos los productos activos con precio, la
 * mayoría de los campos obligatorios de Merchant Center están cubiertos
 * por el propio modelo de datos de Producto.
 */

function escaparXml(texto: string): string {
  return texto
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

export async function GET() {
  const productos = await getProductos();
  const activos = productos.filter((p) => p.estado === "activo");

  const items = activos
    .map((producto) => {
      const url = `${siteConfig.urlBase}/productos/${producto.familia}/${producto.subfamilia}/${producto.slug}`;
      const imagen = producto.imagenes[0]?.url
        ? `${siteConfig.urlBase}${producto.imagenes[0].url}`
        : "";
      const disponibilidad = producto.stock > 0 ? "in_stock" : "backorder";

      return `
    <item>
      <g:id>${escaparXml(producto.id)}</g:id>
      <g:title>${escaparXml(`${producto.marca} ${producto.referencia} — ${producto.nombre}`.slice(0, 150))}</g:title>
      <g:description>${escaparXml(producto.descripcionCorta)}</g:description>
      <g:link>${url}</g:link>
      <g:image_link>${imagen}</g:image_link>
      <g:condition>new</g:condition>
      <g:availability>${disponibilidad}</g:availability>
      <g:price>${producto.precioTarifa.toFixed(2)} EUR</g:price>
      <g:brand>${escaparXml(producto.marca)}</g:brand>
      ${producto.ean ? `<g:gtin>${escaparXml(producto.ean)}</g:gtin>` : ""}
      <g:mpn>${escaparXml(producto.referencia)}</g:mpn>
      <g:identifier_exists>${producto.ean ? "yes" : "no"}</g:identifier_exists>
      <g:product_type>${escaparXml(`${producto.familia} > ${producto.subfamilia}`)}</g:product_type>
    </item>`;
    })
    .join("");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:g="http://base.google.com/ns/1.0">
  <channel>
    <title>${escaparXml(siteConfig.marca)} — Catálogo</title>
    <link>${siteConfig.urlBase}</link>
    <description>${escaparXml(siteConfig.descripcion)}</description>${items}
  </channel>
</rss>`;

  return new NextResponse(xml, {
    headers: { "Content-Type": "application/xml; charset=utf-8" },
  });
}
