export type EstadoConsentimiento = "ad_storage" | "analytics_storage" | "ad_user_data" | "ad_personalization";

export type ConsentimientoGuardado = Record<EstadoConsentimiento, "granted" | "denied">;

export const CLAVE_CONSENTIMIENTO = "trade:consentimiento-cookies";

export const CONSENTIMIENTO_DENEGADO: ConsentimientoGuardado = {
  ad_storage: "denied",
  analytics_storage: "denied",
  ad_user_data: "denied",
  ad_personalization: "denied",
};

export const CONSENTIMIENTO_ACEPTADO: ConsentimientoGuardado = {
  ad_storage: "granted",
  analytics_storage: "granted",
  ad_user_data: "granted",
  ad_personalization: "granted",
};

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

export function actualizarConsentimiento(valores: ConsentimientoGuardado) {
  window.dataLayer = window.dataLayer ?? [];
  window.gtag = window.gtag ?? ((...args: unknown[]) => window.dataLayer!.push(args));
  window.gtag("consent", "update", valores);
  try {
    window.localStorage.setItem(CLAVE_CONSENTIMIENTO, JSON.stringify(valores));
  } catch {
    // Sin persistencia, el banner volverá a aparecer en la siguiente visita.
  }
}

export function leerConsentimientoGuardado(): ConsentimientoGuardado | null {
  try {
    const guardado = window.localStorage.getItem(CLAVE_CONSENTIMIENTO);
    return guardado ? (JSON.parse(guardado) as ConsentimientoGuardado) : null;
  } catch {
    return null;
  }
}
