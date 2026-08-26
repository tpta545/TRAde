import { siteConfig } from "@/config/site";
import type { Producto } from "@/lib/schemas/producto";

/** JSON-LD Organization + LocalBusiness, para incluir una vez en el layout raíz. */
export function organizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": `${siteConfig.urlBase}/#organizacion`,
    name: siteConfig.razonSocial,
    alternateName: siteConfig.marca,
    url: siteConfig.urlBase,
    telephone: siteConfig.contacto.telefonoInternacional,
    email: siteConfig.contacto.email,
    address: {
      "@type": "PostalAddress",
      streetAddress: siteConfig.direccion.calle,
      postalCode: siteConfig.direccion.codigoPostal,
      addressLocality: siteConfig.direccion.localidad,
      addressRegion: siteConfig.direccion.provincia,
      addressCountry: siteConfig.direccion.pais,
    },
    openingHoursSpecification: {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      opens: siteConfig.horario.apertura,
      closes: siteConfig.horario.cierre,
    },
    areaServed: {
      "@type": "State",
      name: "Comunitat Valenciana",
    },
  };
}

export function breadcrumbJsonLd(items: { nombre: string; url: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, indice) => ({
      "@type": "ListItem",
      position: indice + 1,
      name: item.nombre,
      item: `${siteConfig.urlBase}${item.url}`,
    })),
  };
}

export function faqJsonLd(items: { pregunta: string; respuesta: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.pregunta,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.respuesta,
      },
    })),
  };
}

function urlProducto(producto: Producto): string {
  return `${siteConfig.urlBase}/productos/${producto.familia}/${producto.subfamilia}/${producto.slug}`;
}

export function productJsonLd(producto: Producto) {
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    "@id": urlProducto(producto),
    name: producto.nombre,
    sku: producto.referencia,
    mpn: producto.referencia,
    gtin13: producto.ean,
    brand: {
      "@type": "Brand",
      name: producto.marca,
    },
    description: producto.descripcionCorta,
    image: producto.imagenes.map((imagen) => `${siteConfig.urlBase}${imagen.url}`),
    offers: {
      "@type": "Offer",
      url: urlProducto(producto),
      priceCurrency: "EUR",
      price: producto.precioTarifa.toFixed(2),
      availability:
        producto.stock > 0
          ? "https://schema.org/InStock"
          : "https://schema.org/BackOrder",
      itemCondition: "https://schema.org/NewCondition",
      seller: {
        "@type": "Organization",
        name: siteConfig.razonSocial,
      },
    },
  };
}
