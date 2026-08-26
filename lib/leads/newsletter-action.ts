"use server";

import { z } from "zod";
import { guardarLead } from "@/lib/leads/store";
import type { EstadoFormulario } from "@/lib/leads/actions";

const newsletterSchema = z.object({ email: z.string().email() });

export async function suscribirNewsletterAction(
  _estadoPrevio: EstadoFormulario,
  formData: FormData,
): Promise<EstadoFormulario> {
  const resultado = newsletterSchema.safeParse(Object.fromEntries(formData));
  if (!resultado.success) {
    return { ok: false, mensaje: "Introduce un email válido." };
  }

  // <<PENDIENTE>>: RGPD exige doble opt-in real (email de confirmación antes
  // de dar el alta por buena). Aquí solo se registra la solicitud; falta
  // conectar un proveedor de email transaccional (Fase 5).
  await guardarLead("newsletter", { email: resultado.data.email, dobleOptInConfirmado: false });

  return { ok: true, mensaje: "Revisa tu email para confirmar la suscripción." };
}
