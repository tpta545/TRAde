import { z } from "zod";

/**
 * Modelo de datos de producto (Parte 5 del prompt maestro).
 * Fuente de verdad para el catálogo. El script de importación
 * (scripts/import-productos.ts) valida cada fila del CSV del ERP contra
 * este esquema antes de generar el JSON que consume /lib/data.
 */

export const MARCAS = ["ABB", "FESTO", "NTN", "WEG", "ISB"] as const;
export const marcaSchema = z.enum(MARCAS);
export type Marca = z.infer<typeof marcaSchema>;

export const ESTADOS_PRODUCTO = ["activo", "descatalogado", "sustituido"] as const;
export const estadoProductoSchema = z.enum(ESTADOS_PRODUCTO);
export type EstadoProducto = z.infer<typeof estadoProductoSchema>;

export const UBICACIONES_STOCK = ["almacen", "proveedor"] as const;
export const ubicacionStockSchema = z.enum(UBICACIONES_STOCK);
export type UbicacionStock = z.infer<typeof ubicacionStockSchema>;

export const imagenSchema = z.object({
  url: z.string().min(1),
  alt: z.string().min(1),
});

export const TIPOS_DOCUMENTO = [
  "ficha_tecnica",
  "catalogo",
  "declaracion_ce",
  "cad",
  "manual",
] as const;

export const documentoSchema = z.object({
  tipo: z.enum(TIPOS_DOCUMENTO),
  url: z.string().min(1),
  titulo: z.string().min(1),
});

export const equivalenciaSchema = z.object({
  marca: z.string().min(1),
  referencia: z.string().min(1),
  slug: z.string().optional(),
});

export const productoSchema = z.object({
  id: z.string().min(1),
  referencia: z.string().min(1),
  referenciaNormalizada: z.string().min(1),
  marca: marcaSchema,
  nombre: z.string().min(1),
  slug: z.string().min(1),
  familia: z.string().min(1),
  subfamilia: z.string().min(1),
  descripcionCorta: z.string().min(1).max(200),
  descripcionLarga: z.string().min(1),
  aplicaciones: z.array(z.string()).default([]),
  atributos: z.record(z.string(), z.union([z.string(), z.number()])).default({}),
  atributosDestacados: z.array(z.string()).default([]),
  imagenes: z.array(imagenSchema).min(1),
  documentos: z.array(documentoSchema).default([]),
  precioTarifa: z.number().nonnegative(),
  unidadVenta: z.string().min(1),
  multiploVenta: z.number().int().positive(),
  ean: z.string().optional(),
  stock: z.number().int().nonnegative(),
  ubicacionStock: ubicacionStockSchema,
  plazoEntregaDias: z.number().int().nonnegative(),
  equivalencias: z.array(equivalenciaSchema).default([]),
  accesorios: z.array(z.string()).default([]),
  recambios: z.array(z.string()).default([]),
  alternativas: z.array(z.string()).default([]),
  estado: estadoProductoSchema,
  sustituidoPor: z.string().optional(),
});

export type Producto = z.infer<typeof productoSchema>;

export const productosSeedSchema = z.array(productoSchema);
