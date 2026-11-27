"use client";

import { useRef } from "react";
import { gsap, ScrollTrigger, useGSAP, prefersReducedMotion } from "@/lib/gsap";
import { FrameSequence } from "@/lib/frames";
import { SplitWords } from "./ui/SplitWords";
import { LinkButton, ArrowDown } from "./ui/Button";
import { Star } from "./ui/brand";
import s from "./Hero.module.css";

const SETS = {
  desktop: { dir: "/hero/d/", count: 310 },
  mobile: { dir: "/hero/m/", count: 186 },
} as const;

/** Desplazamiento horizontal del rostro (en fracción del ancho) en el primer capítulo. */
const OX_START = 0.16;

export function Hero() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const el = root.current!;
      const canvas = el.querySelector<HTMLCanvasElement>("canvas")!;
      const poster = el.querySelector<HTMLImageElement>(`.${s.poster}`)!;
      const ctx = canvas.getContext("2d", { alpha: true })!;
      const reduce = prefersReducedMotion();
      const isMobile = window.matchMedia("(max-width: 767px)").matches;
      const set = isMobile ? SETS.mobile : SETS.desktop;

      if (reduce) {
        el.dataset.static = "true";
        return;
      }

      const state = { frame: 0, ox: isMobile ? 0 : OX_START, scale: 1, drawn: -1 };
      let cw = 0;
      let ch = 0;
      let raf = 0;

      const seq = new FrameSequence(set.dir, set.count, (i) => {
        // Si llega un fotograma más cercano al solicitado, redibuja.
        if (Math.abs(i - state.frame) < Math.abs(state.drawn - state.frame) || state.drawn < 0) schedule();
      });

      function resize() {
        const dpr = Math.min(window.devicePixelRatio || 1, isMobile ? 2 : 1.5);
        cw = canvas.clientWidth;
        ch = canvas.clientHeight;
        canvas.width = Math.round(cw * dpr);
        canvas.height = Math.round(ch * dpr);
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        ctx.imageSmoothingQuality = "high";
        state.drawn = -1;
        draw();
      }

      function rectFor(img: HTMLImageElement) {
        const iw = img.naturalWidth;
        const ih = img.naturalHeight;
        let dw: number, dh: number, dx: number, dy: number;
        if (isMobile) {
          const side = Math.max(cw * 1.55, ch * 0.68) * state.scale;
          dw = side;
          dh = side * (ih / iw);
          dx = (cw - dw) / 2;
          dy = ch * 0.38 - dh * 0.42;
        } else {
          const k = Math.max(cw / iw, ch / ih) * state.scale;
          dw = iw * k;
          dh = ih * k;
          dx = (cw - dw) / 2 + state.ox * cw;
          dy = (ch - dh) / 2;
        }
        return { dx, dy, dw, dh };
      }

      function draw() {
        raf = 0;
        const img = seq.nearest(state.frame);
        if (!img) return;
        const { dx, dy, dw, dh } = rectFor(img);
        ctx.clearRect(0, 0, cw, ch);
        ctx.drawImage(img, dx, dy, dw, dh);
        state.drawn = seq.frames.indexOf(img);
        if (poster.style.opacity !== "0" && state.frame > 0.6) poster.style.opacity = "0";
      }

      function schedule() {
        if (!raf) raf = requestAnimationFrame(draw);
      }

      resize();
      seq.start();
      const ro = new ResizeObserver(resize);
      ro.observe(canvas);

      // --- Coreografía: una sola línea de tiempo ligada al scroll ---
      const q = gsap.utils.selector(el);
      const ch1Words = q(`.${s.ch1} .wi`);
      const ch1Rest = q(`.${s.ch1} [data-fade]`);
      const ch2Words = q(`.${s.ch2} .wi`);
      const ch2Rest = q(`.${s.ch2} [data-fade]`);
      const ch3Lines = q(`.${s.line}`);

      gsap.set(ch2Words, { yPercent: 112 });
      gsap.set(ch2Rest, { autoAlpha: 0, y: 24 });
      ch3Lines.forEach((line) => {
        gsap.set(line.querySelectorAll(".wi"), { yPercent: 112 });
        gsap.set(line.querySelectorAll("[data-fade]"), { autoAlpha: 0, y: 18 });
      });
      // Los capítulos 2 y 3 están ocultos por CSS hasta que GSAP ha fijado su estado inicial.
      el.dataset.anim = "on";

      const tl = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: {
          trigger: el,
          start: "top top",
          end: "bottom bottom",
          scrub: 0.7,
          invalidateOnRefresh: true,
        },
      });

      // Rostro y cámara
      tl.to(state, { frame: set.count - 1, duration: 0.88, onUpdate: schedule }, 0);
      if (!isMobile) {
        tl.to(state, { ox: 0.19, duration: 0.3, ease: "sine.inOut", onUpdate: schedule }, 0.1);
        tl.to(state, { ox: 0, duration: 0.16, ease: "power2.inOut", onUpdate: schedule }, 0.46);
      }
      tl.to(state, { scale: 1.12, duration: 0.2, ease: "power1.in", onUpdate: schedule }, 0.8);

      // Luz roja: crece con el relato
      tl.fromTo(q(`.${s.light}`), { opacity: 0.5 }, { opacity: 0.8, duration: 0.3 }, 0.1);
      tl.to(q(`.${s.light}`), { opacity: 1, duration: 0.2 }, 0.5);
      tl.to(q(`.${s.cue}`), { autoAlpha: 0, duration: 0.03 }, 0.005);

      // Capítulo 1 sale
      tl.to(ch1Words, { yPercent: -112, stagger: 0.0035, duration: 0.05, ease: "power2.in" }, 0.06);
      tl.to(ch1Rest, { autoAlpha: 0, y: -20, duration: 0.05, ease: "power2.in" }, 0.06);

      // Capítulo 2: el rostro gira de perfil y "mira" el mensaje
      tl.to(ch2Words, { yPercent: 0, stagger: 0.004, duration: 0.07, ease: "power3.out" }, 0.19);
      tl.to(ch2Rest, { autoAlpha: 1, y: 0, duration: 0.06, ease: "power3.out" }, 0.25);
      tl.to(ch2Words, { yPercent: -112, stagger: 0.003, duration: 0.05, ease: "power2.in" }, 0.42);
      tl.to(ch2Rest, { autoAlpha: 0, y: -20, duration: 0.05, ease: "power2.in" }, 0.42);

      // Capítulo 3: de espaldas, las partículas orbitan y aparecen las tres áreas
      ch3Lines.forEach((line, i) => {
        const at = 0.52 + i * 0.065;
        tl.to(line.querySelectorAll(".wi"), { yPercent: 0, stagger: 0.004, duration: 0.06, ease: "power3.out" }, at);
        tl.to(line.querySelectorAll("[data-fade]"), { autoAlpha: 1, y: 0, duration: 0.05, ease: "power3.out" }, at + 0.03);
      });
      tl.to(ch3Lines, { autoAlpha: 0, y: -30, stagger: 0.012, duration: 0.06, ease: "power2.in" }, 0.8);

      // Salida: el rostro se disuelve en la luz roja que da paso a la siguiente sección
      tl.to(q(`.${s.canvasWrap}`), { opacity: 0.18, duration: 0.12, ease: "power1.in" }, 0.86);
      tl.fromTo(q(`.${s.flood}`), { yPercent: 100, opacity: 0 }, { yPercent: 0, opacity: 1, duration: 0.14, ease: "power2.out" }, 0.84);
      tl.fromTo(q(`.${s.rail} i`), { scaleY: 0 }, { scaleY: 1, duration: 1 }, 0);
      tl.fromTo(q(`.${s.railStar}`), { top: "0%", rotate: 0 }, { top: "100%", rotate: 360, duration: 1 }, 0);

      // La luz ambiental solo se anima mientras el hero está en pantalla
      const lightTrigger = ScrollTrigger.create({
        trigger: el,
        start: "top bottom",
        end: "bottom top",
        onToggle: (self) => el.classList.toggle(s.paused, !self.isActive),
      });

      return () => {
        seq.destroy();
        ro.disconnect();
        lightTrigger.kill();
        if (raf) cancelAnimationFrame(raf);
      };
    },
    { scope: root },
  );

  return (
    <section ref={root} id="inicio" className={s.hero} aria-labelledby="hero-title">
      <div className={s.stage}>
        <div className={s.light} aria-hidden="true">
          <span className={s.l1} />
          <span className={s.l2} />
          <span className={s.l3} />
        </div>
        <div className={s.canvasWrap} aria-hidden="true">
          <picture>
            <source media="(max-width: 767px)" srcSet="/hero/poster-m.webp" />
            <img className={s.poster} src="/hero/poster-d.webp" alt="" fetchPriority="high" decoding="async" />
          </picture>
          <canvas className={s.canvas} />
        </div>
        <div className={s.shade} aria-hidden="true" />
        <div className={s.flood} aria-hidden="true">
          <div className="grain" />
        </div>

        <div className={`wrap ${s.layer}`}>
          <div className={`${s.ch} ${s.ch1}`}>
            <p className={s.kicker} data-fade>
              <Star className={s.kickerStar} />
              Estudio de software a medida en España
            </p>
            <h1 id="hero-title" className={`display ${s.title}`}>
              <SplitWords text="Software que empieza por entender tu negocio." />
            </h1>
            <p className={`lead ${s.lead}`} data-fade>
              Diseñamos webs, sistemas de gestión y automatizaciones con IA a partir de cómo trabaja tu empresa de
              verdad. Sin paquetes cerrados.
            </p>
            <div className={s.ctas} data-fade>
              <LinkButton href="#diagnostico">Descubre qué necesita tu negocio</LinkButton>
              <LinkButton href="#proyectos" variant="ghost">
                Ver proyectos
              </LinkButton>
            </div>
          </div>

          <div className={`${s.ch} ${s.ch2}`}>
            <p className={`display ${s.big}`}>
              <SplitWords text="Antes de escribir una línea de código, miramos cómo trabajas." />
            </p>
            <p className={`lead ${s.ch2Lead}`} data-fade>
              Dónde se te escapan clientes, qué tareas se repiten cada día, qué información vive en cinco sitios
              distintos. Ahí empieza cada proyecto.
            </p>
          </div>

          <div className={`${s.ch} ${s.ch3}`}>
            <div className={`${s.line} ${s.lineA}`}>
              <p className={`display ${s.lineTitle}`}>
                <SplitWords text="Webs que consiguen clientes." />
              </p>
              <p className={s.lineText} data-fade>
                Para que quien te busca entienda lo que vales y te escriba.
              </p>
            </div>
            <div className={`${s.line} ${s.lineB}`}>
              <p className={`display ${s.lineTitle}`}>
                <SplitWords text="Sistemas que ordenan tu empresa." />
              </p>
              <p className={s.lineText} data-fade>
                Inventario, clientes, citas y ventas en un mismo sitio.
              </p>
            </div>
            <div className={`${s.line} ${s.lineC}`}>
              <p className={`display ${s.lineTitle}`}>
                <SplitWords text="Automatizaciones que trabajan por ti." />
              </p>
              <p className={s.lineText} data-fade>
                Atención, avisos y tareas repetitivas que se resuelven solas.
              </p>
            </div>
          </div>
        </div>

        <div className={s.cue} aria-hidden="true">
          <span>Desliza para girar</span>
          <ArrowDown className={s.cueIcon} />
        </div>
        <div className={s.rail} aria-hidden="true">
          <i />
          <Star className={s.railStar} />
        </div>
      </div>
    </section>
  );
}
