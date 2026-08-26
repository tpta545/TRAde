import { FileText } from "lucide-react";
import type { Producto } from "@/lib/schemas/producto";

const ETIQUETAS: Record<Producto["documentos"][number]["tipo"], string> = {
  ficha_tecnica: "Ficha técnica",
  catalogo: "Catálogo",
  declaracion_ce: "Declaración CE",
  cad: "Modelo CAD",
  manual: "Manual",
};

export function DocumentList({ documentos }: { documentos: Producto["documentos"] }) {
  if (documentos.length === 0) {
    return <p className="text-sm text-trade-gray-500">No hay documentación publicada para esta referencia todavía.</p>;
  }

  return (
    <ul className="space-y-2">
      {documentos.map((documento) => (
        <li key={documento.url}>
          <a
            href={documento.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-sm text-trade-gray-900 hover:text-trade-red hover:underline"
          >
            <FileText className="h-4 w-4 shrink-0 text-trade-gray-500" aria-hidden />
            <span>{documento.titulo}</span>
            <span className="text-xs text-trade-gray-500">({ETIQUETAS[documento.tipo]})</span>
          </a>
        </li>
      ))}
    </ul>
  );
}
