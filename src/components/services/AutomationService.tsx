"use client";

import { useEffect, useRef, useState } from "react";
import { gsap, ScrollTrigger, useGSAP, prefersReducedMotion } from "@/lib/gsap";
import { goToContact } from "@/lib/contact-store";
import { Button, ArrowRight } from "../ui/Button";
import s from "./AutomationService.module.css";

type Scenario = {
  id: string;
  label: string;
  msg: string;
  chips: string[];
  record: { title: string; rows: [string, string][] };
  action: { title: string; sub: string; badge: string };
  notify: string;
  reply: string;
};

const SCENARIOS: Scenario[] = [
  {
    id: "clinica",
    label: "Clínica: pedir cita",
    msg: "Hola, ¿tenéis hueco el jueves por la tarde para una limpieza?",
    chips: ["Quiere: pedir cita", "Servicio: limpieza dental", "Cuándo: jueves por la tarde"],
    record: { title: "Contacto nuevo", rows: [["Canal", "WhatsApp"], ["Interés", "Limpieza dental"], ["Estado", "Pendiente de cita"]] },
    action: { title: "Jueves, 17:30", sub: "Limpieza dental · Gabinete 2", badge: "Cita confirmada" },
    notify: "Nueva cita el jueves a las 17:30",
    reply: "¡Hecho! Te esperamos el jueves a las 17:30. Te lo recordaremos el día antes.",
  },
  {
    id: "tienda",
    label: "Tienda: dónde está mi pedido",
    msg: "Buenas, hice el pedido 4821 el lunes y aún no me ha llegado.",
    chips: ["Quiere: saber dónde está su pedido", "Pedido: 4821", "Tono: preocupado"],
    record: { title: "Pedido localizado", rows: [["Pedido", "4821"], ["Estado", "En reparto"], ["Entrega", "Mañana"]] },
    action: { title: "Seguimiento enviado", sub: "Enlace de la agencia de transporte", badge: "Consulta resuelta" },
    notify: "Pedido 4821: consulta resuelta sin intervención",
    reply: "Tu pedido 4821 ya está en reparto y te llega mañana. Aquí tienes el enlace para seguirlo.",
  },
  {
    id: "reformas",
    label: "Reformas: pedir presupuesto",
    msg: "Quiero presupuesto para reformar un baño de unos 6 m².",
    chips: ["Quiere: un presupuesto", "Obra: reforma de baño", "Tamaño: unos 6 m²"],
    record: { title: "Oportunidad creada", rows: [["Tipo", "Reforma de baño"], ["Superficie", "6 m²"], ["Fase", "Presupuesto"]] },
    action: { title: "Borrador de presupuesto", sub: "Calculado con tus tarifas", badge: "Listo para revisar" },
    notify: "Presupuesto de baño listo para revisar",
    reply: "Gracias. Te enviamos el presupuesto hoy mismo. ¿Te llamamos para concretar la visita?",
  },
];

const STEPS = ["Llega un mensaje", "La IA lo entiende", "Lo registra", "Actúa", "Te avisa y responde"];

export function AutomationService() {
  const root = useRef<HTMLElement>(null);
  const [scenario, setScenario] = useState(0);
  const [paused, setPaused] = useState(false);
  const [reduced, setReduced] = useState(false);
  // En pantallas estrechas el flujo es vertical y avanza con el scroll en lugar de reproducirse solo.
  const [scrubbed, setScrubbed] = useState(false);
  const tlRef = useRef<gsap.core.Timeline | null>(null);
  const inView = useRef(false);
  const pausedRef = useRef(false);
  const sc = SCENARIOS[scenario];

  useEffect(() => {
    pausedRef.current = paused;
    const tl = tlRef.current;
    if (!tl) return;
    if (paused) tl.pause();
    else if (inView.current) tl.play();
  }, [paused]);

  useGSAP(
    () => {
      const el = root.current!;
      const q = gsap.utils.selector(el);
      const nodes = q(`.${s.node}`);
      const reduce = prefersReducedMotion();
      setReduced(reduce);
      const typed = q(`.${s.typed}`)[0] as HTMLElement;
      const full = sc.msg;

      const build = (vertical: boolean) => {
        const counter = { n: 0 };
        const loop = !reduce && !vertical;
        setScrubbed(vertical && !reduce);

        const tl = gsap.timeline({ paused: true, repeat: loop ? -1 : 0, repeatDelay: 2.4, defaults: { ease: "power3.out" } });
        tl.set(nodes, { "--on": 0 });
        tl.set(q(`.${s.pulse}`), { "--p": 0, opacity: 0 });
        tl.set(q(`[data-reveal]`), { autoAlpha: 0, y: 10 });
        tl.set(counter, { n: 0 });
        tl.call(() => {
          typed.textContent = "";
        });

        // 1. Llega el mensaje
        tl.to(nodes[0], { "--on": 1, duration: 0.3 }, 0.2);
        tl.to(q(`.${s.bubbleIn}`), { autoAlpha: 1, y: 0, duration: 0.4 }, 0.25);
        tl.to(counter, {
          n: full.length,
          duration: Math.min(1.8, full.length * 0.028),
          ease: "none",
          onUpdate: () => {
            typed.textContent = full.slice(0, Math.round(counter.n));
          },
        }, 0.45);

        let t = 0.45 + Math.min(1.8, full.length * 0.028) + 0.2;
        for (let i = 0; i < 4; i++) {
          const pulse = q(`.${s.pulse}`)[i];
          tl.to(pulse, { opacity: 1, duration: 0.1 }, t);
          tl.to(pulse, { "--p": 1, duration: 0.55, ease: "power2.inOut" }, t);
          tl.to(pulse, { opacity: 0, duration: 0.15 }, t + 0.5);
          t += 0.5;
          tl.to(nodes[i + 1], { "--on": 1, duration: 0.3 }, t);
          tl.to(nodes[i + 1].querySelectorAll("[data-reveal]"), { autoAlpha: 1, y: 0, stagger: 0.14, duration: 0.45 }, t + 0.05);
          t += 0.35 + nodes[i + 1].querySelectorAll("[data-reveal]").length * 0.14;
        }
        tl.to({}, { duration: 0.2 }, t);
        tlRef.current = tl;

        if (reduce) {
          tl.progress(1);
          typed.textContent = full;
          return;
        }

        if (vertical) {
          const sst = ScrollTrigger.create({
            trigger: el.querySelector(`.${s.flow}`),
            start: "top 78%",
            end: "bottom 72%",
            scrub: 0.8,
            animation: tl,
          });
          return () => sst.kill();
        }

        const st = ScrollTrigger.create({
          trigger: el.querySelector(`.${s.flow}`),
          start: "top 80%",
          end: "bottom 10%",
          onToggle: (self) => {
            inView.current = self.isActive;
            if (self.isActive && !pausedRef.current) tl.play();
            else tl.pause();
          },
        });
        inView.current = st.isActive;
        if (st.isActive && !pausedRef.current) tl.play();
        return () => st.kill();
      };

      const mm = gsap.matchMedia();
      mm.add({ vertical: "(max-width: 1180px)", wide: "(min-width: 1181px)" }, (ctx) =>
        build(Boolean(ctx.conditions?.vertical)),
      );
    },
    { scope: root, dependencies: [scenario], revertOnUpdate: true },
  );

  return (
    <section ref={root} className={s.auto} aria-labelledby="auto-title">
      <div className={`wrap ${s.head}`}>
        <div>
          <p className={s.tag}>Automatizaciones e inteligencia artificial</p>
          <h2 id="auto-title" className="h2">
            Un cliente escribe. Tu negocio responde, aunque estés ocupado.
          </h2>
        </div>
        <div className={s.headSide}>
          <p className="lead">
            Conectamos la IA con tus herramientas para que entienda lo que te piden, lo apunte donde toca, haga la
            gestión y solo te moleste cuando hace falta una persona.
          </p>
          <Button variant="ghost" onClick={() => goToContact("automatizacion")} icon={<ArrowRight />}>
            Cuéntanos qué tareas repites
          </Button>
        </div>
      </div>

      <div className="wrap">
        <div className={s.controls}>
          <div className={s.scenarios} role="group" aria-label="Elige un ejemplo">
            {SCENARIOS.map((x, i) => (
              <button
                key={x.id}
                type="button"
                aria-pressed={scenario === i}
                className={s.scBtn}
                onClick={() => setScenario(i)}
              >
                {x.label}
              </button>
            ))}
          </div>
          {!reduced && !scrubbed ? (
            <button type="button" className={s.pause} onClick={() => setPaused((p) => !p)} aria-pressed={paused}>
              <span className={s.pauseIcon} data-paused={paused} aria-hidden="true" />
              {paused ? "Reanudar animación" : "Pausar animación"}
            </button>
          ) : null}
        </div>

        <ol className={s.flow} key={sc.id} aria-label={`Ejemplo: ${sc.label}`}>
          <li className={s.node}>
            <p className={s.nodeHead}>
              <span className={s.step}>1</span>
              {STEPS[0]}
            </p>
            <div className={s.nodeBody}>
              <div className={`${s.bubble} ${s.bubbleIn}`} data-reveal>
                <span className={s.channel}>WhatsApp</span>
                <span className={s.typed} aria-hidden="true" />
                <span className="sr-only">{sc.msg}</span>
              </div>
            </div>
            <span className={s.link} aria-hidden="true">
              <i className={s.pulse} />
            </span>
          </li>

          <li className={s.node}>
            <p className={s.nodeHead}>
              <span className={s.step}>2</span>
              {STEPS[1]}
            </p>
            <div className={s.nodeBody}>
              <ul className={s.chips}>
                {sc.chips.map((c) => (
                  <li key={c} data-reveal>
                    {c}
                  </li>
                ))}
              </ul>
            </div>
            <span className={s.link} aria-hidden="true">
              <i className={s.pulse} />
            </span>
          </li>

          <li className={s.node}>
            <p className={s.nodeHead}>
              <span className={s.step}>3</span>
              {STEPS[2]}
            </p>
            <div className={s.nodeBody}>
              <div className={s.record}>
                <p className={s.recordTitle} data-reveal>
                  {sc.record.title}
                </p>
                <dl>
                  {sc.record.rows.map(([k, v]) => (
                    <div key={k} data-reveal>
                      <dt>{k}</dt>
                      <dd>{v}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            </div>
            <span className={s.link} aria-hidden="true">
              <i className={s.pulse} />
            </span>
          </li>

          <li className={s.node}>
            <p className={s.nodeHead}>
              <span className={s.step}>4</span>
              {STEPS[3]}
            </p>
            <div className={s.nodeBody}>
              <div className={s.action} data-reveal>
                <p className={s.actionTitle}>{sc.action.title}</p>
                <p className={s.actionSub}>{sc.action.sub}</p>
              </div>
              <p className={s.badge} data-reveal>
                {sc.action.badge}
              </p>
            </div>
            <span className={s.link} aria-hidden="true">
              <i className={s.pulse} />
            </span>
          </li>

          <li className={s.node}>
            <p className={s.nodeHead}>
              <span className={s.step}>5</span>
              {STEPS[4]}
            </p>
            <div className={s.nodeBody}>
              <div className={s.notify} data-reveal>
                <span className={s.notifyDot} aria-hidden="true" />
                {sc.notify}
              </div>
              <div className={`${s.bubble} ${s.bubbleOut}`} data-reveal>
                {sc.reply}
              </div>
            </div>
          </li>
        </ol>
      </div>
    </section>
  );
}
