"use client";

import { Fragment, useRef } from "react";
import { gsap, useGSAP, prefersReducedMotion } from "@/lib/gsap";
import { LinkButton } from "./ui/Button";
import s from "./Problem.module.css";

/** Fragmentos del texto: los marcados con `hot` se encienden en rojo al llegar a ellos. */
const PARTS: { t: string; hot?: boolean }[] = [
  { t: "Tienes un buen negocio. Pero" },
  { t: "los clientes no te encuentran,", hot: true },
  { t: "tu web no está a la altura", hot: true },
  { t: "de lo que haces y las tardes se te van entre" },
  { t: "Excel, WhatsApp", hot: true },
  { t: "y" },
  { t: "tareas que podría hacer una máquina.", hot: true },
];

export function Problem() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      const words = gsap.utils.toArray<HTMLElement>(`.${s.word}`, root.current);
      const hots = gsap.utils.toArray<HTMLElement>(`.${s.hot}`, root.current);
      gsap.set(words, { opacity: 0.14 });
      const tl = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: { trigger: root.current, start: "top top", end: "bottom bottom", scrub: 0.5 },
      });
      tl.to(words, { opacity: 1, stagger: 0.02, duration: 0.08 }, 0.04);
      hots.forEach((h) => {
        const firstWord = h.querySelector(`.${s.word}`);
        const idx = words.indexOf(firstWord as HTMLElement);
        tl.to(h, { "--hot": 1, duration: 0.12 }, 0.04 + idx * 0.02);
      });
      tl.fromTo(`.${s.foot}`, { autoAlpha: 0, y: 24 }, { autoAlpha: 1, y: 0, duration: 0.1, ease: "power2.out" }, ">-0.02");
      tl.to({}, { duration: 0.12 });
    },
    { scope: root },
  );

  return (
    <section ref={root} id="problema" className={s.problem} aria-labelledby="problema-title">
      <div className={s.sticky}>
        <div className={`wrap ${s.inner}`}>
          <h2 id="problema-title" className={s.label}>
            ¿Te suena?
          </h2>
          <p className={s.text}>
            {PARTS.map((part, i) => {
              const words = part.t.split(" ").map((w, j, arr) => (
                <Fragment key={j}>
                  <span className={s.word}>{w}</span>
                  {j < arr.length - 1 ? " " : null}
                </Fragment>
              ));
              return (
                <Fragment key={i}>
                  {part.hot ? <span className={s.hot}>{words}</span> : words}
                  {i < PARTS.length - 1 ? " " : null}
                </Fragment>
              );
            })}
          </p>
          <div className={s.foot}>
            <p className="lead">
              No es falta de esfuerzo: tus herramientas no están trabajando para ti. Y eso tiene arreglo.
            </p>
            <LinkButton href="#diagnostico">Vamos a ver qué te frena</LinkButton>
          </div>
        </div>
      </div>
    </section>
  );
}
