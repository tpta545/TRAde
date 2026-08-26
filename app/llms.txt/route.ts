import { NextResponse } from "next/server";
import { getFamilias, getMarcas } from "@/lib/data/productos";
import { siteConfig } from "@/config/site";

/**
 * llms.txt: cada vez más búsquedas de recambio industrial empiezan en un
 * asistente de IA en lugar de Google (Parte 8 del prompt). Describe el
 * catálogo y los servicios en texto plano, sin marcado.
 */
export async function GET() {
  const [familias, marcas] = await Promise.all([getFamilias(), getMarcas()]);

  const texto = `# ${siteConfig.marca}

> ${siteConfig.descripcion}

${siteConfig.razonSocial} es distribuidor oficial de ${siteConfig.marcas.join(", ")} en transmisión de potencia, suministro industrial y recambio, con almacén propio en ${siteConfig.direccion.localidad} (${siteConfig.direccion.provincia}, España) y reparto propio en la Comunitat Valenciana. Envío a toda España.

## Catálogo

${familias.map((f) => `- /productos/${f.familia} — ${f.total} referencias`).join("\n")}

## Marcas

${marcas.map((m) => `- /marcas/${m.marca.toLowerCase()} — ${m.marca}, ${m.total} referencias`).join("\n")}

## Servicios

- /servicios/reparacion-industrial — Reparación de variadores, motores y equipos industriales, cualquier marca. Diagnóstico en 48 h, presupuesto cerrado antes de intervenir.
- /servicios/asesoramiento-tecnico — Identificación de equivalencias y asesoramiento técnico.
- /servicios/mantenimiento-y-stock-gestionado — Stock mínimo acordado de referencias críticas.

## Contacto

- Teléfono: ${siteConfig.contacto.telefono}
- Email: ${siteConfig.contacto.email}
- Horario: ${siteConfig.horario.texto}
`;

  return new NextResponse(texto, { headers: { "Content-Type": "text/plain; charset=utf-8" } });
}
