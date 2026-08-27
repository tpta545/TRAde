export type DatoPrueba = { valor: string; etiqueta: string };

/**
 * Franja de "prueba" con datos factuales del propio servicio (Parte V.3).
 * No se usan testimonios ni logos de cliente: el prompt maestro prohíbe
 * inventar contenido de prueba social, y no hay casos reales confirmados
 * todavía (ver <<PENDIENTE>> en components/home/social-proof.tsx).
 */
export function FranjaPrueba({ datos }: { datos: DatoPrueba[] }) {
  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 md:py-16">
      <div className="grid grid-cols-1 gap-6 divide-y divide-trade-gray-200 sm:grid-cols-3 sm:divide-x sm:divide-y-0">
        {datos.map((dato) => (
          <div key={dato.etiqueta} className="pt-6 text-center first:pt-0 sm:px-6 sm:pt-0">
            <p className="font-heading text-3xl font-semibold text-trade-gray-900">{dato.valor}</p>
            <p className="mt-1 text-sm text-trade-gray-500">{dato.etiqueta}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
