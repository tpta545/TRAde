import type { Metadata } from "next";
import { Barlow_Condensed, Inter, JetBrains_Mono } from "next/font/google";
import { siteConfig } from "@/config/site";
import { organizationJsonLd } from "@/lib/seo/schema";
import { IvaProvider } from "@/lib/context/iva-context";
import { CartProvider } from "@/lib/cart/cart-context";
import { CartDrawer } from "@/components/carrito/cart-drawer";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { ConsentBanner } from "@/components/analitica/consent-banner";
import { GtagScript } from "@/components/analitica/gtag-script";
import "./globals.css";

const barlowCondensed = Barlow_Condensed({
  variable: "--font-heading",
  subsets: ["latin"],
  weight: ["600", "700"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.urlBase),
  title: {
    default: siteConfig.nombre,
    template: `%s | ${siteConfig.marca}`,
  },
  description: siteConfig.descripcion,
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="es"
      className={`${barlowCondensed.variable} ${inter.variable} ${jetbrainsMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-sans text-base leading-relaxed">
        <GtagScript />
        <script
          type="application/ld+json"
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd()) }}
        />
        <IvaProvider>
          <CartProvider>
            <Header />
            <div className="flex flex-1 flex-col">{children}</div>
            <Footer />
            <CartDrawer />
          </CartProvider>
        </IvaProvider>
        <ConsentBanner />
      </body>
    </html>
  );
}
