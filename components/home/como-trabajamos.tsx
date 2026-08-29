import { ImagenGenerada } from "@/components/media/imagen-generada";

const PASOS = [
  {
    imagenId: "editorial-almacen-picking",
    titulo: "Preparamos tu pedido",
    descripcion: "Stock real en Algemesí: lo que ves en la ficha es lo que hay en el almacén.",
  },
  {
    imagenId: "editorial-reparto",
    titulo: "Lo llevamos nosotros",
    descripcion: "Reparto propio en la Comunitat Valenciana. Pide antes de las 17:00 y lo tienes mañana.",
  },
  {
    imagenId: "editorial-mostrador",
    titulo: "Te asesoramos si hace falta",
    descripcion: "Si no encuentras la referencia, te decimos qué pieza monta tu máquina.",
  },
];

export function ComoTrabajamos() {
  return (
    <section className="bg-trade-gray-050">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 md:py-24">
        <h2 className="mb-8 text-2xl font-heading font-semibold text-trade-gray-900">
          Cómo trabajamos
        </h2>
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-3">
          {PASOS.map((paso, indice) => (
            <div key={paso.imagenId} className="group">
              <div className="relative aspect-[4/3] overflow-hidden rounded-sm">
                <ImagenGenerada
                  id={paso.imagenId}
                  sizes="(max-width: 640px) 100vw, 33vw"
                  className="object-cover transition-transform duration-300 group-hover:scale-[1.04]"
                />
              </div>
              <p className="mt-4 font-mono text-xs text-trade-gray-500">0{indice + 1}</p>
              <h3 className="mt-1 font-heading text-lg font-semibold text-trade-gray-900">
                {paso.titulo}
              </h3>
              <p className="mt-1 text-sm text-trade-gray-500">{paso.descripcion}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
