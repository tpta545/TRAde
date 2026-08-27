import type { MetadataRoute } from "next";
import { siteConfig } from "@/config/site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/buscar", "/carrito", "/checkout", "/cuenta", "/pedido/", "/estilo"],
    },
    sitemap: `${siteConfig.urlBase}/sitemap.xml`,
  };
}
