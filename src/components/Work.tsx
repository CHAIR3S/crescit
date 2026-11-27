"use client";

import Image from "next/image";
import { useRef } from "react";
import { gsap, useGSAP, prefersReducedMotion } from "@/lib/gsap";
import { projects } from "@/lib/site";
import { ArrowUpRight } from "./ui/Button";
import aldecoStrip from "../../public/work/aldeco-strip.webp";
import aldecoMobile from "../../public/work/aldeco-mobile.webp";
import retroStrip from "../../public/work/retrosense-strip.webp";
import retroMobile from "../../public/work/retrosense-mobile.webp";
import s from "./Work.module.css";

const CASES = [
  {
    ...projects[0],
    strip: aldecoStrip,
    mobile: aldecoMobile,
    tone: "earth",
    line: "Presencia digital de Toño Aldeco, conductor de televisión y referente de la cultura ecuestre de México.",
    what: "Una web editorial que ordena su trayectoria en capítulos, presenta sus cuatro marcas y reúne contrataciones, alianzas y prensa en un formulario propio.",
    parts: ["Vídeo a pantalla completa", "Trayectoria por capítulos", "Marcas y galería", "Formulario de contrataciones"],
  },
  {
    ...projects[1],
    strip: retroStrip,
    mobile: retroMobile,
    tone: "steel",
    line: "Web de presentación de RetroSense, una propuesta de monitoreo de vibración y temperatura para maquinaria industrial existente.",
    what: "Explica un producto técnico a dueños de pequeñas fábricas: el problema, el dispositivo pieza a pieza en 3D y una demostración interactiva de cómo leería los datos.",
    parts: ["Despiece 3D del dispositivo", "Demostración interactiva", "Datos de contexto con fuentes", "Formulario de contacto"],
  },
] as const;

export function Work() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      const cases = gsap.utils.toArray<HTMLElement>(`.${s.case}`, root.current);
      cases.forEach((c, i) => {
        // La captura se desplaza dentro de la pantalla mientras el caso recorre el viewport
        const strip = c.querySelector<HTMLElement>(`.${s.strip}`);
        const screen = c.querySelector<HTMLElement>(`.${s.screen}`);
        if (strip && screen) {
          gsap.fromTo(
            strip,
            { y: 0 },
            {
              y: () => -(strip.offsetHeight - screen.offsetHeight),
              ease: "none",
              scrollTrigger: { trigger: c, start: "top 70%", end: "bottom top", scrub: 0.6, invalidateOnRefresh: true },
            },
          );
        }
        const phone = c.querySelector<HTMLElement>(`.${s.phone}`);
        if (phone) {
          gsap.fromTo(phone, { yPercent: 18 }, { yPercent: -8, ease: "none", scrollTrigger: { trigger: c, start: "top bottom", end: "bottom top", scrub: 0.6 } });
        }
        // El caso anterior retrocede cuando el siguiente lo cubre
        if (i < cases.length - 1) {
          gsap.to(c.querySelector(`.${s.inner}`), {
            scale: 0.93,
            opacity: 0.35,
            ease: "none",
            scrollTrigger: { trigger: cases[i + 1], start: "top bottom", end: "top top", scrub: true },
          });
        }
        // Revelado del nombre con máscara
        gsap.fromTo(
          c.querySelectorAll(`.${s.name} .wi`),
          { yPercent: 110 },
          { yPercent: 0, duration: 1.1, ease: "expo.out", stagger: 0.06, scrollTrigger: { trigger: c, start: "top 70%" } },
        );
      });
    },
    { scope: root },
  );

  return (
    <section ref={root} id="proyectos" className={s.work} aria-labelledby="work-title">
      <div className={`wrap ${s.head}`}>
        <h2 id="work-title" className="h2">
          Proyectos publicados y funcionando.
        </h2>
        <p className="lead">Cada uno parte de un negocio distinto, por eso ninguno se parece al anterior.</p>
      </div>

      <div className={s.cases}>
        {CASES.map((c, i) => (
          <article key={c.id} className={s.case} data-tone={c.tone} data-flip={i % 2 === 1} aria-labelledby={`case-${c.id}`}>
            <div className={`wrap ${s.inner}`}>
              <div className={s.copy}>
                <h3 id={`case-${c.id}`} className={s.name}>
                  <span className="w">
                    <span className="wi">{c.name}</span>
                  </span>
                </h3>
                <p className={s.line}>{c.line}</p>
                <p className={s.what}>{c.what}</p>
                <ul className={s.parts} aria-label="Qué incluye">
                  {c.parts.map((p) => (
                    <li key={p}>{p}</li>
                  ))}
                </ul>
                <a className={`link ${s.visit}`} href={c.url} target="_blank" rel="noopener noreferrer">
                  Visitar la web de {c.name}
                  <ArrowUpRight className={s.visitIcon} />
                  <span className="sr-only">(se abre en una pestaña nueva)</span>
                </a>
              </div>

              <div className={s.visual}>
                <a className={s.browser} href={c.url} target="_blank" rel="noopener noreferrer" tabIndex={-1} aria-hidden="true">
                  <span className={s.chrome}>
                    <span className={s.addr}>{c.host}</span>
                  </span>
                  <span className={s.screen}>
                    <Image
                      className={s.strip}
                      src={c.strip}
                      alt=""
                      sizes="(max-width: 900px) 100vw, 60vw"
                      placeholder="blur"
                    />
                  </span>
                  <span className={s.hoverLabel}>
                    Abrir {c.host}
                    <ArrowUpRight className={s.visitIcon} />
                  </span>
                </a>
                <div className={s.phone} aria-hidden="true">
                  <Image src={c.mobile} alt="" sizes="220px" placeholder="blur" />
                </div>
                <p className="sr-only">
                  Capturas de la web de {c.name} en ordenador y en móvil.
                </p>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
