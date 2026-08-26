import type { Producto } from "@/lib/schemas/producto";
import type { MarcaInfo } from "@/lib/data/marcas";
import type { FamiliaInfo } from "@/lib/data/familias";

const formateadorEUR = new Intl.NumberFormat("es-ES", { style: "currency", currency: "EUR" });

/**
 * Genera la introducción de cada página /marcas/[marca]/[familia] a partir
 * de datos reales del catálogo (Parte 7.8: "generadas a partir de una
 * plantilla con datos reales del catálogo, no texto duplicado").
 */
export function generarIntroMarcaFamilia(
  marcaInfo: MarcaInfo,
  familiaInfo: FamiliaInfo,
  productos: Producto[],
): string {
  const enStock = productos.filter((p) => p.stock > 0).length;
  const precios = productos.map((p) => p.precioTarifa);
  const precioMin = Math.min(...precios);
  const precioMax = Math.max(...precios);
  const subfamilias = Array.from(new Set(productos.map((p) => p.subfamilia)));

  return `${marcaInfo.nombre} es una de las marcas con las que Transmisiones del Este trabaja como distribuidor oficial, y dentro de su gama de ${familiaInfo.nombre.toLowerCase()} tenemos publicadas ${productos.length} referencia${productos.length === 1 ? "" : "s"} en catálogo, ${enStock} de ellas con stock disponible en nuestro almacén de Algemesí. Los precios de tarifa van desde ${formateadorEUR.format(precioMin)} hasta ${formateadorEUR.format(precioMax)} según la referencia concreta, dentro de ${subfamilias.length === 1 ? "la subfamilia" : "las subfamilias"} ${subfamilias.join(", ")}. Como con el resto de nuestro catálogo, cada ficha incluye ficha técnica, equivalencias con otras marcas cuando las tenemos confirmadas, y stock real verificable antes de pedir.`;
}
