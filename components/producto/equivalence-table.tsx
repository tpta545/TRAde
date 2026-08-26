import Link from "next/link";

export type EquivalenciaConEnlace = {
  marca: string;
  referencia: string;
  href?: string;
};

export function EquivalenceTable({ equivalencias }: { equivalencias: EquivalenciaConEnlace[] }) {
  if (equivalencias.length === 0) {
    return (
      <p className="text-sm text-trade-gray-500">
        Todavía no tenemos equivalencias confirmadas para esta referencia.{" "}
        <Link href="/recursos/equivalencias" className="text-trade-red hover:underline">
          Prueba el buscador de equivalencias
        </Link>
        .
      </p>
    );
  }

  return (
    <table className="w-full border-collapse text-sm">
      <thead>
        <tr className="border-b border-trade-gray-200 text-left text-xs uppercase tracking-wide text-trade-gray-500">
          <th className="py-2 pr-4 font-medium">Marca</th>
          <th className="py-2 font-medium">Referencia equivalente</th>
        </tr>
      </thead>
      <tbody>
        {equivalencias.map((equivalencia) => (
          <tr key={`${equivalencia.marca}-${equivalencia.referencia}`} className="border-b border-trade-gray-200 last:border-0">
            <td className="py-2.5 pr-4 text-trade-gray-500">{equivalencia.marca}</td>
            <td className="py-2.5 font-mono text-trade-gray-900">
              {equivalencia.href ? (
                <Link href={equivalencia.href} className="text-trade-red hover:underline">
                  {equivalencia.referencia}
                </Link>
              ) : (
                equivalencia.referencia
              )}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
