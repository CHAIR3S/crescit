"use client";

import { useRef } from "react";
import { gsap, useGSAP, prefersReducedMotion } from "@/lib/gsap";
import { goToContact } from "@/lib/contact-store";
import { Button, ArrowRight } from "../ui/Button";
import s from "./WebService.module.css";

const OUTCOMES = [
  "Que se entienda en cinco segundos qué ofreces y para quién.",
  "Que cada visita sepa qué hacer después: escribirte, reservar o comprar.",
  "Que tu empresa se vea como lo que es, también desde el móvil.",
];

export function WebService() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const q = gsap.utils.selector(root);
      if (prefersReducedMotion()) {
        gsap.set(q(`.${s.after}`), { clipPath: "inset(0% 0 0 0)" });
        return;
      }
      const mm = gsap.matchMedia();
      const build = (trigger: Element, start: string, end: string) => {
        const tl = gsap.timeline({
          defaults: { ease: "none" },
          scrollTrigger: { trigger, start, end, scrub: 0.6 },
        });
        tl.fromTo(q(`.${s.after}`), { clipPath: "inset(0% 0 100% 0)" }, { clipPath: "inset(0% 0 0% 0)", duration: 1 }, 0);
        tl.fromTo(q(`.${s.scan}`), { top: "0%", opacity: 1 }, { top: "100%", duration: 1 }, 0);
        tl.to(q(`.${s.scan}`), { opacity: 0, duration: 0.05 }, 0.97);
        tl.fromTo(q(`.${s.before}`), { scale: 1, filter: "saturate(1)" }, { scale: 0.96, filter: "saturate(0)", duration: 1 }, 0);
        tl.fromTo(q(`.${s.aHead} .wi`), { yPercent: 110 }, { yPercent: 0, stagger: 0.025, duration: 0.25, ease: "power2.out" }, 0.12);
        tl.fromTo(q(`[data-rise]`), { y: 30, opacity: 0 }, { y: 0, opacity: 1, stagger: 0.06, duration: 0.25, ease: "power2.out" }, 0.3);
        tl.fromTo(q(`.${s.orb}`), { scale: 0.6, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.5, ease: "power2.out" }, 0.2);
        tl.fromTo(q(`.${s.outcome}`), { opacity: 0.25 }, { opacity: 1, stagger: 0.22, duration: 0.18 }, 0.12);
        tl.to({}, { duration: 0.18 });
        return tl;
      };
      mm.add("(min-width: 900px)", () => {
        build(root.current!.querySelector(`.${s.pin}`)!, "top top", "bottom bottom");
      });
      mm.add("(max-width: 899px)", () => {
        build(root.current!.querySelector(`.${s.frameZone}`)!, "top 25%", "bottom bottom");
      });
    },
    { scope: root },
  );

  return (
    <section ref={root} id="servicios" className={s.web} aria-labelledby="web-title">
      <div className={s.pin}>
        <div className={`wrap ${s.sticky}`}>
          <div className={s.copy}>
            <p className={s.tag}>Landing pages y webs</p>
            <h2 id="web-title" className="h2">
              Una web que haga por tu marca lo que tú haces en persona.
            </h2>
            <ul className={s.outcomes}>
              {OUTCOMES.map((o) => (
                <li key={o} className={s.outcome}>
                  {o}
                </li>
              ))}
            </ul>
            <p className={s.scope}>Landing pages, webs de empresa y rediseños, con animación y diseño propios.</p>
            <Button variant="ghost" onClick={() => goToContact("web")} icon={<ArrowRight />}>
              Quiero mejorar mi web
            </Button>
          </div>

          <div className={s.frameZone}>
            <div className={s.frame} aria-label="Ejemplo de una web genérica transformándose en una web de marca" role="img">
              <div className={s.chrome} aria-hidden="true">
                <span className={s.lock} />
                <span>Tu web</span>
              </div>
              <div className={s.screen} aria-hidden="true">
                {/* Antes: la plantilla de siempre */}
                <div className={s.before}>
                  <div className={s.bNav}>
                    <span className={s.bLogo}>LOGO</span>
                    <span>Inicio</span>
                    <span>Quiénes somos</span>
                    <span>Servicios</span>
                    <span>Contacto</span>
                  </div>
                  <div className={s.bHero}>
                    <div className={s.bImg}>
                      <svg viewBox="0 0 48 32" aria-hidden="true">
                        <path d="M2 30 16 12l9 11 6-7 15 14Z" fill="#bdbdbd" />
                        <circle cx="35" cy="8" r="4" fill="#c9c9c9" />
                      </svg>
                    </div>
                    <p className={s.bTitle}>Bienvenidos a nuestra página web</p>
                    <p className={s.bText}>
                      Somos una empresa líder en el sector con años de experiencia ofreciendo soluciones de calidad a
                      nuestros clientes.
                    </p>
                    <span className={s.bBtn}>Leer más</span>
                    <span className={s.bDots}>
                      <i />
                      <i />
                      <i />
                    </span>
                  </div>
                </div>

                {/* Después: la misma empresa, contada con intención */}
                <div className={s.after}>
                  <div className={s.orb} />
                  <div className={s.aNav}>
                    <span className={s.aLogo}>
                      <i />
                      Tu marca
                    </span>
                    <span className={s.aLinks}>
                      <span>Qué hacemos</span>
                      <span>Trabajos</span>
                    </span>
                    <span className={s.aCta}>Pide presupuesto</span>
                  </div>
                  <div className={s.aBody}>
                    <p className={s.aKicker} data-rise>
                      Lo que haces, explicado en una frase
                    </p>
                    <p className={s.aHead}>
                      {"Tu empresa, tal y como es en persona.".split(" ").map((w, i) => (
                        <span className="w" key={i}>
                          <span className="wi">{w}&nbsp;</span>
                        </span>
                      ))}
                    </p>
                    <div className={s.aRow} data-rise>
                      <span className={s.aBtn}>Pide tu presupuesto</span>
                      <span className={s.aGhost}>Ver trabajos</span>
                    </div>
                    <div className={s.aTiles}>
                      <span data-rise />
                      <span data-rise />
                      <span data-rise />
                    </div>
                  </div>
                </div>
                <div className={s.scan} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
