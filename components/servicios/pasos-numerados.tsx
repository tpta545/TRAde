export type PasoNumerado = { titulo: string; descripcion: string };

/** "Cómo funciona" en pasos con números grandes (Parte V.3), franja gris. */
export function PasosNumerados({ titulo, pasos }: { titulo: string; pasos: PasoNumerado[] }) {
  return (
    <div className="bg-trade-gray-050">
      <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 md:py-16">
        <h2 className="mb-8 text-2xl font-heading font-semibold text-trade-gray-900">{titulo}</h2>
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {pasos.map((paso, indice) => (
            <div key={paso.titulo}>
              <p className="font-mono text-3xl font-semibold text-trade-gray-200">
                {String(indice + 1).padStart(2, "0")}
              </p>
              <h3 className="mt-2 font-heading text-base font-semibold text-trade-gray-900">
                {paso.titulo}
              </h3>
              <p className="mt-1 text-sm text-trade-gray-500">{paso.descripcion}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
