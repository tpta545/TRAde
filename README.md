# TRADE — web de Transmisiones del Este S.L.

Web que sustituye por completo a `grupotrade.es` y absorbe `trade.grupotrade.es`.
Construida siguiendo el prompt maestro de agosto 2026 (auditoría + especificación
funcional), Fases 0 a 5. Este documento recoge las decisiones tomadas, no repite
la especificación completa del prompt.

## Estado

Las 5 fases del prompt están implementadas y funcionando de extremo a extremo
(catálogo, buscador, carrito, checkout con Redsys, cuenta B2B con multiusuario,
contenido y SEO programático, feed de Shopping, Consent Mode v2). **No está en
condiciones de lanzarse tal cual**: el catálogo real, las credenciales de pago
de producción, la revisión jurídica y varias integraciones (email, ERP) siguen
pendientes. Ver [`PENDIENTES.md`](./PENDIENTES.md) y
[`CHECKLIST-LANZAMIENTO.md`](./CHECKLIST-LANZAMIENTO.md).

## Stack

- **Next.js 15.5.24** (App Router) + **TypeScript estricto** + **Tailwind CSS v4**.
- **shadcn/ui** sobre `@base-ui/react`, con los tokens de `app/globals.css`
  remapeados a la paleta TRADE.
- **Zod** en todo el modelo de datos (producto, pedido, usuario, leads).
- **FlexSearch** para el buscador en memoria (Parte 2).
- **React Server Actions** (`"use server"`) para todos los formularios y
  mutaciones: leads, checkout, cuenta, listas, presupuestos, equipos.
- **`server-only`** para forzar que las capas de datos no se filtren a cliente.

### Por qué Next 15 y no Next 16

`create-next-app` instala Next 16 por defecto. El prompt exige Next 15
explícitamente, así que se ha fijado la versión a `15.5.24` y se ha vuelto al
ESLint clásico (`.eslintrc.json`) en vez del flat config del instalador de
Next 16. `npm audit` señala 2 vulnerabilidades heredadas del `postcss` interno
de Next 15 (solo en build); el fix sube a Next 16, lo que rompe el requisito
de versión — deuda técnica anotada para cuando el proyecto migre.

## Estructura

```
app/                    Rutas (App Router): catálogo, cuenta, checkout, blog, marcas...
components/              Componentes por dominio: producto/, catalogo/, cuenta/, checkout/,
                         carrito/, leads/, layout/, home/, analitica/, legal/
config/site.ts           Datos de empresa, PRICING_MODE y demás flags
lib/schemas/              Esquemas Zod (producto — fuente de verdad del modelo de datos)
lib/data/                  Catálogo, familias, marcas, blog, soluciones (lectura)
lib/catalog/                Filtros/orden/paginación, pedido rápido
lib/search/                  Índice FlexSearch, normalización de referencia, equivalencias
lib/cart/                    Contexto de carrito (cliente, localStorage)
lib/pedidos/                  Modelo y store de pedidos, checkout, aprobación multiusuario
lib/pago/redsys.ts             Integración Redsys (HMAC_SHA256_V1)
lib/auth/                       Sesión, usuarios, contraseñas (scrypt), Server Actions
lib/cuenta/                      Listas de compra, presupuestos, equipos (Server Actions)
lib/leads/                        Formularios de contacto/reparación + almacén de leads
lib/db/json-store.ts               Adaptador CRUD genérico sobre JSON (mock de desarrollo)
lib/analitica/                      Consent Mode v2, eventos GA4
lib/seo/                             JSON-LD (Organization, Product, Breadcrumb, FAQ)
data/productos.seed.json              Seed de 25 productos reales (5 por marca)
scripts/import-productos.ts            Importador CSV → seed, validado con Zod
scripts/sync-erp-nocturno.ts            Contrato de sincronización nocturna con el ERP
```

`lib/data/productos.ts` es el único punto por el que el resto de la app lee
productos; `lib/db/json-store.ts` es el único punto por el que se leen/escriben
pedidos, usuarios, listas, presupuestos y equipos. Cuando se conecte
Postgres/Prisma o el ERP (ver Fase 5 más abajo), solo hay que reescribir esos
ficheros — nada que los consuma cambia.

## Modelo de precios

`PRICING_MODE` vive en `config/site.ts` con tres valores (`public`,
`public_plus_net`, `login_only`), por defecto `"public"`. `<PriceBlock>`
soporta los tres modos: en `public_plus_net`, si hay sesión, muestra tarifa
tachada + "TU PRECIO" con el descuento real de la cuenta (`sesion.descuentoPorcentaje`),
ya conectado en la ficha de producto. Precios sin IVA por defecto, con
conmutador persistente en la cabecera (`lib/context/iva-context.tsx`).

## El seed de 25 productos

Cada referencia es real y verificable (no inventada): variadores y motores
ABB (ACS580, PSTX, M3BP), cilindros y electroválvulas Festo (DSBC ISO 15552,
VUVG), rodamientos NTN e ISB (ISO 15:2017, UCP/UCFL), motores y variador WEG
(W22 IE3, CFW300). **Los precios, el stock y el plazo del seed son
ilustrativos** — no son la tarifa real de TRADE. Los datos reales llegan por
`npm run import:productos -- ruta.csv` (importación puntual) o
`npm run sync:erp` (sincronización nocturna, ver más abajo).

## Sistema de diseño

Paleta y escala tipográfica de la Parte 6 del prompt, en `app/globals.css`:
colores `trade-*` como utilidades Tailwind, tokens semánticos de shadcn
remapeados a esa paleta, tipografías vía `next/font` (Barlow Condensed /
Inter / JetBrains Mono), escala 12/14/16/18/24/32/44/56, sin modo oscuro.
Aplicado de verdad en toda la web: home, catálogo, ficha, checkout, cuenta.

## Buscador (Fase 2)

Índice FlexSearch en memoria (`lib/search/indice.ts`) sobre referencia,
nombre, marca, familia y aplicaciones, con:
- Tolerancia a formato de referencia: "6205 2RS" / "6205-2rs" / "62052RS"
  encuentran el mismo resultado (`lib/search/normalizar.ts`).
- Sinónimos configurables en `data/sinonimos.json` (bidireccionales).
- Autocompletado agrupado en la cabecera (Productos/Familias/Marcas) vía
  `/api/buscar/sugerencias`.
- Cero resultados nunca es un callejón: `/buscar` registra **toda** búsqueda
  sin resultado en `.data/busqueda_sin_resultados.jsonl` (visible en
  `/cuenta/admin/insights`) y ofrece un formulario de captura + productos de
  la familia más cercana.
- Buscador de equivalencias inverso en `/recursos/equivalencias`.

## Carrito, checkout y pago (Fase 2/3)

Carrito en cliente (contexto + `localStorage`, `lib/cart/cart-context.tsx`),
con drawer y página completa (`/carrito`). Checkout de una sola página
(`/checkout`) con 4 bloques: empresa/contacto (NIF/CIF con dígito de control
real, `lib/utils/nif.ts`), envío/facturación, observaciones, y pago:

- **Tarjeta** vía **Redsys** (`lib/pago/redsys.ts`), algoritmo HMAC_SHA256_V1
  completo. Usa las credenciales de entorno de pruebas **públicas** de
  Redsys (no las de TRADE) — no se ha podido validar contra el sandbox real
  desde este entorno de desarrollo. Ver PENDIENTES.md antes de confiar en
  esta integración.
- **Transferencia bancaria.**
- **Cuenta a 30/60 días**, solo para sesiones con cuenta B2B aprobada.

`/pedido/[id]` confirma el pedido con tracking de `purchase` y opción de
guardar como PDF (impresión del navegador; no hay generación de PDF en
servidor).

## Cuenta B2B (Fase 3)

Autenticación propia (no un proveedor externo): registro con aprobación
pendiente, login con sesión firmada por HMAC en cookie `httpOnly`,
contraseñas con `scrypt`. **Tres cuentas DEMO** (contraseña `demo1234`):
`compras@clientedemo.es` (comprador), `aprobador@clientedemo.es` (aprobador,
misma empresa), `admin@grupotrade.es` (admin). Multiusuario real: un pedido
de un "comprador" que supera su límite de aprobación queda
`pendiente_aprobacion` hasta que el "aprobador" de su misma empresa lo
confirma en `/cuenta/pedidos`.

`/cuenta` incluye: resumen, pedidos (con repetir pedido en un clic), mis
referencias (derivadas del historial real de pedidos, no inventadas),
listas de compra (reutiliza el parser del pedido rápido), presupuestos
(solicitud funcional; la respuesta con precio es manual hasta que haya panel
admin o ERP), facturas (placeholder honesto — Verifactu exige que la web
solo *exponga* facturas del ERP, nunca las emita) y alta de equipos/máquinas.

## Contenido y SEO programático (Fase 4)

- Home definitiva con hero, TrustBar, familias/marcas con datos reales,
  bloque de reparación, hueco de prueba social marcado `<<TODO: contenido
  pendiente>>` (sin testimonios inventados) y blog + newsletter.
- `/marcas`, `/marcas/[marca]`, y `/marcas/[marca]/[familia]` programáticas
  para combinaciones con ≥5 productos, con introducción generada por
  plantilla a partir de datos reales (no texto duplicado) y `noindex` por
  debajo del mínimo.
- Blog con 5 artículos técnicos reales (`lib/data/blog.ts`). Uno de los
  títulos que sugiere el propio prompt ("Errores F0001-F0099 en ACS580") es
  **incorrecto** para el ACS580 (esos códigos son de la generación anterior,
  ACS550/ACS355); se ha corregido el título y el contenido con la
  numeración real, verificada por fuente.
- `/soluciones/[sector]` (cítricos, cerámica, alimentación), `/empresa`,
  4 páginas `/legal/*` en borrador marcadas **PENDIENTE DE REVISIÓN
  JURÍDICA**, y `redirects.json` con la estructura lista para el listado
  real de URLs antiguas (todavía no disponible).

## SEO técnico y analítica (Fase 8/9, repartido en Fases 1-5)

- `sitemap.xml` (un único fichero: con 25 referencias no compensa
  partirlo — ver comentario en `app/sitemap.ts` sobre cuándo sí) y
  `robots.txt`.
- `llms.txt` en la raíz describiendo catálogo y servicios.
- Feed de Google Merchant Center en `/api/feed/google-shopping.xml`.
- JSON-LD: `Organization`/`LocalBusiness` en el layout raíz, `Product` +
  `Offer` + `BreadcrumbList` en ficha, `FAQPage` en familias y páginas
  marca+familia, `Article` en blog.
- **Consent Mode v2**: consentimiento denegado por defecto antes de cargar
  ningún script (`components/analitica/gtag-script.tsx`), banner de cookies
  donde rechazar es tan fácil como aceptar. Sin `NEXT_PUBLIC_GTM_ID`
  configurado no se inyecta ningún script de terceros.
- Eventos GA4 completos (`lib/analitica/eventos.ts`): e-commerce estándar
  más los siete eventos propios del prompt
  (`search_no_results`, `quick_order_used`, `reorder_clicked`,
  `repair_lead`, `quote_requested`, `stock_badge_seen`, `login_price_reveal`).
- Panel interno `/cuenta/admin/insights` (solo rol admin): top búsquedas sin
  resultado y referencias más vistas sin stock, con **datos reales**
  acumulados en `.data/*.jsonl`. Carritos abandonados por importe **no** se
  muestra: requiere seguimiento de sesión que todavía no existe, y no se ha
  querido fabricar una cifra sin datos reales detrás.
- Presupuesto de JS de la ficha de producto: ~115 KB de First Load JS en
  build, dentro del límite de 170 KB de la Parte 8 (pendiente de medir en
  dispositivo real, no solo en build — ver checklist de lanzamiento).

## Integración ERP (Fase 5)

`scripts/sync-erp-nocturno.ts` define el **contrato** de la sincronización
nocturna (de dónde lee, qué valida con Zod, dónde escribe), pensado para
ejecutarse por cron. No hay todavía un endpoint ni un export real del ERP de
TRADE al que conectarse: el script lee de `ERP_SYNC_SOURCE_URL` (API) o
`ERP_SYNC_SOURCE_PATH` (CSV local) — conectarlo el día que exista un export
real es cambiar esa variable de entorno, no reescribir la lógica.

## Persistencia (mock de desarrollo, Fase 3/5)

Pedidos, usuarios, listas, presupuestos y equipos usan
`lib/db/json-store.ts`: CRUD sobre ficheros JSON en `.data/` (gitignorado).
Es un mock de desarrollo/demo, no una base de datos — no sobrevive a un
despliegue serverless sin disco persistente. Sustituir por Postgres/Prisma o
el ERP en producción sin tocar quien lo consume.

## Cómo ejecutar

```
npm install
npm run dev                                          # http://localhost:3000
npm run build                                         # build de producción
npm run lint                                           # ESLint
npm run import:productos -- ruta/al/fichero.csv         # importar CSV puntual
npm run sync:erp                                         # sincronización (requiere ERP_SYNC_SOURCE_URL o _PATH)
```

Variables de entorno relevantes (todas opcionales en desarrollo, con
fallback documentado en el código): `SESSION_SECRET`, `NEXT_PUBLIC_GTM_ID`,
`REDSYS_MERCHANT_CODE`, `REDSYS_TERMINAL`, `REDSYS_SECRET_KEY`,
`REDSYS_ENVIRONMENT`, `ERP_SYNC_SOURCE_URL` / `ERP_SYNC_SOURCE_PATH`.

## Pendientes y checklist de lanzamiento

Todo lo que falta por confirmar con el cliente o conectar antes de lanzar
está en [`PENDIENTES.md`](./PENDIENTES.md) (detalle por fase) y
[`CHECKLIST-LANZAMIENTO.md`](./CHECKLIST-LANZAMIENTO.md) (lista de
verificación ordenada). Nada de eso está inventado ni aproximado en el
código salvo donde se indica explícitamente como ilustrativo o demo.
