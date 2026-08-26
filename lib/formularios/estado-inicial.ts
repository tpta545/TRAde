import type { EstadoFormulario } from "@/lib/leads/actions";

/** Estado inicial compartido por los formularios que usan useActionState. */
export const ESTADO_INICIAL_FORMULARIO: EstadoFormulario = { ok: false, mensaje: "" };
