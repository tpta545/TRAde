"use client";

/**
 * Envío de eventos a dataLayer (GA4 vía GTM). Respeta el consentimiento:
 * si el usuario no ha aceptado analítica, gtag descarta el evento porque
 * analytics_storage sigue en "denied" (Consent Mode v2), así que no hace
 * falta comprobarlo aquí.
 */
export type EventoTrade =
  | "view_item_list"
  | "view_item"
  | "add_to_cart"
  | "begin_checkout"
  | "add_payment_info"
  | "purchase"
  | "search_no_results"
  | "quick_order_used"
  | "reorder_clicked"
  | "repair_lead"
  | "quote_requested"
  | "stock_badge_seen"
  | "login_price_reveal";

export function trackEvent(nombre: EventoTrade, parametros: Record<string, unknown> = {}) {
  if (typeof window === "undefined") return;
  window.dataLayer = window.dataLayer ?? [];
  window.dataLayer.push({ event: nombre, ...parametros });
}
