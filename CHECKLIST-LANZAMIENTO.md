# Checklist de lanzamiento

Antes de sustituir `grupotrade.es` por esta web, en orden aproximado.

## Bloqueante — sin esto no se puede lanzar

- [ ] **Confirmación por escrito de ABB, Festo, NTN, WEG e ISB** de que se
      puede publicar precio online y vender fuera de la zona de
      distribución habitual (Parte D.1 del prompt). Es lo primero de todo.
- [ ] Datos reales de catálogo: precio de tarifa, stock y plazo de al menos
      300–500 referencias que ya facturáis, importados vía
      `npm run import:productos` o `npm run sync:erp` — no los datos
      ilustrativos del seed de 25 productos de la Fase 0.
- [ ] Decisión sobre `trade.grupotrade.es` / catálogo Cadena88: matarla,
      separarla, o absorber solo "Ferretería y EPI" (Parte B.5).
- [ ] Quién atiende los pedidos online el día 1 (Parte D.4): un pedido web
      sin respuesta en días no es un canal.
- [ ] Revisión jurídica real de las 4 páginas en `/legal/*` (hoy son
      borrador, marcadas `PENDIENTE DE REVISIÓN JURÍDICA`).
- [ ] CIF y datos de Registro Mercantil reales en `config/site.ts`.

## Antes de aceptar pagos de verdad

- [ ] Contrato de comercio electrónico con Redsys y credenciales de
      producción (`REDSYS_MERCHANT_CODE`, `REDSYS_TERMINAL`,
      `REDSYS_SECRET_KEY`) en lugar de las de entorno de pruebas.
- [ ] Probar la integración de Redsys contra su entorno de pruebas real con
      una tarjeta de test — no se ha podido hacer desde este entorno de
      desarrollo (sin acceso de red al TPV virtual).
- [ ] Datos bancarios reales para la opción de pago por transferencia.
- [ ] `SESSION_SECRET` real en el entorno de producción (no el valor de
      desarrollo).

## Datos comerciales (Parte 13)

- [ ] Portes gratis a partir de X €, coste de portes por debajo, hora de
      corte real, zonas de reparto propio, plazo estándar bajo pedido,
      condiciones de pago B2B (30/60/90 días, confirming...).

## Antes de medir tráfico

- [ ] Crear la propiedad GA4 y el contenedor GTM reales; configurar
      `NEXT_PUBLIC_GTM_ID`.
- [ ] Verificar la propiedad en Google Search Console y en Bing Webmaster
      Tools (meta de verificación o fichero, según el método elegido).
- [ ] Revisar en el propio GTM que los eventos personalizados
      (`search_no_results`, `quick_order_used`, `reorder_clicked`,
      `repair_lead`, `quote_requested`, `stock_badge_seen`,
      `login_price_reveal`) llegan correctamente a GA4 como eventos, no
      solo al dataLayer.
- [ ] Conectar Google Merchant Center al feed `/api/feed/google-shopping.xml`
      y revisar que no hay rechazos de producto.

## Contenido

- [ ] Sesión de fotos real: almacén, furgoneta de reparto, banco de
      reparación, equipo (Parte D.3). Sustituye el SVG de marcador de
      posición en `public/productos/placeholder.svg` y el hero sin foto de
      la home.
- [ ] Rellenar el bloque de prueba social de la home
      (`components/home/social-proof.tsx`) con casos y logos reales, con
      permiso de los clientes.
- [ ] Completar `/empresa` (año de fundación, empleados, m², certificaciones).

## Migración desde el sitio antiguo

- [ ] Listado real de URLs de `grupotrade.es` y `trade.grupotrade.es` para
      rellenar `redirects.json` (hoy solo tiene un placeholder).
- [ ] Después de desplegar, comprobar con una herramienta de rastreo
      (Screaming Frog o similar) que no quedan enlaces internos rotos ni
      redirecciones en cadena.

## Técnico

- [ ] Reemplazar el almacén de leads/pedidos/usuarios basado en ficheros
      JSON locales (`lib/db/json-store.ts`, `.data/`) por una base de datos
      real o el ERP — no sobrevive a un despliegue serverless sin disco
      persistente (ver PENDIENTES.md).
- [ ] Conectar un proveedor de email transaccional real (leads, newsletter
      con doble opt-in, confirmación de pedido).
- [ ] Panel de administración mínimo para responder presupuestos y aprobar
      cuentas B2B (hoy se hace editando `.data/*.json` a mano).
- [ ] Auditoría con Lighthouse en producción: LCP ≤ 2,0 s en móvil 4G,
      INP ≤ 200 ms, CLS ≤ 0,1, SEO ≥ 95, rendimiento ≥ 90 (Parte 2). El
      First Load JS de la ficha de producto en build está en ~115 KB,
      dentro del presupuesto de 170 KB de la Parte 8; falta medir en un
      dispositivo real, no solo en el build.
- [ ] Pruebas de carga con el catálogo completo (miles de referencias, no
      las 25 del seed) — no se ha podido hacer desde este entorno.
- [ ] Configurar la sincronización nocturna real (`npm run sync:erp`) como
      tarea programada, apuntando `ERP_SYNC_SOURCE_URL` o
      `ERP_SYNC_SOURCE_PATH` al export real del ERP.
- [ ] `npm audit` señala 2 vulnerabilidades heredadas del `postcss` interno
      de Next 15 (solo en build). Revisar al migrar a Next 16.
