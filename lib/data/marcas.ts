export type MarcaInfo = {
  slug: string;
  nombre: string;
  descripcion: string;
  gama: string;
};

export const MARCAS_INFO: Record<string, MarcaInfo> = {
  abb: {
    slug: "abb",
    nombre: "ABB",
    descripcion:
      "Distribuidor oficial de ABB en motores eléctricos, variadores de frecuencia y arrancadores suaves. Mantenemos stock de las potencias de mayor rotación en Algemesí.",
    gama: "Motores eléctricos (M3BP), variadores de frecuencia (ACS580) y arrancadores suaves (PSTX).",
  },
  festo: {
    slug: "festo",
    nombre: "Festo",
    descripcion:
      "Distribuidor oficial de Festo en neumática industrial: cilindros normalizados, electroválvulas, racordaje y unidades de mantenimiento.",
    gama: "Cilindros normalizados ISO 15552 (DSBC) y electroválvulas (VUVG).",
  },
  ntn: {
    slug: "ntn",
    nombre: "NTN",
    descripcion:
      "Distribuidor oficial de NTN en rodamientos: rígidos de bolas, de rodillos y soportes, con dimensiones normalizadas ISO 15:2017.",
    gama: "Rodamientos rígidos de bolas en las series 60, 62 y 63.",
  },
  weg: {
    slug: "weg",
    nombre: "WEG",
    descripcion:
      "Distribuidor oficial de WEG en motores eléctricos trifásicos y variadores de frecuencia, con eficiencia IE3 en toda la gama W22.",
    gama: "Motores eléctricos (W22 IE3) y variadores de frecuencia compactos (CFW300).",
  },
  isb: {
    slug: "isb",
    nombre: "ISB",
    descripcion:
      "Distribuidor oficial de ISB en rodamientos y soportes de gama calidad-precio, con las mismas dimensiones normalizadas que las marcas premium.",
    gama: "Rodamientos rígidos de bolas, soportes de pie (UCP) y soportes de brida (UCFL).",
  },
};

export function getMarcaInfo(slug: string): MarcaInfo {
  return (
    MARCAS_INFO[slug.toLowerCase()] ?? {
      slug: slug.toLowerCase(),
      nombre: slug.toUpperCase(),
      descripcion: "",
      gama: "",
    }
  );
}
