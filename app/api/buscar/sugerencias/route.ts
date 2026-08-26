import { NextResponse } from "next/server";
import { sugerir } from "@/lib/search/indice";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get("q") ?? "";
  const sugerencias = await sugerir(q);

  return NextResponse.json({
    productos: sugerencias.productos.slice(0, 5).map((p) => ({
      slug: p.slug,
      familia: p.familia,
      subfamilia: p.subfamilia,
      referencia: p.referencia,
      nombre: p.nombre,
      marca: p.marca,
    })),
    familias: sugerencias.familias,
    marcas: sugerencias.marcas,
  });
}
