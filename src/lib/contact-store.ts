"use client";

import { useSyncExternalStore } from "react";

/**
 * Estado compartido entre el diagnóstico y el formulario de contacto:
 * el diagnóstico deja aquí su resumen y los CTA de cada servicio el tema.
 */

export type Topic = "web" | "sistema" | "automatizacion" | "nose";

export const topicLabels: Record<Topic, string> = {
  web: "Una web o landing page",
  sistema: "Un sistema a medida",
  automatizacion: "Automatización o inteligencia artificial",
  nose: "Todavía no lo tengo claro",
};

type State = {
  topic: Topic | null;
  diagnosis: { title: string; summary: string } | null;
  /** Se incrementa cada vez que alguien pide abrir el contacto (para enfocar el formulario). */
  nonce: number;
};

let state: State = { topic: null, diagnosis: null, nonce: 0 };
const listeners = new Set<() => void>();

function emit() {
  for (const l of listeners) l();
}

export const contactStore = {
  get: () => state,
  subscribe(l: () => void) {
    listeners.add(l);
    return () => listeners.delete(l);
  },
  setDiagnosis(d: State["diagnosis"], topic?: Topic) {
    state = { ...state, diagnosis: d, topic: topic ?? state.topic };
    emit();
  },
  clearDiagnosis() {
    state = { ...state, diagnosis: null };
    emit();
  },
  request(topic?: Topic) {
    state = { ...state, topic: topic ?? state.topic, nonce: state.nonce + 1 };
    emit();
  },
};

const server: State = { topic: null, diagnosis: null, nonce: 0 };

export function useContactState() {
  return useSyncExternalStore(contactStore.subscribe, contactStore.get, () => server);
}

/** Lleva al formulario de contacto con un tema preseleccionado. */
export function goToContact(topic?: Topic) {
  contactStore.request(topic);
  const el = document.getElementById("contacto");
  if (!el) return;
  const lenis = (window as unknown as { __lenis?: { scrollTo: (t: Element, o?: object) => void } }).__lenis;
  if (lenis) lenis.scrollTo(el, { offset: 0, duration: 1.4 });
  else el.scrollIntoView({ behavior: "smooth" });
}

export function scrollToId(id: string) {
  const el = document.getElementById(id);
  if (!el) return;
  const lenis = (window as unknown as { __lenis?: { scrollTo: (t: Element, o?: object) => void } }).__lenis;
  if (lenis) lenis.scrollTo(el, { offset: 0, duration: 1.4 });
  else el.scrollIntoView({ behavior: "smooth" });
}
