# Pendientes

Datos que el prompt maestro pide explícitamente y que no se han inventado.
Mientras no se confirmen, el código los deja marcados como `<<PENDIENTE>>` o
usa `null`/valores ilustrativos claramente señalados como tales (ver
`config/site.ts` y el README, sección "El seed de 25 productos").

## Bloqueante antes de tocar precios de verdad (Parte D.1 del prompt)

- [ ] **Confirmar por escrito con ABB, Festo, NTN, WEG e ISB** si sus
      contratos de distribución permiten publicar precio online y vender
      fuera de la zona de distribución habitual. Es lo primero de toda la
      lista según el propio prompt: "todo lo demás depende de eso".

## Datos de negocio (Parte 13 del prompt)

- [ ] Portes gratis a partir de: `<<... €>>`
- [ ] Coste de portes por debajo de ese importe: `<<... €>>`
- [ ] Hora de corte para envío mismo día: confirmar si son realmente las
      17:00 (usado como valor por defecto en `config/site.ts`)
- [ ] Zonas de reparto propio (listado exacto de municipios/comarcas)
- [ ] Plazo estándar bajo pedido (días)
- [ ] Formas de pago para cuenta B2B (30/60/90 días, confirming, recibo…)
- [ ] Número aproximado de referencias vivas en catálogo
- [ ] ERP utilizado (condiciona el formato de exportación de
      `scripts/import-productos.ts` y el diseño de la sincronización de la
      Fase 5)
- [ ] Año de fundación de TRADE
- [ ] Número de empleados
- [ ] m² de almacén
- [ ] Certificaciones (ISO, etc.)

## Fiscal / legal

- [ ] CIF de Transmisiones del Este S.L. (`config/site.ts` → `fiscal.cif`)
- [ ] Datos de inscripción en el Registro Mercantil
      (`config/site.ts` → `fiscal.registroMercantil`)
- [ ] Textos legales (`Aviso legal`, `Privacidad`, `Cookies`, `Condiciones de
      venta`) están pendientes de redacción — se marcarán
      `PENDIENTE DE REVISIÓN JURÍDICA` cuando se escriban en la Fase 4/5, tal
      como pide la Parte 10 del prompt.

## Decisión de negocio pendiente antes de la Fase 4

- [ ] Qué hacer con `trade.grupotrade.es` / catálogo Cadena88: matarla,
      separarla en dominio propio, o absorber solo "Ferretería y EPI" (Parte
      B.5 del prompt). Necesaria antes de generar `/redirects.json`.
- [ ] Quién atiende los pedidos online el día 1 del lanzamiento (Parte D.4).

## Contenido que no se ha generado porque el prompt lo prohíbe sin datos reales

- [ ] Testimonios de clientes, logos de clientes, casos de uso reales para la
      home (Parte 7.1, punto 8): "si aún no hay, deja el hueco marcado `TODO:
      contenido pendiente` — no inventes testimonios". Todavía no se ha
      construido la home definitiva, así que este hueco se creará en la Fase 4.
- [ ] Fotografía real de almacén, reparto, banco de reparación y equipo
      (Parte 6 y Parte D.3). Se usa un SVG de marcador de posición
      (`public/productos/placeholder.svg`) en las fichas del seed.

## Deuda técnica anotada durante la Fase 0

- [ ] `npm audit` reporta 2 vulnerabilidades (1 alta) en la versión de
      `postcss` que usa Next 15 internamente, solo en build. El fix
      automático sube a Next 16, lo que rompe el requisito explícito de
      Next 15 del prompt. Revisar cuando el proyecto migre de versión mayor.
