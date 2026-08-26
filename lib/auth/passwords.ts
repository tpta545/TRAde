import "server-only";
import { randomBytes, scrypt as scryptCallback, timingSafeEqual } from "node:crypto";
import { promisify } from "node:util";

const scrypt = promisify(scryptCallback);

export async function hashPassword(password: string): Promise<string> {
  const sal = randomBytes(16);
  const derivada = (await scrypt(password, sal, 64)) as Buffer;
  return `${sal.toString("hex")}:${derivada.toString("hex")}`;
}

export async function verificarPassword(password: string, hash: string): Promise<boolean> {
  const [salHex, derivadaHex] = hash.split(":");
  if (!salHex || !derivadaHex) return false;
  const sal = Buffer.from(salHex, "hex");
  const derivadaGuardada = Buffer.from(derivadaHex, "hex");
  const derivadaIntento = (await scrypt(password, sal, 64)) as Buffer;
  if (derivadaIntento.length !== derivadaGuardada.length) return false;
  return timingSafeEqual(derivadaIntento, derivadaGuardada);
}
