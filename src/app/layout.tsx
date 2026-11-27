import type { Metadata, Viewport } from "next";
import { Archivo } from "next/font/google";
import { site } from "@/lib/site";
import "./globals.css";

/**
 * Archivo variable con eje de anchura: ancho expandido para los titulares (eco
 * del logotipo extendido de Crescit), ancho normal para leer y semicondensado
 * para los datos pequeños. Una sola familia, tres voces.
 */
const archivo = Archivo({
  subsets: ["latin"],
  axes: ["wdth"],
  variable: "--font-archivo",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: site.title,
  description: site.description,
  applicationName: "Crescit",
  keywords: [
    "desarrollo de software a medida",
    "landing pages",
    "diseño web",
    "sistemas de gestión",
    "CRM a medida",
    "sistema de reservas",
    "automatización de procesos",
    "inteligencia artificial para empresas",
    "automatización WhatsApp",
    "España",
  ],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "es_ES",
    url: "/",
    siteName: "Crescit",
    title: site.title,
    description: site.description,
  },
  twitter: {
    card: "summary_large_image",
    title: site.title,
    description: site.description,
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#000000",
  colorScheme: "dark",
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Crescit",
  url: site.url,
  logo: `${site.url}/icon.png`,
  description: site.description,
  areaServed: "ES",
  knowsAbout: ["Desarrollo web", "Software a medida", "Automatización de procesos", "Inteligencia artificial"],
  ...(site.contact.email ? { email: site.contact.email } : {}),
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="es-ES" className={archivo.variable}>
      <body>
        <a className="skip-link" href="#contenido">
          Saltar al contenido
        </a>
        {children}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
        />
      </body>
    </html>
  );
}
