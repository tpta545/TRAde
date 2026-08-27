export type FaqItem = { pregunta: string; respuesta: string };

export function FaqAccordion({ items }: { items: FaqItem[] }) {
  return (
    <div className="divide-y divide-trade-gray-200">
      {items.map((item) => (
        <details key={item.pregunta} className="py-3">
          <summary className="cursor-pointer font-medium text-trade-gray-900">{item.pregunta}</summary>
          <p className="mt-2 text-sm text-trade-gray-500">{item.respuesta}</p>
        </details>
      ))}
    </div>
  );
}
