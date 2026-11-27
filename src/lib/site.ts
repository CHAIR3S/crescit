/**
 * Datos públicos de Crescit.
 *
 * Los canales de contacto solo se muestran si están configurados en las
 * variables de entorno (ver .env.example). Nunca se inventan.
 */

const clean = (v?: string) => (v ?? "").trim();

export const site = {
  name: "Crescit",
  url: clean(process.env.NEXT_PUBLIC_SITE_URL) ||
    (process.env.VERCEL_PROJECT_PRODUCTION_URL
      ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
      : "http://localhost:3000"),
  title: "Crescit — Webs, sistemas y automatizaciones a medida para empresas",
  description:
    "Estudio de desarrollo de software en España. Diseñamos landing pages, sistemas de gestión a medida y automatizaciones con inteligencia artificial a partir de cómo trabaja tu negocio.",
  contact: {
    /** Correo público de contacto, p. ej. hola@tudominio.es */
    email: clean(process.env.NEXT_PUBLIC_CONTACT_EMAIL),
    /** Número de WhatsApp en formato internacional sin "+" ni espacios, p. ej. 34600000000 */
    whatsapp: clean(process.env.NEXT_PUBLIC_WHATSAPP_NUMBER).replace(/[^\d]/g, ""),
  },
} as const;

export function whatsappLink(text: string) {
  if (!site.contact.whatsapp) return null;
  return `https://wa.me/${site.contact.whatsapp}?text=${encodeURIComponent(text)}`;
}

export const projects = [
  {
    id: "aldeco",
    name: "Aldeco",
    url: "https://aldeco-landing-page.vercel.app/",
    host: "aldeco-landing-page.vercel.app",
  },
  {
    id: "retrosense",
    name: "RetroSense",
    url: "https://retrosense-landing-page.vercel.app/",
    host: "retrosense-landing-page.vercel.app",
  },
] as const;
