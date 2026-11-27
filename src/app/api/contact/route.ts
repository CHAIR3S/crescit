/**
 * Recepción del formulario de contacto.
 *
 * Envía el mensaje por correo a través de Resend (https://resend.com) cuando
 * están configuradas RESEND_API_KEY y CONTACT_TO_EMAIL. Si no lo están,
 * responde 503 con code "not_configured" y la interfaz lo dice con claridad:
 * nunca se muestra un "enviado" que no haya ocurrido.
 */

const TOPICS = ["web", "sistema", "automatizacion", "nose"] as const;
const TOPIC_LABEL: Record<(typeof TOPICS)[number], string> = {
  web: "Una web o landing page",
  sistema: "Un sistema a medida",
  automatizacion: "Automatización o inteligencia artificial",
  nose: "Todavía no lo tiene claro",
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

// Límite de envíos por IP (mejor esfuerzo; en serverless es por instancia).
const hits = new Map<string, number[]>();
function limited(ip: string) {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < 10 * 60_000);
  recent.push(now);
  hits.set(ip, recent);
  return recent.length > 5;
}

function str(v: unknown, max: number) {
  return typeof v === "string" ? v.trim().slice(0, max) : "";
}

export async function POST(request: Request) {
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return Response.json({ ok: false, code: "bad_request" }, { status: 400 });
  }

  // Campo trampa para bots: si viene relleno, se acepta en silencio y se descarta.
  if (str(body.website, 200)) return Response.json({ ok: true });

  const name = str(body.name, 120);
  const email = str(body.email, 200);
  const company = str(body.company, 120);
  const phone = str(body.phone, 40);
  const message = str(body.message, 5000);
  const diagnosis = str(body.diagnosis, 6000);
  const topic = TOPICS.includes(body.topic as (typeof TOPICS)[number]) ? (body.topic as (typeof TOPICS)[number]) : null;

  const errors: Record<string, string> = {};
  if (name.length < 2) errors.name = "Escribe tu nombre.";
  if (!EMAIL_RE.test(email)) errors.email = "Revisa el correo: parece incompleto.";
  if (message.length < 10) errors.message = "Cuéntanos un poco más (al menos 10 caracteres).";
  if (body.consent !== true) errors.consent = "Necesitamos tu permiso para responderte.";
  if (Object.keys(errors).length) return Response.json({ ok: false, code: "invalid", errors }, { status: 422 });

  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "local";
  if (limited(ip)) return Response.json({ ok: false, code: "rate_limited" }, { status: 429 });

  const key = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_TO_EMAIL;
  if (!key || !to) return Response.json({ ok: false, code: "not_configured" }, { status: 503 });
  const from = process.env.CONTACT_FROM_EMAIL || "Crescit <onboarding@resend.dev>";

  const head = [
    `Nombre: ${name}`,
    `Correo: ${email}`,
    company ? `Empresa: ${company}` : "",
    phone ? `Teléfono: ${phone}` : "",
    topic ? `Quiere hablar de: ${TOPIC_LABEL[topic]}` : "",
  ].filter(Boolean);
  const text = [head.join("\n"), `Mensaje:\n${message}`, diagnosis ? `---\n${diagnosis}` : ""]
    .filter(Boolean)
    .join("\n\n");

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from,
        to: [to],
        reply_to: email,
        subject: `Nuevo contacto desde la web: ${name}${company ? ` (${company})` : ""}`,
        text,
      }),
    });
    if (!res.ok) return Response.json({ ok: false, code: "send_failed" }, { status: 502 });
  } catch {
    return Response.json({ ok: false, code: "send_failed" }, { status: 502 });
  }

  return Response.json({ ok: true });
}
