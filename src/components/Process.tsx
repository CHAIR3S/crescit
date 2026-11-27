"use client";

import { useRef, useState } from "react";
import { gsap, ScrollTrigger, useGSAP, prefersReducedMotion } from "@/lib/gsap";
import { goToContact } from "@/lib/contact-store";
import { Button, ArrowRight } from "./ui/Button";
import { Star } from "./ui/brand";
import s from "./Process.module.css";

const STEPS = [
  {
    title: "Entendemos tu negocio",
    text: "Hablamos contigo y con quien haga falta de tu equipo. Vemos cómo vendes, cómo atiendes y cómo te organizas hoy, sin tecnicismos.",
    get: "Una foto clara de cómo funciona tu negocio ahora mismo.",
  },
  {
    title: "Detectamos sus oportunidades",
    text: "Señalamos dónde se te escapan clientes, tiempo o dinero, y qué merece la pena resolver primero.",
    get: "Un diagnóstico por escrito, con prioridades.",
  },
  {
    title: "Diseñamos la solución",
    text: "Definimos qué vamos a construir y cómo se verá antes de programar nada. Lo revisas y lo ajustamos contigo.",
    get: "Diseño y alcance cerrados, sin sorpresas a mitad de proyecto.",
  },
  {
    title: "Desarrollamos y probamos",
    text: "Construimos por fases y lo pruebas con casos reales de tu negocio antes de ponerlo en marcha.",
    get: "Avances que puedes ver y tocar en cada fase.",
  },
  {
    title: "Implementamos y evolucionamos",
    text: "Lo ponemos en marcha, enseñamos a tu equipo a usarlo y lo seguimos mejorando cuando tu negocio cambie.",
    get: "Una herramienta que crece al ritmo de tu empresa.",
  },
];

export function Process() {
  const root = useRef<HTMLElement>(null);
  const [active, setActive] = useState(0);

  useGSAP(
    () => {
      const el = root.current!;
      const list = el.querySelector(`.${s.list}`)!;
      const items = gsap.utils.toArray<HTMLElement>(`.${s.item}`, el);
      const reduce = prefersReducedMotion();

      items.forEach((item, i) => {
        ScrollTrigger.create({
          trigger: item,
          start: "top 58%",
          end: "bottom 58%",
          onToggle: (self) => {
            if (self.isActive) setActive(i);
          },
        });
      });

      if (reduce) return;
      const tl = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: { trigger: list, start: "top 58%", end: "bottom 58%", scrub: 0.5 },
      });
      tl.fromTo(el.querySelector(`.${s.fill}`), { scaleY: 0 }, { scaleY: 1, duration: 1 }, 0);
      tl.fromTo(el.querySelector(`.${s.marker}`), { top: "0%", rotate: 0 }, { top: "100%", rotate: 540, duration: 1 }, 0);
    },
    { scope: root },
  );

  return (
    <section ref={root} id="metodo" className={s.process} aria-labelledby="process-title">
      <div className={`wrap ${s.grid}`}>
        <div className={s.side}>
          <div className={s.sticky}>
            <h2 id="process-title" className="h2">
              Así trabajamos.
            </h2>
            <p className="lead">
              No vendemos soluciones de catálogo. Cada proyecto pasa por estos cinco pasos, y en cada uno sabes qué te
              llevas.
            </p>
            <p className={s.counter} aria-hidden="true">
              <span className={s.counterNum} key={active}>
                {String(active + 1).padStart(2, "0")}
              </span>
              <span className={s.counterOf}>/05</span>
            </p>
            <Button onClick={() => goToContact()} icon={<ArrowRight />}>
              Exploremos tu proyecto
            </Button>
          </div>
        </div>

        <div className={s.list}>
          <span className={s.rail} aria-hidden="true">
            <i className={s.fill} />
            <Star className={s.marker} />
          </span>
          <ol>
          {STEPS.map((step, i) => (
            <li key={step.title} className={s.item} data-active={i <= active}>
              <span className={s.num} aria-hidden="true">
                {String(i + 1).padStart(2, "0")}
              </span>
              <h3 className={s.title}>{step.title}</h3>
              <p className={s.text}>{step.text}</p>
              <p className={s.get}>
                <span>Te llevas</span>
                {step.get}
              </p>
            </li>
          ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
