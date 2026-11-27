"use client";

import { useRef } from "react";
import { gsap, useGSAP, prefersReducedMotion } from "@/lib/gsap";
import { scrollToId } from "@/lib/contact-store";
import { site } from "@/lib/site";
import { RollText } from "./ui/Button";
import { Star, Wordmark } from "./ui/brand";
import s from "./Footer.module.css";

const LINKS = [
  { id: "servicios", label: "Servicios" },
  { id: "diagnostico", label: "Diagnóstico" },
  { id: "proyectos", label: "Proyectos" },
  { id: "metodo", label: "Cómo trabajamos" },
  { id: "contacto", label: "Contacto" },
];

export function Footer() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      const el = root.current!;
      gsap.fromTo(
        el.querySelector(`.${s.mark}`),
        { yPercent: 38, clipPath: "inset(0 0 100% 0)" },
        {
          yPercent: 0,
          clipPath: "inset(0 0 0% 0)",
          ease: "none",
          scrollTrigger: { trigger: el, start: "top 85%", end: "bottom bottom", scrub: 0.6 },
        },
      );
      gsap.fromTo(
        el.querySelector(`.${s.star}`),
        { rotate: -90 },
        { rotate: 0, ease: "none", scrollTrigger: { trigger: el, start: "top bottom", end: "bottom bottom", scrub: 0.6 } },
      );
    },
    { scope: root },
  );

  return (
    <footer ref={root} className={s.footer}>
      <div className={`wrap ${s.top}`}>
        <div className={s.about}>
          <Star className={s.star} />
          <p>
            <em>Crescit</em>, del latín: «crece». Hacemos software para que las empresas crezcan sin que su forma de
            trabajar se quede atrás.
          </p>
        </div>

        <nav className={s.nav} aria-label="Pie de página">
          <ul>
            {LINKS.map((l) => (
              <li key={l.id}>
                <a
                  className="link"
                  href={`#${l.id}`}
                  onClick={(e) => {
                    e.preventDefault();
                    scrollToId(l.id);
                    history.replaceState(null, "", `#${l.id}`);
                  }}
                >
                  <RollText>{l.label}</RollText>
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className={s.side}>
          {site.contact.email ? (
            <a className="link" href={`mailto:${site.contact.email}`}>
              {site.contact.email}
            </a>
          ) : null}
          <button type="button" className={`link ${s.up}`} onClick={() => scrollToId("inicio")}>
            <RollText>Volver arriba</RollText>
          </button>
        </div>
      </div>

      <div className={`wrap ${s.markWrap}`} aria-hidden="true">
        <Wordmark className={s.mark} />
      </div>

      <div className={`wrap ${s.base}`}>
        <p>© 2026 Crescit. Estudio de software a medida en España.</p>
      </div>
    </footer>
  );
}
