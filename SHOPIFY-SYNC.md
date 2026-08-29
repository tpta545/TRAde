# Sincronización de catálogo desde Shopify

Shopify se usa **solo como gestor de productos**: metes y editas ahí las
referencias (nombre, fotos, precio, stock, ficha técnica) porque su panel es
mucho más cómodo que el CSV/JSON actual. Un script (`scripts/sync-shopify.ts`)
trae esos productos a esta web automáticamente.

**Lo que NO cambia**: el carrito, el checkout con Redsys, las cuentas B2B
(precio neto, pago a 30/60/90 días, pedido rápido, listas de equipos,
facturas) y todo el contenido de la web siguen exactamente igual. Shopify no
gestiona pagos ni pedidos en esta integración — eso lo sigue haciendo TRADE.

## 1. Crear el acceso (una sola vez)

1. En el panel de Shopify: **Configuración → Apps y canales de venta →
   Desarrollar apps → Crear una app**. Ponle un nombre, por ejemplo
   "Web TRADE — sincronización".
2. En **Configurar Admin API**, activa estos alcances (scopes):
   - `read_products`
   - `read_inventory`
3. **Instalar app**. Copia el **token de acceso a la Admin API** — Shopify
   solo lo enseña una vez, si lo pierdes hay que generarlo de nuevo.
4. En tu `.env` (nunca lo subas a git):
   ```
   SHOPIFY_STORE_DOMAIN=tu-tienda.myshopify.com
   SHOPIFY_ADMIN_API_ACCESS_TOKEN=shpat_xxxxxxxxxxxxxxxxxxxxxxxx
   ```

## 2. Qué campo de Shopify va a dónde

| En Shopify rellenas... | Va a parar a... | Obligatorio |
|---|---|---|
| Título | `nombre` | Sí |
| Handle (lo genera Shopify solo desde el título) | `slug` / `id` | Sí (automático) |
| Proveedor (vendor) | `marca` — debe ser **exactamente** `ABB`, `FESTO`, `NTN`, `WEG` o `ISB` | Sí |
| SKU (en la variante) | `referencia` | Sí |
| Precio (en la variante) | `precioTarifa` | Sí |
| Inventario disponible | `stock` | Sí (0 si no lo rellenas) |
| Código de barras (en la variante) | `ean` | No |
| Descripción | `descripcionLarga` / `descripcionCorta` (recorte automático) | No (usa el título si está vacía) |
| Imágenes del producto | `imagenes` (con su texto alternativo) | No (si no hay ninguna, sale con la imagen "foto pendiente") |
| Estado del producto (Activo/Archivado) | `estado` — Activo → `activo`, Archivado → `descatalogado` | — |
| Etiqueta `familia:rodamientos` | `familia` | Sí, como etiqueta (ver abajo) |
| Etiqueta `subfamilia:rodamientos-rigidos-de-bolas` | `subfamilia` | Sí, como etiqueta |

Los productos en **borrador** (draft) no se sincronizan — hasta que no lo
actives o archives en Shopify, no aparece en la web.

### Familia y subfamilia: etiquetas (tags)

En el producto de Shopify, en el campo **Etiquetas**, añade dos:

```
familia:rodamientos
subfamilia:rodamientos-rigidos-de-bolas
```

Usa los mismos slugs que ya existen en la web (minúsculas, con guiones, sin
tildes): `rodamientos`, `variadores-de-frecuencia`, `motores-electricos`,
`neumatica`, `arrancadores-y-proteccion`, y sus subfamilias. Si pones una
familia nueva que no existe todavía en la web, el producto se sincroniza
igual — la página de esa familia sale con un título genérico hasta que se
le añada contenido editorial (`lib/data/familias.ts`).

## 3. Campos avanzados (opcionales): metafields

Para datos que Shopify no tiene de serie — características técnicas,
equivalencias con otras marcas, documentación, accesorios — se usan
**metafields** en el namespace `trade`. Ninguno es obligatorio: sin
rellenarlos, el producto se sincroniza igual con listas vacías.

Para crearlos: **Configuración → Metafields y metaobjetos → Productos →
Añadir definición**. Tipo de contenido: **JSON** en todos los de la tabla
salvo los tres últimos (texto/número).

| Key (dentro de `trade`) | Contenido | Ejemplo |
|---|---|---|
| `atributos` | Objeto con las características técnicas | `{"Diámetro interior": "25 mm", "Diámetro exterior": "52 mm"}` |
| `atributos_destacados` | Lista de las claves de `atributos` a mostrar primero | `["Diámetro interior", "Diámetro exterior"]` |
| `aplicaciones` | Lista de usos habituales | `["bombas", "cintas transportadoras"]` |
| `equivalencias` | Lista de referencias equivalentes de otras marcas | `[{"marca": "SKF", "referencia": "6205-2RS1"}]` |
| `documentos` | Lista de documentos técnicos. `tipo` debe ser uno de: `ficha_tecnica`, `catalogo`, `declaracion_ce`, `cad`, `manual` | `[{"tipo": "catalogo", "url": "https://...", "titulo": "Catálogo SKF"}]` |
| `accesorios` / `recambios` / `alternativas` | Listas de `id` (slug) de otros productos ya sincronizados | `["ntn-6205-2rs1"]` |
| `unidad_venta` (texto) | Si no es "ud" | `caja de 10` |
| `multiplo_venta` (número) | Si se vende en múltiplos | `10` |
| `plazo_entrega_dias` (número) | Si quieres forzar el plazo mostrado | `3` |
| `ubicacion_stock` (texto) | `almacen` o `proveedor`, si no quieres el cálculo automático (según haya stock o no) | `proveedor` |
| `sustituido_por` (texto) | El `id` del producto que lo sustituye, si está descatalogado | `abb-acs580-01-12a7-4` |

## 4. Ejecutar la sincronización

```
npm run sync:shopify
```

Lee todos los productos activos/archivados de Shopify, los valida y
sobrescribe `data/productos.seed.json`. Si un producto no pasa la
validación (por ejemplo, proveedor mal escrito o sin SKU), se descarta y
sale avisado en la consola con el motivo — el resto del catálogo se
sincroniza igual, no se detiene por un producto con un dato mal puesto.

Para que se actualice sola, se puede programar por cron (cada 30 minutos,
por ejemplo):

```
*/30 * * * * cd /ruta/al/proyecto && npm run sync:shopify
```

Después de sincronizar hace falta reconstruir la web (`npm run build`) para
que los cambios salgan en producción, salvo que el despliegue ya regenere
la build automáticamente en cada sincronización.

## 5. Errores más habituales

- **"marca: Invalid enum value"** → el campo Proveedor no es exactamente
  `ABB`, `FESTO`, `NTN`, `WEG` o `ISB` (revisa mayúsculas y espacios).
- **"referencia: String must contain at least 1 character(s)"** → falta el
  SKU en la variante del producto.
- **Producto sin familia/subfamilia visible** → falta la etiqueta
  `familia:...` o `subfamilia:...`, o está mal escrita (sin los dos puntos).
- **0 productos sincronizados, no se toca el catálogo actual** → revisa
  `SHOPIFY_STORE_DOMAIN` y el token; el script no sobrescribe nunca el
  catálogo si la sincronización no trae ningún producto válido.
