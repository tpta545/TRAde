import type { NextConfig } from "next";
import redirectsData from "./redirects.json";

type RedirectEntry = { source: string; destination: string; permanent: boolean };

// El placeholder __PENDIENTE__ de redirects.json se descarta hasta que haya
// un listado real de URLs antiguas (ver PENDIENTES.md).
const redireccionesValidas: RedirectEntry[] = (redirectsData as (RedirectEntry & { _nota?: string })[])
  .filter((entrada) => entrada.source !== "__PENDIENTE__")
  .map(({ source, destination, permanent }) => ({ source, destination, permanent }));

const nextConfig: NextConfig = {
  async redirects() {
    return redireccionesValidas;
  },
};

export default nextConfig;
