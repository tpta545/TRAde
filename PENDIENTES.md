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
      contenido pendiente` — no inventes testimonios". El hueco está montado
      en `components/home/social-proof.tsx`, marcado `<<TODO: contenido
      pendiente>>`, a la espera de casos y logos reales.
- [ ] Fotografía real de almacén, reparto, banco de reparación y equipo
      (Parte 6 y Parte D.3). Se usa un SVG de marcador de posición
      (`public/productos/placeholder.svg`) en las fichas del seed y un fondo
      oscuro liso (sin foto) en el hero de la home.
- [ ] Página `/empresa`: año de fundación, nº de empleados, m² de almacén y
      certificaciones (mismo dato que en "Datos de negocio" más arriba,
      repetido aquí porque bloquea directamente esa página).

## Redirecciones 301 desde el sitio antiguo (Fase 4, Parte 4)

- [ ] `redirects.json` solo tiene una entrada placeholder. Falta el listado
      real de URLs de `grupotrade.es` y `trade.grupotrade.es` — el propio
      prompt pide explícitamente ese listado antes de generarlas. En cuanto
      se tenga, basta con rellenar el array (`{source, destination,
      permanent}` por entrada); `next.config.ts` ya lo carga automáticamente.

## Analítica y pago (Fase 2/3/5)

- [ ] `NEXT_PUBLIC_GTM_ID` no está configurado: sin esa variable de entorno
      no se inyecta ningún script de GTM/GA4 (`components/analitica/gtag-script.tsx`).
      Falta también Search Console y Bing Webmaster (verificación de
      propiedad) — Parte 9 del prompt.
- [ ] El envío de leads (formularios, búsquedas sin resultado, aprobación de
      cuenta B2B) solo escribe a un log local (`.data/*.jsonl`, gitignorado)
      y a consola. Falta conectar un email transaccional real
      (Resend/SendGrid u otro) para avisar al equipo comercial — ver
      `lib/leads/store.ts`.
- [ ] Newsletter sin doble opt-in real todavía (RGPD lo exige): el alta se
      registra pero no se envía email de confirmación — depende del mismo
      proveedor de email transaccional de arriba.
- [ ] Redsys: credenciales de **entorno de pruebas públicas** de Redsys
      (FUC 999008881), no las de TRADE. El algoritmo de firma
      (`lib/pago/redsys.ts`) sigue la documentación pública de Redsys pero
      **no se ha podido validar contra el sandbox real** desde este entorno
      (sin acceso de red al TPV virtual de pruebas). Antes de confiar en
      esta integración: (1) probarla con una tarjeta de test real, (2)
      sustituir `REDSYS_MERCHANT_CODE`, `REDSYS_TERMINAL` y
      `REDSYS_SECRET_KEY` por el contrato mercantil real de TRADE para
      producción.
- [ ] Validación VIES del VAT europeo para ventas intracomunitarias exentas
      de IVA (Parte 10) no está implementada — el checkout actual no
      distingue esa casuística. Requiere llamar al servicio SOAP/REST de la
      Comisión Europea en tiempo real desde el checkout.
- [ ] `SESSION_SECRET` no está configurado: la sesión de cuenta usa un
      secreto de desarrollo (`lib/auth/session.ts`), no válido en
      producción.

## Persistencia (Fase 3)

- [ ] Pedidos, usuarios, listas de compra, presupuestos y equipos se
      guardan en ficheros JSON locales (`lib/db/json-store.ts`, `.data/`),
      pensado para desarrollo y demo — no sobrevive a un despliegue
      serverless sin disco persistente. Sustituir por Postgres/Prisma o el
      ERP en la Fase 5; ningún componente que los consume necesita cambiar.
- [ ] Los presupuestos solicitados por un cliente (`/cuenta/presupuestos`)
      no tienen todavía un panel desde el que el equipo comercial responda
      con precio: hay que añadir precios manualmente al JSON o construir un
      panel admin antes de que el botón "Convertir en pedido" tenga datos
      que convertir.
- [ ] No hay panel de administración de usuarios/cuentas B2B: aprobar una
      solicitud de registro (`estado: "pendiente_aprobacion"`) hoy requiere
      editar `.data/usuarios.json` a mano.

## Deuda técnica anotada durante la Fase 0

- [ ] `npm audit` reporta 2 vulnerabilidades (1 alta) en la versión de
      `postcss` que usa Next 15 internamente, solo en build. El fix
      automático sube a Next 16, lo que rompe el requisito explícito de
      Next 15 del prompt. Revisar cuando el proyecto migre de versión mayor.
