"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { computeResult, flowFor, SOLUTIONS, type Answers, type Question } from "./engine";
import { contactStore, goToContact } from "@/lib/contact-store";
import { whatsappLink } from "@/lib/site";
import { Button, LinkButton, ArrowRight } from "../ui/Button";
import { Star } from "../ui/brand";
import s from "./Diagnosis.module.css";

const PHASES = ["Tu situación", "Tu día a día", "Tu objetivo", "Tu diagnóstico"];
const KEYS = "ABCDEFGHIJ";

export function Diagnosis() {
  const [answers, setAnswers] = useState<Answers>({});
  const [index, setIndex] = useState(0);
  const [done, setDone] = useState(false);
  const [leaving, setLeaving] = useState(false);
  const [dir, setDir] = useState<1 | -1>(1);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const resultRef = useRef<HTMLHeadingElement>(null);
  const consoleRef = useRef<HTMLDivElement>(null);
  const advanceTimer = useRef<number | null>(null);
  const interacted = useRef(false);

  const flow = useMemo(() => flowFor(answers), [answers]);
  const q: Question = flow[Math.min(index, flow.length - 1)];
  const selected = answers[q.id] ?? [];
  const result = useMemo(() => (done ? computeResult(answers) : null), [done, answers]);
  const phase = done ? 3 : q.phase;

  const transition = useCallback((fn: () => void, direction: 1 | -1) => {
    setDir(direction);
    setLeaving(true);
    window.setTimeout(() => {
      fn();
      setLeaving(false);
    }, 170);
  }, []);

  // Al cambiar de pregunta, el foco va al enunciado (lectores de pantalla y teclado).
  useEffect(() => {
    if (!interacted.current) return;
    if (done) resultRef.current?.focus({ preventScroll: true });
    else headingRef.current?.focus({ preventScroll: true });
  }, [index, done]);

  useEffect(() => () => {
    if (advanceTimer.current) window.clearTimeout(advanceTimer.current);
  }, []);

  const next = useCallback(() => {
    interacted.current = true;
    if (!(answers[q.id]?.length)) return;
    if (index >= flow.length - 1) {
      transition(() => setDone(true), 1);
    } else {
      transition(() => setIndex((i) => i + 1), 1);
    }
  }, [answers, flow.length, index, q.id, transition]);

  const back = useCallback(() => {
    interacted.current = true;
    if (advanceTimer.current) window.clearTimeout(advanceTimer.current);
    if (done) {
      transition(() => setDone(false), -1);
      return;
    }
    if (index > 0) transition(() => setIndex((i) => i - 1), -1);
  }, [done, index, transition]);

  const restart = useCallback(() => {
    interacted.current = true;
    transition(() => {
      setAnswers({});
      setIndex(0);
      setDone(false);
    }, -1);
  }, [transition]);

  function choose(optId: string) {
    interacted.current = true;
    if (advanceTimer.current) window.clearTimeout(advanceTimer.current);
    if (q.multi) {
      const has = selected.includes(optId);
      let nextSel = has ? selected.filter((x) => x !== optId) : [...selected, optId];
      if (q.max && nextSel.length > q.max) nextSel = nextSel.slice(nextSel.length - q.max);
      setAnswers((a) => ({ ...a, [q.id]: nextSel }));
      return;
    }
    // Opción única: si cambia el problema de partida, se descartan las respuestas de la rama anterior.
    const nextAnswers =
      q.id === "problema" && answers.problema?.[0] !== optId ? { problema: [optId] } : { ...answers, [q.id]: [optId] };
    setAnswers(nextAnswers);
    const isLast = index >= flowFor(nextAnswers).length - 1;
    const at = index;
    advanceTimer.current = window.setTimeout(() => {
      advanceTimer.current = null;
      transition(() => (isLast ? setDone(true) : setIndex(at + 1)), 1);
    }, 420);
  }

  // Atajos de teclado: letras para elegir, Intro para continuar.
  function onKeyDown(e: React.KeyboardEvent) {
    if (done || e.metaKey || e.ctrlKey || e.altKey) return;
    const tag = (e.target as HTMLElement).tagName;
    if (tag === "TEXTAREA" || (tag === "INPUT" && (e.target as HTMLInputElement).type === "text")) return;
    const k = e.key.toUpperCase();
    const idx = KEYS.indexOf(k);
    if (k.length === 1 && idx >= 0 && idx < q.options.length) {
      e.preventDefault();
      choose(q.options[idx].id);
      const input = consoleRef.current?.querySelector<HTMLInputElement>(`input[value="${q.options[idx].id}"]`);
      input?.focus({ preventScroll: true });
    } else if (e.key === "Enter" && q.multi && selected.length) {
      e.preventDefault();
      next();
    }
  }

  function sendToCrescit() {
    if (!result) return;
    contactStore.setDiagnosis({ title: result.title, summary: result.summary }, result.topic);
    goToContact(result.topic);
  }

  const notes = flow
    .slice(0, done ? flow.length : index + 1)
    .filter((qq) => answers[qq.id]?.length)
    .map((qq) => ({
      id: qq.id,
      label: qq.short,
      value: answers[qq.id].map((id) => qq.options.find((o) => o.id === id)?.label ?? "").join(" · "),
    }));

  const progress = done ? 1 : index / flow.length;
  const wa = result ? whatsappLink(`Hola, Crescit. He hecho el diagnóstico en vuestra web.\n\n${result.summary}`) : null;

  return (
    <section id="diagnostico" className={s.diag} aria-labelledby="diag-title">
      <div className={`wrap ${s.head}`}>
        <h2 id="diag-title" className="h2">
          Descubre qué necesita tu negocio.
        </h2>
        <p className="lead">
          Unas pocas preguntas sobre tu día a día. Al final te decimos qué solución tiene sentido para ti y por qué.
          Sin pedirte ningún dato.
        </p>
      </div>

      <div className="wrap">
        <div ref={consoleRef} className={s.console} data-done={done} onKeyDown={onKeyDown}>
          <div className={s.top}>
            <ol className={s.phases} aria-label="Progreso del diagnóstico">
              {PHASES.map((p, i) => (
                <li key={p} data-state={i < phase ? "done" : i === phase ? "current" : "todo"} aria-current={i === phase ? "step" : undefined}>
                  <span className={s.phaseDot} aria-hidden="true" />
                  {p}
                </li>
              ))}
            </ol>
            <div className={s.bar} aria-hidden="true">
              <i style={{ transform: `scaleX(${progress})` }} />
            </div>
          </div>

          {!done ? (
            <div className={s.body}>
              <div
                key={q.id}
                role={q.multi ? "group" : "radiogroup"}
                className={s.stage}
                data-leaving={leaving}
                data-dir={dir}
                aria-labelledby={`q-${q.id}`}
                aria-describedby={q.hint ? `hint-${q.id}` : undefined}
              >
                <p className={s.count} aria-live="polite">
                  {/* El total depende de la primera respuesta: no se muestra hasta conocerlo. */}
                  {answers.problema?.length ? `Pregunta ${index + 1} de ${flow.length}` : "Pregunta 1"}
                </p>
                <h3 id={`q-${q.id}`} ref={headingRef} tabIndex={-1} className={s.question}>
                  {q.title}
                </h3>
                {q.hint ? (
                  <p id={`hint-${q.id}`} className={s.hint}>
                    {q.hint}
                  </p>
                ) : null}
                <div className={s.options} data-cols={q.options.length > 5 ? 2 : 1}>
                  {q.options.map((o, i) => {
                    const checked = selected.includes(o.id);
                    return (
                      <label key={o.id} className={s.opt} data-checked={checked} style={{ "--i": i } as React.CSSProperties}>
                        <input
                          type={q.multi ? "checkbox" : "radio"}
                          name={q.id}
                          value={o.id}
                          checked={checked}
                          onChange={() => choose(o.id)}
                          className="sr-only"
                        />
                        <span className={s.key} aria-hidden="true">
                          {KEYS[i]}
                        </span>
                        <span className={s.optText}>{o.label}</span>
                        <span className={s.mark} aria-hidden="true">
                          <Star />
                        </span>
                      </label>
                    );
                  })}
                </div>
              </div>

              <aside className={s.notes} aria-label="Lo que vamos entendiendo">
                <p className={s.notesTitle}>Lo que vamos entendiendo</p>
                {notes.length === 0 ? (
                  <p className={s.notesEmpty}>Tus respuestas aparecerán aquí, ordenadas como las leería nuestro equipo.</p>
                ) : (
                  <ul>
                    {notes.map((n) => (
                      <li key={n.id + n.value}>
                        <span>{n.label}</span>
                        {n.value}
                      </li>
                    ))}
                  </ul>
                )}
              </aside>
            </div>
          ) : result ? (
            <div className={s.result} data-leaving={leaving}>
              <div className={s.resultHead}>
                <Star className={s.resultStar} />
                <p className={s.count}>Tu diagnóstico</p>
                <h3 ref={resultRef} tabIndex={-1} className={s.headline}>
                  {result.headline}
                </h3>
              </div>

              <div className={s.reco}>
                <p className={s.blockLabel}>Lo que te recomendamos</p>
                <p className={s.recoName}>{result.title}</p>
                <p className={s.recoText}>{SOLUTIONS[result.primary].description}</p>
                {result.secondary ? <p className={s.recoText}>{SOLUTIONS[result.secondary].description}</p> : null}
              </div>

              <div className={s.grid}>
                <div className={s.block} style={{ "--i": 0 } as React.CSSProperties}>
                  <h4 className={s.blockLabel}>Lo que hemos visto</h4>
                  <ul className={s.list}>
                    {result.findings.map((f) => (
                      <li key={f}>{f}</li>
                    ))}
                  </ul>
                </div>
                <div className={s.block} style={{ "--i": 1 } as React.CSSProperties}>
                  <h4 className={s.blockLabel}>Por qué tiene sentido</h4>
                  <ul className={s.list}>
                    {result.reasons.map((f) => (
                      <li key={f}>{f}</li>
                    ))}
                  </ul>
                </div>
                <div className={s.block} style={{ "--i": 2 } as React.CSSProperties}>
                  <h4 className={s.blockLabel}>Qué podría incluir</h4>
                  <ul className={`${s.list} ${s.features}`}>
                    {result.features.map((f) => (
                      <li key={f}>{f}</li>
                    ))}
                  </ul>
                </div>
                <div className={s.block} style={{ "--i": 3 } as React.CSSProperties}>
                  <h4 className={s.blockLabel}>Para llevarlo más lejos</h4>
                  <ul className={s.complements}>
                    {result.complements.map((c) => (
                      <li key={c}>
                        <strong>{SOLUTIONS[c].name}</strong>
                        <span>{SOLUTIONS[c].description}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className={s.resultCta}>
                <Button onClick={sendToCrescit} icon={<ArrowRight />}>
                  Enviar mi diagnóstico a Crescit
                </Button>
                {wa ? (
                  <LinkButton href={wa} target="_blank" rel="noopener noreferrer" variant="ghost">
                    Enviarlo por WhatsApp
                  </LinkButton>
                ) : null}
                <p className={s.ctaNote}>Lo leeremos antes de hablar contigo, así la primera conversación ya parte de tu caso.</p>
              </div>
            </div>
          ) : null}

          <div className={s.controls}>
            <button type="button" className={s.back} onClick={back} disabled={!done && index === 0}>
              <ArrowRight className={s.backIcon} />
              Atrás
            </button>
            {done ? (
              <button type="button" className={s.back} onClick={restart}>
                Repetir el diagnóstico
              </button>
            ) : q.multi ? (
              <Button onClick={next} disabled={!selected.length} icon={<ArrowRight />}>
                {index >= flow.length - 1 ? "Ver mi diagnóstico" : "Continuar"}
              </Button>
            ) : (
              <p className={s.tip}>
                Pulsa una opción o usa las teclas <kbd>A</kbd>–<kbd>{KEYS[q.options.length - 1]}</kbd>
              </p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
