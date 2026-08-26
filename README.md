# TRADE — web de Transmisiones del Este S.L.

Web que sustituye por completo a `grupotrade.es` y absorbe `trade.grupotrade.es`.
Construida siguiendo el prompt maestro de agosto 2026 (auditoría + especificación
funcional). Este documento recoge las decisiones tomadas en cada fase, no repite
la especificación completa.

## Estado

**Fase 0 — Cimientos.** Repositorio, stack, estructura de carpetas, tipos de
datos, capa de acceso a datos y un catálogo mínimo de verificación en
`/productos`. Sin diseño definitivo, sin buscador, sin carrito, sin checkout:
eso llega en las fases siguientes (ver Parte 11 del prompt maestro).

## Stack

- **Next.js 15** (App Router) + **TypeScript estricto** + **Tailwind CSS v4**.
- **shadcn/ui** (`components/ui`) sobre `@base-ui/react`, con los tokens de
  `app/globals.css` remapeados a la paleta TRADE (ver más abajo). Estilo
  `base-nova`, base de color `neutral` (los valores neutros se sobrescriben con
  la paleta propia; no se ha usado un preset shadcn con colores de marca porque
  no existe uno cercano a "taller limpio").
- **Zod** para el modelo de datos (`lib/schemas/producto.ts`).
- **`server-only`** para forzar que la capa de datos no se filtre a cliente.

### Por qué Next 15 y no Next 16

`create-next-app` instala Next 16 por defecto en este momento. El prompt exige
Next 15 explícitamente, así que se ha fijado la versión a `15.5.24` (la última
15.x estable) y se ha vuelto al ESLint clásico (`.eslintrc.json` con
`next/core-web-vitals`) en lugar del flat config que genera el instalador de
Next 16, que no es compatible con `eslint-config-next` en la rama 15.

`npm audit` señala 2 vulnerabilidades heredadas de la versión de `postcss` que
usa internamente Next 15 (uso en build, no en producción runtime). Arreglarlas
implica subir a Next 16, lo que rompe el requisito de versión. Queda anotado
como deuda técnica a revisar cuando el proyecto migre a Next 16.

## Estructura

```
app/                  Rutas (App Router)
components/ui/        Componentes shadcn/ui
components/producto/  (vacío por ahora) componentes de dominio de producto
config/site.ts        Datos de empresa, PRICING_MODE y demás flags
lib/schemas/           Esquemas Zod (fuente de verdad del modelo de datos)
lib/data/               Capa de acceso a datos (hoy: adaptador de ficheros)
data/productos.seed.json  Seed de 25 productos reales (5 por marca)
scripts/import-productos.ts  Importador CSV → seed, validado con Zod
```

`lib/data/productos.ts` es el único punto por el que el resto de la app debe
leer productos. Cuando se conecte Postgres/Prisma o la API del ERP (Fase 5),
solo hay que reescribir ese fichero: los componentes no cambian.

## Modelo de precios

`PRICING_MODE` vive en `config/site.ts` con tres valores (`public`,
`public_plus_net`, `login_only`) tal como pide el prompt. Por defecto está en
`"public"`. El componente `<PriceBlock>` que debe soportar los tres modos
**todavía no existe** — se construye en la Fase 1/2 junto con la ficha de
producto; de momento el listado de `/productos` solo muestra el precio de
tarifa sin lógica de sesión.

## El seed de 25 productos

Cada referencia es real y verificable (no inventada): variadores y motores
ABB (gama ACS580, arrancador PSTX, motor M3BP), cilindros y electroválvulas
Festo (DSBC según ISO 15552, serie VUVG), rodamientos NTN e ISB (dimensiones
según ISO 15:2017, referencias UCP/UCFL confirmadas en catálogo), y motores y
variador WEG (línea W22 IE3, CFW300). Los enlaces a documentación en
`documentos` apuntan a catálogos públicos reales del fabricante donde se han
podido verificar.

**Los precios de tarifa, el stock y el plazo de entrega del seed son
ilustrativos**, para poder desarrollar y probar la interfaz. No son la tarifa
real de TRADE ni deben usarse para nada comercial. Los datos reales llegan por
`npm run import:productos -- ruta.csv` desde el ERP (Fase 5) o, mientras tanto,
ampliando `data/productos.seed.json` a mano con datos reales de facturación
(ver Parte B.3 del prompt: empezar por 300–500 referencias que ya facturáis).

## Sistema de diseño (tokens ya montados, sin aplicar a página final)

Paleta y escala tipográfica de la Parte 6 del prompt maestro, volcadas en
`app/globals.css`:

- Colores propios: `trade-ink`, `trade-graphite`, `trade-gray-900/500/200/050`,
  `trade-white`, `trade-red` / `trade-red-dark`, `trade-green`, `trade-amber` —
  disponibles como utilidades Tailwind (`bg-trade-red`, `text-trade-gray-500`…).
- Los tokens semánticos de shadcn (`primary`, `secondary`, `muted`, `border`…)
  están remapeados a esta paleta, así que los componentes `ui/*` ya salen con
  el rojo TRADE como color de acción sin tocarlos.
- Tipografías vía `next/font`: **Barlow Condensed** (`--font-heading`, títulos),
  **Inter** (`--font-sans`, interfaz), **JetBrains Mono** (`--font-mono`,
  referencias y tablas técnicas).
- Escala 12/14/16/18/24/32/44/56 mapeada sobre `text-xs…text-6xl`.
- **Sin modo oscuro**, según la Parte 6 ("es un B2B, añade complejidad y no
  aporta"): se ha quitado el bloque `.dark` que genera `shadcn init` por
  defecto y los tokens de `sidebar-*`/`chart-*` que no se usan.

Ningún componente de página usa todavía este sistema a fondo: `/` y
`/productos` son deliberadamente mínimos (tabla de verificación, sin
`<ProductCard>`, sin `<TrustBar>`, etc.). Esos componentes y la home definitiva
llegan en las Fases 1 y 4.

## Cómo ejecutar

```
npm install
npm run dev      # http://localhost:3000/productos lista los 25 productos
npm run build    # build de producción
npm run lint     # ESLint
npm run import:productos -- ruta/al/fichero.csv   # importar CSV del ERP
```

## Pendientes

Todo lo que falta por confirmar con el cliente (precios de tarifa, portes,
CIF, permiso de los fabricantes para publicar precio online, etc.) está en
[`PENDIENTES.md`](./PENDIENTES.md), no inventado ni aproximado en el código
salvo donde se indica explícitamente como ilustrativo.

## Próxima fase

**Fase 1 — Catálogo y ficha**: familias, subfamilias, filtros, orden,
paginación, ficha de producto completa con todas sus secciones, schema.org,
sitemap y metadatos. Sin carrito todavía. Antes de empezarla, según la Parte
12 del prompt, toca presentar el plan en 10 líneas y esperar el OK.
