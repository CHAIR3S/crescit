"use client";

import { useEffect, useId, useRef, useState } from "react";
import { contactStore, topicLabels, useContactState, type Topic } from "@/lib/contact-store";
import { site, whatsappLink } from "@/lib/site";
import { Button, LinkButton, ArrowRight, ArrowUpRight } from "./ui/Button";
import { Star } from "./ui/brand";
import s from "./Contact.module.css";

type Status = { kind: "idle" } | { kind: "sending" } | { kind: "sent"; email: string } | { kind: "error"; code: string };
type Errors = Partial<Record<"name" | "email" | "message" | "consent", string>>;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export function Contact() {
  const { topic: storeTopic, diagnosis, nonce } = useContactState();
  const [topic, setTopic] = useState<Topic | "">("");
  const [attach, setAttach] = useState(true);
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState<Status>({ kind: "idle" });
  const formRef = useRef<HTMLFormElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const id = useId();

  // Cuando otra sección pide abrir el contacto se preselecciona su tema;
  // cuando llega un diagnóstico nuevo, se marca para adjuntarlo.
  const [seenNonce, setSeenNonce] = useState(nonce);
  if (nonce !== seenNonce) {
    setSeenNonce(nonce);
    if (storeTopic) setTopic(storeTopic);
  }
  const [seenDiagnosis, setSeenDiagnosis] = useState(diagnosis);
  if (diagnosis !== seenDiagnosis) {
    setSeenDiagnosis(diagnosis);
    if (diagnosis) setAttach(true);
  }

  // Destello del contorno del formulario al llegar desde otra sección.
  useEffect(() => {
    const el = panelRef.current;
    if (!nonce || !el) return;
    el.classList.remove(s.flash);
    void el.offsetWidth;
    el.classList.add(s.flash);
  }, [nonce]);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (status.kind === "sending") return;
    const fd = new FormData(e.currentTarget);
    const data = {
      name: String(fd.get("name") ?? "").trim(),
      email: String(fd.get("email") ?? "").trim(),
      company: String(fd.get("company") ?? "").trim(),
      phone: String(fd.get("phone") ?? "").trim(),
      topic: topic || null,
      message: String(fd.get("message") ?? "").trim(),
      consent: fd.get("consent") === "on",
      website: String(fd.get("website") ?? ""),
      diagnosis: diagnosis && attach ? diagnosis.summary : "",
    };

    const errs: Errors = {};
    if (data.name.length < 2) errs.name = "Escribe tu nombre.";
    if (!EMAIL_RE.test(data.email)) errs.email = "Revisa el correo: parece incompleto.";
    if (data.message.length < 10) errs.message = "Cuéntanos un poco más (al menos 10 caracteres).";
    if (!data.consent) errs.consent = "Necesitamos tu permiso para responderte.";
    setErrors(errs);
    if (Object.keys(errs).length) {
      const first = Object.keys(errs)[0];
      formRef.current?.querySelector<HTMLElement>(`[name="${first}"]`)?.focus();
      return;
    }

    setStatus({ kind: "sending" });
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const json = (await res.json().catch(() => ({}))) as { ok?: boolean; code?: string; errors?: Errors };
      if (res.ok && json.ok) {
        setStatus({ kind: "sent", email: data.email });
        formRef.current?.reset();
        contactStore.clearDiagnosis();
        return;
      }
      if (json.errors) setErrors(json.errors);
      setStatus({ kind: "error", code: json.code ?? "send_failed" });
    } catch {
      setStatus({ kind: "error", code: "network" });
    }
  }

  const wa = whatsappLink("Hola, Crescit. Me gustaría contaros lo que necesito para mi negocio.");
  const errorText =
    status.kind === "error"
      ? status.code === "not_configured"
        ? "El formulario todavía no está conectado a un buzón, así que tu mensaje no se ha enviado."
        : status.code === "rate_limited"
          ? "Has enviado varios mensajes seguidos. Espera unos minutos y vuelve a intentarlo."
          : status.code === "invalid"
            ? "Revisa los campos marcados."
            : "No hemos podido enviar el mensaje. Comprueba tu conexión y vuelve a intentarlo."
      : "";

  const field = (name: keyof Errors) => ({
    "aria-invalid": errors[name] ? true : undefined,
    "aria-describedby": errors[name] ? `${id}-${name}-err` : undefined,
  });

  return (
    <section id="contacto" className={s.contact} aria-labelledby="contact-title">
      <div className={s.field} aria-hidden="true">
        <span className={s.g1} />
        <span className={s.g2} />
        <span className={s.g3} />
        <div className="grain" />
      </div>

      <div className={`wrap ${s.grid}`}>
        <div className={s.copy}>
          <h2 id="contact-title" className={`display ${s.title}`}>
            Cuéntanos qué quieres resolver.
          </h2>
          <p className="lead">
            Escríbelo con tus palabras. No hace falta que sepas qué solución necesitas: para eso está la primera
            conversación.
          </p>
          {(site.contact.email || wa) && (
            <div className={s.channels}>
              {wa ? (
                <LinkButton href={wa} target="_blank" rel="noopener noreferrer" variant="ghost" icon={<ArrowUpRight />}>
                  Escríbenos por WhatsApp
                </LinkButton>
              ) : null}
              {site.contact.email ? (
                <a className="link" href={`mailto:${site.contact.email}`}>
                  {site.contact.email}
                </a>
              ) : null}
            </div>
          )}
        </div>

        <div ref={panelRef} className={s.panel}>
          {status.kind === "sent" ? (
            <div className={s.sent} role="status">
              <Star className={s.sentStar} />
              <p className={s.sentTitle}>Mensaje enviado.</p>
              <p className={s.sentText}>
                Lo hemos recibido. Te contestaremos a <strong>{status.email}</strong>.
              </p>
              <button type="button" className="link" onClick={() => setStatus({ kind: "idle" })}>
                Enviar otro mensaje
              </button>
            </div>
          ) : (
            <form ref={formRef} className={s.form} onSubmit={onSubmit} noValidate>
              <div className={s.row}>
                <div className={s.f}>
                  <label htmlFor={`${id}-name`}>Nombre</label>
                  <input id={`${id}-name`} name="name" autoComplete="name" required {...field("name")} />
                  {errors.name ? (
                    <p id={`${id}-name-err`} className={s.err}>
                      {errors.name}
                    </p>
                  ) : null}
                </div>
                <div className={s.f}>
                  <label htmlFor={`${id}-email`}>Correo electrónico</label>
                  <input id={`${id}-email`} name="email" type="email" autoComplete="email" required {...field("email")} />
                  {errors.email ? (
                    <p id={`${id}-email-err`} className={s.err}>
                      {errors.email}
                    </p>
                  ) : null}
                </div>
              </div>
              <div className={s.row}>
                <div className={s.f}>
                  <label htmlFor={`${id}-company`}>
                    Empresa <span>(opcional)</span>
                  </label>
                  <input id={`${id}-company`} name="company" autoComplete="organization" />
                </div>
                <div className={s.f}>
                  <label htmlFor={`${id}-phone`}>
                    Teléfono <span>(opcional)</span>
                  </label>
                  <input id={`${id}-phone`} name="phone" type="tel" autoComplete="tel" />
                </div>
              </div>

              <div className={s.f}>
                <label htmlFor={`${id}-topic`}>¿Sobre qué quieres hablar?</label>
                <div className={s.select}>
                  <select id={`${id}-topic`} name="topic" value={topic} onChange={(e) => setTopic(e.target.value as Topic | "")}>
                    <option value="">Elige una opción</option>
                    {(Object.keys(topicLabels) as Topic[]).map((t) => (
                      <option key={t} value={t}>
                        {topicLabels[t]}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {diagnosis ? (
                <div className={s.diag}>
                  <label className={s.check}>
                    <input type="checkbox" checked={attach} onChange={(e) => setAttach(e.target.checked)} />
                    <span className={s.box} aria-hidden="true" />
                    <span>
                      Adjuntar mi diagnóstico: <strong>{diagnosis.title}</strong>
                    </span>
                  </label>
                  <details className={s.details}>
                    <summary>Ver lo que se enviará</summary>
                    <pre>{diagnosis.summary}</pre>
                  </details>
                </div>
              ) : null}

              <div className={s.f}>
                <label htmlFor={`${id}-message`}>Qué te gustaría resolver</label>
                <textarea
                  id={`${id}-message`}
                  name="message"
                  rows={5}
                  required
                  placeholder="Por ejemplo: llevamos las citas por WhatsApp y se nos solapan…"
                  {...field("message")}
                />
                {errors.message ? (
                  <p id={`${id}-message-err`} className={s.err}>
                    {errors.message}
                  </p>
                ) : null}
              </div>

              <div className={s.hp} aria-hidden="true">
                <label htmlFor={`${id}-website`}>No rellenes este campo</label>
                <input id={`${id}-website`} name="website" tabIndex={-1} autoComplete="off" />
              </div>

              <div className={s.f}>
                <label className={s.check}>
                  <input type="checkbox" name="consent" {...field("consent")} />
                  <span className={s.box} aria-hidden="true" />
                  <span>Acepto que Crescit use estos datos para responder a mi consulta.</span>
                </label>
                {errors.consent ? (
                  <p id={`${id}-consent-err`} className={s.err}>
                    {errors.consent}
                  </p>
                ) : null}
                <p className={s.legal}>
                  Responsable: Crescit. Finalidad: responder a tu mensaje. Legitimación: tu consentimiento. No cedemos tus
                  datos a terceros salvo obligación legal. Puedes acceder a ellos, corregirlos o pedir que los borremos
                  respondiendo a cualquiera de nuestros correos.
                </p>
              </div>

              <div className={s.submit}>
                <Button type="submit" disabled={status.kind === "sending"} icon={<ArrowRight />}>
                  {status.kind === "sending" ? "Enviando…" : "Enviar mensaje"}
                </Button>
                {status.kind === "error" ? (
                  <p className={s.formError} role="alert">
                    {errorText}
                    {status.code === "not_configured" && site.contact.email ? (
                      <>
                        {" "}
                        Escríbenos a <a href={`mailto:${site.contact.email}`}>{site.contact.email}</a>.
                      </>
                    ) : null}
                  </p>
                ) : null}
              </div>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
