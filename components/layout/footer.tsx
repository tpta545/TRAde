import Link from "next/link";
import { siteConfig } from "@/config/site";
import { getTodasLasFamilias } from "@/lib/data/familias";
import { ImagenGenerada } from "@/components/media/imagen-generada";

export function Footer() {
  const familias = getTodasLasFamilias();

  return (
    <footer className="relative mt-16 overflow-hidden border-t border-trade-gray-200 bg-trade-ink text-trade-gray-200">
      <div className="pointer-events-none absolute inset-0 opacity-[0.06]">
        <ImagenGenerada id="texture-grid" sizes="100vw" className="object-cover" alt="" />
      </div>
      <div className="relative mx-auto grid max-w-7xl grid-cols-2 gap-8 px-4 py-12 sm:px-6 md:grid-cols-5">
        <div>
          <h3 className="mb-3 text-xs font-semibold uppercase tracking-wide text-trade-white">
            Familias
          </h3>
          <ul className="space-y-2 text-sm">
            {familias.map((familia) => (
              <li key={familia.slug}>
                <Link href={`/productos/${familia.slug}`} className="hover:text-trade-white">
                  {familia.nombre}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="mb-3 text-xs font-semibold uppercase tracking-wide text-trade-white">
            Marcas
          </h3>
          <ul className="space-y-2 text-sm">
            {siteConfig.marcas.map((marca) => (
              <li key={marca}>
                <Link href={`/marcas/${marca.toLowerCase()}`} className="hover:text-trade-white">
                  {marca}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="mb-3 text-xs font-semibold uppercase tracking-wide text-trade-white">
            Servicios
          </h3>
          <ul className="space-y-2 text-sm">
            <li>
              <Link href="/servicios/reparacion-industrial" className="hover:text-trade-white">
                Reparación industrial
              </Link>
            </li>
            <li>
              <Link href="/servicios/asesoramiento-tecnico" className="hover:text-trade-white">
                Asesoramiento técnico
              </Link>
            </li>
            <li>
              <Link href="/servicios/mantenimiento-y-stock-gestionado" className="hover:text-trade-white">
                Mantenimiento y stock gestionado
              </Link>
            </li>
            <li>
              <Link href="/recursos/equivalencias" className="hover:text-trade-white">
                Buscador de equivalencias
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="mb-3 text-xs font-semibold uppercase tracking-wide text-trade-white">
            Empresa
          </h3>
          <ul className="space-y-2 text-sm">
            <li>
              <Link href="/empresa" className="hover:text-trade-white">
                Quiénes somos
              </Link>
            </li>
            <li>
              <Link href="/blog" className="hover:text-trade-white">
                Blog técnico
              </Link>
            </li>
            <li>
              <Link href="/contacto" className="hover:text-trade-white">
                Contacto
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="mb-3 text-xs font-semibold uppercase tracking-wide text-trade-white">
            {siteConfig.marca}
          </h3>
          <ul className="space-y-1.5 text-sm">
            <li>{siteConfig.razonSocial}</li>
            <li>{siteConfig.direccion.calle}</li>
            <li>
              {siteConfig.direccion.codigoPostal} {siteConfig.direccion.localidad} (
              {siteConfig.direccion.provincia})
            </li>
            <li>
              <a href={`tel:${siteConfig.contacto.telefonoInternacional}`} className="hover:text-trade-white">
                {siteConfig.contacto.telefono}
              </a>
            </li>
            <li>
              <a href={`mailto:${siteConfig.contacto.email}`} className="hover:text-trade-white">
                {siteConfig.contacto.email}
              </a>
            </li>
            <li className="text-trade-gray-500">{siteConfig.horario.texto}</li>
          </ul>
        </div>
      </div>

      <div className="relative border-t border-white/10 px-4 py-4 sm:px-6">
        <div className="mx-auto flex max-w-7xl flex-col gap-2 text-xs text-trade-gray-500 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {new Date().getFullYear()} {siteConfig.razonSocial} — {siteConfig.dominio}
          </p>
          <div className="flex flex-wrap gap-x-4 gap-y-1">
            <Link href="/legal/aviso-legal" className="hover:text-trade-white">
              Aviso legal
            </Link>
            <Link href="/legal/privacidad" className="hover:text-trade-white">
              Privacidad
            </Link>
            <Link href="/legal/cookies" className="hover:text-trade-white">
              Cookies
            </Link>
            <Link href="/legal/condiciones-de-venta" className="hover:text-trade-white">
              Condiciones de venta
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
