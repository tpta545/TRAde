export function SpecTable({ atributos }: { atributos: Record<string, string | number> }) {
  const entradas = Object.entries(atributos);
  if (entradas.length === 0) return null;

  return (
    <table className="w-full border-collapse text-sm">
      <tbody>
        {entradas.map(([clave, valor]) => (
          <tr key={clave} className="border-b border-trade-gray-200 last:border-0">
            <th
              scope="row"
              className="w-1/2 py-2.5 pr-4 text-left font-normal text-trade-gray-500 sm:w-1/3"
            >
              {clave}
            </th>
            <td className="py-2.5 font-mono text-trade-gray-900">{valor}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
