import Script from "next/script";
import { CONSENTIMIENTO_DENEGADO } from "@/lib/analitica/consent";

/**
 * Arranque de Consent Mode v2 + GTM. El consentimiento por defecto se fija
 * a "denied" ANTES de cargar GTM, tal como exige Google: así ningún tag de
 * analítica o de publicidad se dispara hasta que <ConsentBanner> lo active.
 *
 * NEXT_PUBLIC_GTM_ID no está configurado todavía (ver PENDIENTES.md): sin
 * esa variable de entorno no se inyecta ningún script de terceros.
 */
export function GtagScript() {
  const idGtm = process.env.NEXT_PUBLIC_GTM_ID;

  return (
    <>
      {/* eslint-disable-next-line @next/next/no-before-interactive-script-outside-document -- válido: se renderiza en app/layout.tsx (root layout), la ubicación correcta en App Router; la regla es un falso positivo heredado de Pages Router. */}
      <Script id="consent-mode-default" strategy="beforeInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){window.dataLayer.push(arguments);}
          gtag('consent', 'default', ${JSON.stringify(CONSENTIMIENTO_DENEGADO)});
          window.gtag = gtag;
        `}
      </Script>
      {idGtm && (
        <Script id="gtm-loader" strategy="afterInteractive">
          {`
            (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});
            var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';
            j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
            })(window,document,'script','dataLayer','${idGtm}');
          `}
        </Script>
      )}
    </>
  );
}
