"use client";

import { useEffect, useRef, useState } from "react";
import { gsap, useGSAP, prefersReducedMotion } from "@/lib/gsap";
import { goToContact } from "@/lib/contact-store";
import { Button, ArrowRight } from "../ui/Button";
import s from "./SystemsService.module.css";

type Product = { id: string; name: string; stock: number; min: number; price: number; status: "ok" | "low" | "ordered" };
type Slot = { time: string; who?: string; what?: string; fresh?: boolean };
type Client = { id: string; name: string; last: string; next: string; done: boolean };

const PRODUCTS: Product[] = [
  { id: "casco", name: "Casco urbano, talla M", stock: 5, min: 3, price: 49, status: "ok" },
  { id: "camara", name: "Cámara de 29 pulgadas", stock: 14, min: 5, price: 9, status: "ok" },
  { id: "luz", name: "Luz delantera USB", stock: 4, min: 3, price: 24, status: "ok" },
  { id: "candado", name: "Candado en U", stock: 9, min: 4, price: 35, status: "ok" },
];

const SLOTS: Slot[] = [
  { time: "09:00", who: "Javier R.", what: "Revisión completa" },
  { time: "10:00" },
  { time: "11:00", who: "Lucía P.", what: "Cambio de frenos" },
  { time: "12:00" },
  { time: "16:00", who: "Andrés M.", what: "Ajuste de cambios" },
  { time: "17:00" },
  { time: "18:00", who: "Marta G.", what: "Revisión completa" },
  { time: "19:00" },
];

const CLIENTS: Client[] = [
  { id: "marta", name: "Marta G.", last: "Hace 2 días", next: "Confirmar revisión del jueves", done: false },
  { id: "javier", name: "Javier R.", last: "Ayer", next: "Enviar presupuesto de ruedas", done: false },
  { id: "lucia", name: "Lucía P.", last: "Hoy", next: "Avisar cuando llegue su pedido", done: false },
  { id: "andres", name: "Andrés M.", last: "Hace 1 semana", next: "Ofrecer mantenimiento anual", done: true },
];

const TABS = [
  { id: "inventario", label: "Inventario" },
  { id: "citas", label: "Citas" },
  { id: "clientes", label: "Clientes" },
] as const;
type Tab = (typeof TABS)[number]["id"];

const euro = new Intl.NumberFormat("es-ES", { style: "currency", currency: "EUR", maximumFractionDigits: 0 });

function Num({ value }: { value: string | number }) {
  return (
    <span className={s.num} key={String(value)}>
      {value}
    </span>
  );
}

export function SystemsService() {
  const root = useRef<HTMLElement>(null);
  const tlRef = useRef<gsap.core.Timeline | null>(null);
  const [ordered, setOrdered] = useState(false);
  const [tab, setTab] = useState<Tab>("inventario");
  const [products, setProducts] = useState(PRODUCTS);
  const [slots, setSlots] = useState(SLOTS);
  const [clients, setClients] = useState(CLIENTS);
  const [sales, setSales] = useState(1284);
  const [toast, setToast] = useState<{ id: string; text: string; action?: boolean } | null>(null);
  const toastTimer = useRef<number | null>(null);

  const low = products.filter((p) => p.status === "low").length;
  const booked = slots.filter((x) => x.who).length;
  const pending = clients.filter((c) => !c.done).length;

  useEffect(() => () => {
    if (toastTimer.current) window.clearTimeout(toastTimer.current);
  }, []);

  function showToast(t: NonNullable<typeof toast>, ttl?: number) {
    if (toastTimer.current) window.clearTimeout(toastTimer.current);
    setToast(t);
    if (ttl) toastTimer.current = window.setTimeout(() => setToast(null), ttl);
  }

  function sell(id: string) {
    const p = products.find((x) => x.id === id);
    if (!p || p.stock <= 0) return;
    const stock = p.stock - 1;
    const becomesLow = stock <= p.min && p.status === "ok";
    setProducts((list) => list.map((x) => (x.id === id ? { ...x, stock, status: becomesLow ? "low" : x.status } : x)));
    setSales((v) => v + p.price);
    if (becomesLow) {
      showToast({ id, text: `Quedan ${stock} de «${p.name}». ¿Preparamos el pedido al proveedor?`, action: true });
    }
  }

  function order(id: string) {
    setProducts((list) => list.map((x) => (x.id === id ? { ...x, status: "ordered" } : x)));
    showToast({ id, text: "Pedido al proveedor preparado. Te avisaremos cuando llegue." }, 3200);
  }

  function book(i: number) {
    setSlots((list) => list.map((x, k) => (k === i ? { ...x, who: "Reserva online", what: "Revisión completa", fresh: true } : x)));
    showToast({ id: "cita", text: `Cita reservada a las ${slots[i].time}. El cliente ya tiene su confirmación.` }, 3200);
  }

  function toggleClient(id: string) {
    setClients((list) => list.map((c) => (c.id === id ? { ...c, done: !c.done } : c)));
  }

  // Coreografía: del desorden al panel
  useGSAP(
    () => {
      const stage = root.current!.querySelector<HTMLElement>(`.${s.stage}`)!;
      const app = stage.querySelector<HTMLElement>(`.${s.app}`)!;
      const frags = gsap.utils.toArray<HTMLElement>(`.${s.frag}`, stage);

      if (prefersReducedMotion()) {
        gsap.set(frags, { autoAlpha: 0 });
        gsap.set(app, { opacity: 1, filter: "none", scale: 1 });
        setOrdered(true);
        return;
      }

      const tl = gsap.timeline({ paused: true, onComplete: () => setOrdered(true), onReverseComplete: () => setOrdered(false) });
      frags.forEach((f, i) => {
        const target = stage.querySelector<HTMLElement>(f.dataset.target!);
        tl.to(
          f,
          {
            x: () => {
              if (!target) return 0;
              const a = f.getBoundingClientRect();
              const b = target.getBoundingClientRect();
              return b.left + b.width / 2 - (a.left + a.width / 2);
            },
            y: () => {
              if (!target) return 0;
              const a = f.getBoundingClientRect();
              const b = target.getBoundingClientRect();
              return b.top + b.height / 2 - (a.top + a.height / 2);
            },
            rotate: 0,
            scale: 0.35,
            duration: 0.9,
            ease: "power3.inOut",
          },
          i * 0.08,
        );
        tl.to(f, { autoAlpha: 0, filter: "blur(4px)", duration: 0.3, ease: "power1.in" }, i * 0.08 + 0.62);
      });
      tl.fromTo(app, { opacity: 0.22, filter: "blur(6px)", scale: 0.985 }, { opacity: 1, filter: "blur(0px)", scale: 1, duration: 0.9, ease: "power2.out" }, 0.45);
      tlRef.current = tl;

      gsap.timeline({
        scrollTrigger: { trigger: stage, start: "top 62%", once: true, onEnter: () => tl.play() },
      });
    },
    { scope: root },
  );

  function replay() {
    const tl = tlRef.current;
    if (!tl) return;
    if (ordered) tl.timeScale(1.4).reverse();
    else tl.timeScale(1).play();
  }

  return (
    <section ref={root} className={s.sys} aria-labelledby="sys-title">
      <div className={`wrap ${s.head}`}>
        <div>
          <p className={s.tag}>Sistemas a medida</p>
          <h2 id="sys-title" className="h2">
            Todo tu negocio en un solo sitio, y no en cinco.
          </h2>
        </div>
        <div className={s.headSide}>
          <p className="lead">
            Inventario, ventas, citas y clientes conectados entre sí. Cuando vendes, el stock se descuenta solo; cuando
            falta algo, el sistema te avisa antes de que te des cuenta.
          </p>
          <Button variant="ghost" onClick={() => goToContact("sistema")} icon={<ArrowRight />}>
            Hablemos de tu operación
          </Button>
        </div>
      </div>

      <div className="wrap">
        <div className={s.toolbar}>
          <p className={s.try}>Pruébalo: registra una venta, reserva una cita o marca un seguimiento.</p>
          <button type="button" className={s.replay} onClick={replay}>
            {ordered ? "Ver cómo estaba antes" : "Ordenarlo todo"}
          </button>
        </div>

        <div className={s.stage} data-ordered={ordered}>
          {/* Fragmentos del desorden: cada uno vuela a la parte del panel que lo sustituye */}
          <div className={`${s.frag} ${s.fExcel}`} data-target={`.${s.panel}`} aria-hidden="true">
            <span className={s.fFile}>stock_final_v3 (2).xlsx</span>
            <span className={s.fGrid}>
              <i>Casco M</i>
              <i>5</i>
              <i>¿?</i>
              <i>Luz USB</i>
              <i>4</i>
              <i>pedir</i>
            </span>
          </div>
          <div className={`${s.frag} ${s.fChat}`} data-target={`.${s.kpiClients}`} aria-hidden="true">
            ¿Me guardas el casco M para el sábado?
            <small>21:47</small>
          </div>
          <div className={`${s.frag} ${s.fNote}`} data-target={`.${s.kpiCitas}`} aria-hidden="true">
            Llamar a Marta: revisión frenos jueves (¿a qué hora?)
          </div>
          <div className={`${s.frag} ${s.fMail}`} data-target={`.${s.kpiSales}`} aria-hidden="true">
            <b>Re: Re: Fwd: ventas marzo</b>
            Te paso el Excel bueno, el otro tenía un error…
          </div>
          <div className={`${s.frag} ${s.fBook}`} data-target={`.${s.kpiLow}`} aria-hidden="true">
            Citas mañana: 10 h Javier, 12 h ???, 17 h
          </div>

          <div className={s.app} aria-label="Panel de gestión de demostración">
            <aside className={s.side} aria-hidden="true">
              <span className={s.appLogo}>TN</span>
              <span className={s.sideItem}>Resumen</span>
              <span className={s.sideItem} data-on="true">
                Gestión
              </span>
              <span className={s.sideItem}>Informes</span>
              <span className={s.sideItem}>Ajustes</span>
            </aside>

            <div className={s.main}>
              <div className={s.appTop}>
                <p className={s.appTitle}>Tu negocio</p>
                <p className={s.appDate}>Hoy</p>
              </div>

              <dl className={s.kpis}>
                <div className={s.kpiSales}>
                  <dt>Ventas de hoy</dt>
                  <dd>
                    <Num value={euro.format(sales)} />
                  </dd>
                </div>
                <div className={s.kpiCitas}>
                  <dt>Citas mañana</dt>
                  <dd>
                    <Num value={booked} />
                  </dd>
                </div>
                <div className={s.kpiLow} data-alert={low > 0}>
                  <dt>Stock bajo</dt>
                  <dd>
                    <Num value={low} />
                  </dd>
                </div>
                <div className={s.kpiClients}>
                  <dt>Seguimientos</dt>
                  <dd>
                    <Num value={pending} />
                  </dd>
                </div>
              </dl>

              <div className={s.tabs} role="tablist" aria-label="Secciones del panel">
                {TABS.map((t) => (
                  <button
                    key={t.id}
                    type="button"
                    role="tab"
                    id={`tab-${t.id}`}
                    aria-selected={tab === t.id}
                    aria-controls={`panel-${t.id}`}
                    tabIndex={tab === t.id ? 0 : -1}
                    className={s.tab}
                    onClick={() => setTab(t.id)}
                    onKeyDown={(e) => {
                      if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
                      const i = TABS.findIndex((x) => x.id === tab);
                      const n = TABS[(i + (e.key === "ArrowRight" ? 1 : TABS.length - 1)) % TABS.length].id;
                      setTab(n);
                      (e.currentTarget.parentElement?.querySelector(`#tab-${n}`) as HTMLButtonElement | null)?.focus();
                    }}
                  >
                    {t.label}
                  </button>
                ))}
                <span className={s.tabInk} style={{ "--x": TABS.findIndex((x) => x.id === tab) } as React.CSSProperties} />
              </div>

              <div className={s.panel} role="tabpanel" id={`panel-${tab}`} aria-labelledby={`tab-${tab}`} key={tab}>
                {tab === "inventario" ? (
                  <table className={s.table}>
                    <thead>
                      <tr>
                        <th scope="col">Producto</th>
                        <th scope="col">Stock</th>
                        <th scope="col">Estado</th>
                        <th scope="col">
                          <span className="sr-only">Acción</span>
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {products.map((p) => (
                        <tr key={p.id} data-status={p.status}>
                          <th scope="row">{p.name}</th>
                          <td>
                            <span className={s.stock}>
                              <Num value={p.stock} />
                              <i style={{ transform: `scaleX(${Math.min(1, p.stock / 15)})` }} />
                            </span>
                          </td>
                          <td>
                            <span className={s.pill} data-status={p.status}>
                              {p.status === "ok" ? "Correcto" : p.status === "low" ? "Stock bajo" : "Pedido en camino"}
                            </span>
                          </td>
                          <td className={s.actionCell}>
                            <button type="button" className={s.mini} onClick={() => sell(p.id)} disabled={p.stock <= 0}>
                              Registrar venta
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : tab === "citas" ? (
                  <ul className={s.slots}>
                    {slots.map((x, i) => (
                      <li key={x.time} data-free={!x.who} data-fresh={x.fresh ? "true" : undefined}>
                        <span className={s.slotTime}>{x.time}</span>
                        {x.who ? (
                          <span className={s.slotBody}>
                            <b>{x.what}</b>
                            {x.who}
                          </span>
                        ) : (
                          <button type="button" className={s.slotFree} onClick={() => book(i)}>
                            Libre · Reservar
                          </button>
                        )}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <ul className={s.clients}>
                    {clients.map((c) => (
                      <li key={c.id} data-done={c.done}>
                        <span className={s.avatar} aria-hidden="true">
                          {c.name.charAt(0)}
                        </span>
                        <span className={s.clientBody}>
                          <b>{c.name}</b>
                          <span>{c.next}</span>
                        </span>
                        <span className={s.clientLast}>{c.last}</span>
                        <button type="button" className={s.mini} onClick={() => toggleClient(c.id)} aria-pressed={c.done}>
                          {c.done ? "Hecho" : "Marcar hecho"}
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              <div className={s.toastZone} aria-live="polite">
                {toast ? (
                  <div className={s.toast} key={toast.text}>
                    <span className={s.toastDot} aria-hidden="true" />
                    <p>{toast.text}</p>
                    {toast.action ? (
                      <button type="button" className={s.mini} data-strong="true" onClick={() => order(toast.id)}>
                        Preparar pedido
                      </button>
                    ) : null}
                  </div>
                ) : null}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
