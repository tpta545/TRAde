/**
 * Biblia de estilo del pipeline de imágenes (Fase V, V.1). Estos bloques se
 * concatenan a TODOS los prompts — nunca se improvisa un estilo distinto
 * por imagen. Ver `manifest.ts` para cómo se componen (STYLE_BASE +
 * descripción específica + composición + STYLE_NEGATIVE, o STYLE_PRODUCT_ILLU
 * en vez de STYLE_BASE para el Grupo 2).
 */

export const STYLE_BASE = `
Photographic style: editorial industrial photography, shot on a full-frame camera
with a 35mm lens, natural directional light with hard-edged shadows, slight haze,
fine film grain. Muted desaturated palette built on charcoal (#111214), graphite,
cool grey and off-white, with a single deep red accent (#D8232A) appearing sparingly
as a machine detail, a painted line or a safety element. Realistic, unglamorous,
lived-in. High detail in the mid-tones, deep blacks, no crushed highlights.
`.trim();

export const STYLE_NEGATIVE = `
Do not include: any text, letters, numbers, logos, brand marks or signage.
No people looking at the camera, no smiling stock-photo models, no handshakes,
no suits in a factory, no glowing blue holograms, no futuristic HUD overlays,
no lens flares, no rainbow gradients, no clip-art icons, no watermarks.
Do not depict any identifiable real brand of machinery.
`.trim();

export const STYLE_PRODUCT_ILLU = `
Style: clean technical still-life on a seamless light grey background (#F6F7F8),
single generic unbranded industrial component centred, soft top-left key light,
one subtle contact shadow, shallow depth of field, engineering-catalogue aesthetic.
`.trim();

/**
 * Compone el prompt final para una imagen del Grupo 2 (familias de producto,
 * catálogo técnico): STYLE_PRODUCT_ILLU sustituye a STYLE_BASE.
 */
export function componerPromptProducto(descripcionEspecifica: string): string {
  return [STYLE_PRODUCT_ILLU, descripcionEspecifica, STYLE_NEGATIVE].join("\n\n");
}

/**
 * Compone el prompt final para el resto de grupos (fotografía editorial):
 * STYLE_BASE + descripción específica (incluye ya la composición) + STYLE_NEGATIVE.
 */
export function componerPromptEditorial(descripcionEspecifica: string): string {
  return [STYLE_BASE, descripcionEspecifica, STYLE_NEGATIVE].join("\n\n");
}
