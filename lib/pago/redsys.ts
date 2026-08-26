import "server-only";
import { createCipheriv, createHmac } from "node:crypto";
import { siteConfig } from "@/config/site";

/**
 * Integración con Redsys (pasarela obligatoria en España, Parte 3 del
 * prompt). Implementa el algoritmo público de firma HMAC_SHA256_V1 de
 * Redsys: JSON de parámetros en base64, clave de comercio derivada por
 * pedido vía 3DES-CBC, y HMAC-SHA256 de los parámetros con esa clave.
 *
 * <<PENDIENTE>>: sin credenciales reales de TRADE, se usan las credenciales
 * públicas de entorno de pruebas que Redsys documenta en sus manuales de
 * integración (FUC 999008881, terminal 1). No se ha podido validar contra
 * el entorno real de pruebas de Redsys desde aquí — antes de dar por buena
 * esta integración, hay que probarla con una tarjeta de test real en el
 * TPV virtual de pruebas y, para producción, sustituir las tres variables
 * de entorno por el contrato mercantil real (ver PENDIENTES.md).
 */

const CONFIG_PRUEBAS = {
  urlPago: "https://sis-t.redsys.es:25443/sis/realizarPago",
  codigoComercio: "999008881",
  terminal: "1",
  claveSecretaBase64: "sq7HjrUOBfKmC576ILgskD5srU870gJ7",
};

function configuracionRedsys() {
  const enProduccion = process.env.REDSYS_ENVIRONMENT === "production";
  return {
    urlPago: enProduccion
      ? "https://sis.redsys.es/sis/realizarPago"
      : CONFIG_PRUEBAS.urlPago,
    codigoComercio: process.env.REDSYS_MERCHANT_CODE ?? CONFIG_PRUEBAS.codigoComercio,
    terminal: process.env.REDSYS_TERMINAL ?? CONFIG_PRUEBAS.terminal,
    claveSecretaBase64: process.env.REDSYS_SECRET_KEY ?? CONFIG_PRUEBAS.claveSecretaBase64,
  };
}

function cifrar3DES(clave: Buffer, datos: Buffer): Buffer {
  const iv = Buffer.alloc(8, 0);
  const cifrador = createCipheriv("des-ede3-cbc", clave, iv);
  cifrador.setAutoPadding(false);
  return Buffer.concat([cifrador.update(datos), cifrador.final()]);
}

function claveDerivadaPorPedido(numeroPedido: string): Buffer {
  const { claveSecretaBase64 } = configuracionRedsys();
  const claveComercio = Buffer.from(claveSecretaBase64, "base64");

  // El pedido se rellena con ceros hasta múltiplo de 8 bytes para 3DES (sin PKCS5).
  const pedidoBuffer = Buffer.from(numeroPedido, "utf-8");
  const relleno = (8 - (pedidoBuffer.length % 8)) % 8;
  const pedidoRellenado = Buffer.concat([pedidoBuffer, Buffer.alloc(relleno, 0)]);

  return cifrar3DES(claveComercio, pedidoRellenado);
}

export type ParametrosPagoRedsys = {
  /** Nº de pedido: 4-12 caracteres, los 4 primeros deben ser dígitos (norma Redsys). */
  numeroPedido: string;
  importeEnCentimos: number;
  urlNotificacion: string;
  urlOk: string;
  urlKo: string;
  descripcion: string;
};

export type FormularioRedsys = {
  urlAccion: string;
  Ds_SignatureVersion: "HMAC_SHA256_V1";
  Ds_MerchantParameters: string;
  Ds_Signature: string;
};

export function generarFormularioPago(parametros: ParametrosPagoRedsys): FormularioRedsys {
  const { codigoComercio, terminal, urlPago } = configuracionRedsys();

  const merchantParameters = {
    DS_MERCHANT_AMOUNT: String(parametros.importeEnCentimos),
    DS_MERCHANT_ORDER: parametros.numeroPedido,
    DS_MERCHANT_MERCHANTCODE: codigoComercio,
    DS_MERCHANT_CURRENCY: "978", // EUR
    DS_MERCHANT_TRANSACTIONTYPE: "0", // autorización
    DS_MERCHANT_TERMINAL: terminal,
    DS_MERCHANT_MERCHANTURL: parametros.urlNotificacion,
    DS_MERCHANT_URLOK: parametros.urlOk,
    DS_MERCHANT_URLKO: parametros.urlKo,
    DS_MERCHANT_PRODUCTDESCRIPTION: parametros.descripcion.slice(0, 125),
    DS_MERCHANT_MERCHANTNAME: siteConfig.razonSocial,
  };

  const parametrosBase64 = Buffer.from(JSON.stringify(merchantParameters)).toString("base64");
  const clave = claveDerivadaPorPedido(parametros.numeroPedido);
  const firma = createHmac("sha256", clave).update(parametrosBase64).digest("base64");

  return {
    urlAccion: urlPago,
    Ds_SignatureVersion: "HMAC_SHA256_V1",
    Ds_MerchantParameters: parametrosBase64,
    Ds_Signature: firma,
  };
}

/** Verifica la notificación (o el retorno del navegador) que envía Redsys tras el pago. */
export function verificarNotificacion(dsMerchantParameters: string, dsSignatureRecibida: string): boolean {
  let numeroPedido: string;
  try {
    const decodificado = JSON.parse(Buffer.from(dsMerchantParameters, "base64").toString("utf-8"));
    numeroPedido = decodificado.Ds_Order ?? decodificado.DS_ORDER;
  } catch {
    return false;
  }
  if (!numeroPedido) return false;

  const clave = claveDerivadaPorPedido(numeroPedido);
  const firmaEsperada = createHmac("sha256", clave)
    .update(dsMerchantParameters)
    .digest("base64")
    // Redsys codifica la firma de vuelta en base64 "url safe"
    .replace(/\+/g, "-")
    .replace(/\//g, "_");

  return firmaEsperada === dsSignatureRecibida;
}

export function decodificarParametros(dsMerchantParameters: string): Record<string, string> {
  return JSON.parse(Buffer.from(dsMerchantParameters, "base64").toString("utf-8"));
}
