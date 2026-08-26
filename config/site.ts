/**
 * Configuración central del sitio: datos de empresa y banderas de producto.
 * Todo lo marcado "PENDIENTE" está pendiente de confirmación por el cliente
 * (ver PENDIENTES.md en la raíz) y no debe usarse en textos legales o
 * comerciales sin verificar primero.
 */

/**
 * Modelo de precios (Parte 3 del prompt maestro).
 * - "public": tarifa visible para todos, carrito y pago con tarjeta abiertos sin registro.
 * - "public_plus_net": tarifa visible para todos + "TU PRECIO" con descuento al iniciar sesión. Recomendado.
 * - "login_only": precio solo visible para clientes identificados.
 */
export type PricingMode = "public" | "public_plus_net" | "login_only";

export const PRICING_MODE: PricingMode = "public";

export const siteConfig = {
  nombre: "TRADE — Transmisiones del Este S.L.",
  marca: "TRADE",
  razonSocial: "Transmisiones del Este S.L.",
  descripcion:
    "Distribuidor oficial de ABB, Festo, NTN, WEG e ISB. Stock propio en Algemesí, reparto propio en la Comunitat Valenciana y envío a toda España. Servicio técnico de reparación con informe.",
  dominio: "grupotrade.es",
  urlBase: "https://www.grupotrade.es",

  direccion: {
    calle: "C/ Sabaters 32",
    codigoPostal: "46680",
    localidad: "Algemesí",
    provincia: "Valencia",
    pais: "ES",
  },

  contacto: {
    telefono: "961 753 565",
    telefonoInternacional: "+34961753565",
    email: "info@grupotrade.es",
  },

  horario: {
    apertura: "08:00",
    cierre: "18:00",
    texto: "Lunes a viernes, 08:00–18:00",
  },

  // CIF, registro mercantil: pendientes de confirmación, ver PENDIENTES.md.
  fiscal: {
    cif: "<<PENDIENTE: CIF de Transmisiones del Este S.L.>>",
    registroMercantil: "<<PENDIENTE: datos de inscripción en el Registro Mercantil>>",
  },

  marcas: ["ABB", "FESTO", "NTN", "WEG", "ISB"] as const,

  ventajas: [
    {
      titulo: "Stock real en Algemesí",
      descripcion: "Entrega en 24 h con reparto propio en la Comunitat Valenciana.",
    },
    {
      titulo: "Servicio técnico de reparación",
      descripcion: "Reparamos con informe técnico de reparación. Nadie de los grandes lo hace.",
    },
    {
      titulo: "Asesoramiento y equivalencias",
      descripcion: "Te decimos qué pieza monta tu máquina, aunque no sea de las marcas que distribuimos.",
    },
  ],

  // Comercio: pendientes de confirmar con el cliente (Parte 13 del prompt).
  comercio: {
    portesGratisDesde: null as number | null, // <<PENDIENTE: importe en euros>>
    costePortesPorDebajo: null as number | null, // <<PENDIENTE: importe en euros>>
    horaCorteEnvioMismoDia: "17:00", // <<PENDIENTE: confirmar hora de corte real>>
    zonasRepartoPropio: "<<PENDIENTE: listado de zonas con reparto propio>>",
    plazoEstandarBajoPedido: null as number | null, // <<PENDIENTE: días>>
    formasPagoB2B: "<<PENDIENTE: 30/60/90 días, confirming, recibo...>>",
    ivaPorDefectoIncluido: false,
    ivaPorcentaje: 21,
  },

  // Flags de producto
  flags: {
    // Si "false", el conmutador IVA incluido/excluido no se muestra (siempre sin IVA).
    mostrarConmutadorIva: true,
    // Habilita el bloque "TU PRECIO" cuando PRICING_MODE === "public_plus_net" y hay sesión.
    mostrarPrecioNeto: true,
    modoOscuro: false, // Nunca activar: B2B, sin aporte, ver Parte 6.
  },
} as const;

export type SiteConfig = typeof siteConfig;
