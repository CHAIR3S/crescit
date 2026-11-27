"use client";

import { useEffect, useRef, useState } from "react";
import { Logo } from "./ui/brand";
import { LinkButton, RollText } from "./ui/Button";
import s from "./Nav.module.css";

const LINKS = [
  { href: "#servicios", label: "Servicios" },
  { href: "#diagnostico", label: "Diagnóstico" },
  { href: "#proyectos", label: "Proyectos" },
  { href: "#metodo", label: "Cómo trabajamos" },
];

export function Nav() {
  const [open, setOpen] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [solid, setSolid] = useState(false);
  const last = useRef(0);
  const toggleRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      const dy = y - last.current;
      setSolid(y > window.innerHeight * 0.6);
      if (Math.abs(dy) > 6) setHidden(dy > 0 && y > 240);
      last.current = y;
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        toggleRef.current?.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    const lenis = (window as unknown as { __lenis?: { stop: () => void; start: () => void } }).__lenis;
    lenis?.stop();
    document.documentElement.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      lenis?.start();
      document.documentElement.style.overflow = "";
    };
  }, [open]);

  return (
    <header
      className={s.nav}
      data-hidden={hidden && !open ? "true" : "false"}
      data-solid={solid ? "true" : "false"}
      data-open={open ? "true" : "false"}
    >
      <div className={`wrap ${s.bar}`}>
        <a href="#inicio" className={s.brand} aria-label="Crescit, volver al inicio" onClick={() => setOpen(false)}>
          <Logo className={s.logo} starColor="var(--red)" wordColor="var(--bone)" title="Crescit" />
        </a>

        <nav aria-label="Principal" className={s.links}>
          <ul>
            {LINKS.map((l) => (
              <li key={l.href}>
                <a href={l.href} className={s.link}>
                  <RollText>{l.label}</RollText>
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className={s.actions}>
          <LinkButton href="#contacto" className={s.cta}>
            Cuéntanos tu caso
          </LinkButton>
          <button
            ref={toggleRef}
            type="button"
            className={s.toggle}
            aria-expanded={open}
            aria-controls="menu-movil"
            onClick={() => setOpen((v) => !v)}
          >
            <span className="sr-only">{open ? "Cerrar menú" : "Abrir menú"}</span>
            <span className={s.bars} aria-hidden="true">
              <i />
              <i />
            </span>
          </button>
        </div>
      </div>

      <div id="menu-movil" className={s.sheet} hidden={!open}>
        <nav aria-label="Menú móvil">
          <ul>
            {[...LINKS, { href: "#contacto", label: "Contacto" }].map((l, i) => (
              <li key={l.href} style={{ "--i": i } as React.CSSProperties}>
                <a href={l.href} onClick={() => setOpen(false)}>
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <LinkButton href="#diagnostico" className={s.sheetCta} onClick={() => setOpen(false)}>
          Descubre tu solución
        </LinkButton>
      </div>
    </header>
  );
}
