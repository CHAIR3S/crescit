/**
 * Motor del diagnóstico "Descubre qué necesita tu negocio".
 *
 * Cada respuesta suma peso a una o varias soluciones. La recomendación sale de
 * esas puntuaciones (no hay un resultado fijo): la solución principal es la de
 * mayor peso, la complementaria se elige de otra familia si tiene peso
 * suficiente, y los textos de hallazgos, motivos y funcionalidades se componen a
 * partir de lo que el visitante ha contestado.
 */

import type { Topic } from "@/lib/contact-store";

export type SolutionId =
  | "landing"
  | "rediseno"
  | "sistema"
  | "reservas"
  | "crm"
  | "automatizacion"
  | "asistente"
  | "integracion"
  | "evolucion"
  | "ia";

type Family = "web" | "ops" | "auto";
type Weights = Partial<Record<SolutionId, number>>;

export type Solution = {
  name: string;
  /** "tu principal oportunidad está en …" */
  area: string;
  family: Family;
  description: string;
  why: string;
  features: string[];
  pairs: SolutionId[];
};

export const SOLUTIONS: Record<SolutionId, Solution> = {
  landing: {
    name: "Landing page a medida",
    area: "conseguir que más gente te contacte",
    family: "web",
    description:
      "Una página diseñada para presentar el valor de tu empresa y llevar a cada visitante hacia una acción concreta: escribirte, pedir presupuesto o reservar.",
    why: "Antes de invertir en más visibilidad conviene tener un sitio que convierta en contactos las visitas que ya llegan.",
    features: [
      "Mensaje claro desde el primer segundo",
      "Una acción principal en cada pantalla",
      "Diseño y animaciones propios de tu marca",
      "Pensada primero para el móvil y preparada para Google",
      "Medición de visitas y contactos para saber qué funciona",
    ],
    pairs: ["crm", "asistente", "automatizacion"],
  },
  rediseno: {
    name: "Rediseño de tu web",
    area: "la imagen que proyecta tu marca",
    family: "web",
    description:
      "Rehacemos tu web para que transmita la calidad real de tu empresa, se entienda a la primera y puedas actualizarla sin depender de nadie.",
    why: "Tu web es lo primero que ve un cliente antes de hablar contigo; si se queda por detrás de lo que haces, juega en tu contra.",
    features: [
      "Nueva dirección visual a partir de tu marca",
      "Textos reescritos desde el punto de vista de tu cliente",
      "Estructura que guía hacia el contacto",
      "Panel para editar contenidos tú mismo",
      "Carga rápida y SEO técnico bien resuelto",
    ],
    pairs: ["landing", "crm", "asistente"],
  },
  sistema: {
    name: "Sistema de gestión a medida",
    area: "poner orden en tu operación",
    family: "ops",
    description:
      "Una plataforma hecha para tu forma de trabajar que reúne en un solo sitio lo que hoy tienes repartido: stock, ventas, pedidos, clientes y equipo.",
    why: "Cuando la información vive en varios sitios se copia a mano, se pierde y nadie tiene la foto completa. Centralizarla es lo que más tiempo libera.",
    features: [
      "Panel con los números del día de un vistazo",
      "Permisos por persona y por área",
      "Acceso desde el ordenador y el móvil",
      "Informes exportables a Excel",
    ],
    pairs: ["automatizacion", "integracion", "crm"],
  },
  reservas: {
    name: "Sistema de reservas y citas",
    area: "gestionar citas sin perder tiempo",
    family: "ops",
    description:
      "Tus clientes reservan solos, a cualquier hora, y tú ves la agenda ordenada, con recordatorios automáticos que reducen las ausencias.",
    why: "Cada cita que se da por teléfono o por chat interrumpe tu trabajo; si el cliente puede reservar solo, esa interrupción desaparece.",
    features: [
      "Reserva online según tu disponibilidad real",
      "Recordatorios automáticos por WhatsApp o email",
      "Cambios y cancelaciones sin llamadas",
      "Agenda compartida por profesional o por sala",
    ],
    pairs: ["asistente", "landing", "crm"],
  },
  crm: {
    name: "CRM a medida",
    area: "no dejar escapar ningún cliente",
    family: "ops",
    description:
      "Un registro único de cada cliente: qué te pidió, qué le ofreciste y cuándo hay que volver a llamarle, con avisos para que ningún seguimiento se quede en el aire.",
    why: "La mayoría de ventas se pierden en el seguimiento, no en el primer contacto. Un CRM hecho a tu medida hace que nadie se quede sin respuesta.",
    features: [
      "Ficha de cada cliente con su historial",
      "Embudo de oportunidades por fases",
      "Avisos de seguimiento para cada persona del equipo",
      "Entrada automática de los contactos de tu web",
    ],
    pairs: ["automatizacion", "landing", "asistente"],
  },
  automatizacion: {
    name: "Automatización de procesos",
    area: "dejar de hacer a mano lo repetitivo",
    family: "auto",
    description:
      "Conectamos tus herramientas para que las tareas repetitivas ocurran solas: pasar datos de un sitio a otro, enviar avisos, generar documentos y mantener todo al día.",
    why: "Las tareas que se repiten igual cada día son las más fáciles de automatizar y las que más horas devuelven.",
    features: [
      "Flujos que se disparan solos ante cada evento",
      "Datos que pasan solos de una herramienta a otra",
      "Avisos al equipo cuando algo requiere atención",
      "Registro de todo lo que se ha ejecutado",
    ],
    pairs: ["sistema", "integracion", "asistente"],
  },
  asistente: {
    name: "Asistente inteligente para WhatsApp",
    area: "atender a tus clientes sin estar pendiente",
    family: "auto",
    description:
      "Un asistente con inteligencia artificial que responde las preguntas frecuentes, da citas y recoge pedidos por WhatsApp o en tu web, y te pasa la conversación cuando hace falta una persona.",
    why: "Responder lo mismo una y otra vez consume horas y, si tardas, el cliente se va a otro sitio. El asistente contesta al momento y con tu información.",
    features: [
      "Respuestas con la información real de tu negocio",
      "Toma de datos y registro automático de cada cliente",
      "Traspaso a una persona cuando la conversación lo pide",
      "Atención las 24 horas, también en festivos",
    ],
    pairs: ["reservas", "crm", "automatizacion"],
  },
  integracion: {
    name: "Integración entre tus herramientas",
    area: "conectar las herramientas que ya usas",
    family: "auto",
    description:
      "Hacemos que tus programas hablen entre sí para que cada dato se escriba una sola vez y esté al día en todas partes.",
    why: "Copiar la misma información en varios programas es lento y es la fuente de casi todos los errores.",
    features: [
      "Sincronización entre tus programas actuales",
      "Sin cambiar las herramientas a las que tu equipo está acostumbrado",
      "Alertas si alguna conexión falla",
      "Un panel con los datos combinados",
    ],
    pairs: ["sistema", "automatizacion", "evolucion"],
  },
  evolucion: {
    name: "Evolución de tu sistema actual",
    area: "sacar partido a lo que ya tienes",
    family: "ops",
    description:
      "Revisamos tu sistema, corregimos lo que falla y le añadimos lo que le falta, sin obligarte a empezar de cero.",
    why: "Si el sistema ya contiene tu forma de trabajar y tus datos, mejorarlo suele ser más rápido y barato que sustituirlo.",
    features: [
      "Auditoría técnica de lo que tienes",
      "Corrección de errores y mejoras de rendimiento",
      "Nuevas funciones según prioridad",
      "Mantenimiento continuo",
    ],
    pairs: ["integracion", "automatizacion", "sistema"],
  },
  ia: {
    name: "Hoja de ruta de inteligencia artificial",
    area: "aplicar la inteligencia artificial con criterio",
    family: "auto",
    description:
      "Detectamos en qué procesos la IA te ahorra tiempo de verdad y la ponemos en marcha empezando por un caso pequeño y medible.",
    why: "La IA funciona cuando resuelve una tarea concreta. Empezar por un caso acotado permite ver resultados antes de invertir más.",
    features: [
      "Análisis de tus procesos para detectar dónde aporta",
      "Un primer caso de uso funcionando en pocas semanas",
      "Uso de tus propios datos y documentos",
      "Formación para tu equipo",
    ],
    pairs: ["asistente", "automatizacion", "integracion"],
  },
};

export type Option = {
  id: string;
  label: string;
  /** Cómo se lee la opción dentro de una frase del informe (segunda persona). */
  phrase?: string;
  w?: Weights;
  /** Frase para "Lo que hemos visto" (respuestas de opción única). */
  note?: string;
  /** Funcionalidad concreta que se añade a la recomendación si aplica. */
  feat?: { to: SolutionId[]; text: string };
};

export type Question = {
  id: string;
  phase: 0 | 1 | 2;
  title: string;
  hint?: string;
  multi?: boolean;
  max?: number;
  /** Etiqueta corta para el resumen y el panel lateral. */
  short: string;
  options: Option[];
};

/* ---------------- Paso 1: el problema ---------------- */

export const Q_PROBLEM: Question = {
  id: "problema",
  phase: 0,
  title: "¿Qué te está impidiendo dar el siguiente paso?",
  hint: "Elige la situación que más se parezca a la tuya.",
  short: "Punto de partida",
  options: [
    { id: "clientes", label: "Tengo un buen negocio, pero no consigo suficientes clientes.", w: { landing: 3, crm: 1 }, note: "Tu negocio funciona, pero no te llegan suficientes clientes nuevos." },
    { id: "imagen", label: "Mi página web no representa la calidad de mi empresa.", w: { rediseno: 3, landing: 1 }, note: "Tu web no transmite la calidad real de lo que haces." },
    { id: "manual", label: "Gestiono demasiadas cosas a mano.", w: { automatizacion: 2, sistema: 2 }, note: "Buena parte de tu día se va en tareas manuales." },
    { id: "dispersa", label: "Tengo la información repartida entre Excel, WhatsApp y otras herramientas.", w: { sistema: 3, integracion: 2 }, note: "Tu información está repartida en varias herramientas que no se hablan." },
    { id: "atencion", label: "Pierdo tiempo respondiendo las mismas preguntas o gestionando citas.", w: { asistente: 3, reservas: 1 }, note: "Atender consultas repetidas y citas te quita tiempo cada día." },
    { id: "mejorar", label: "Necesito mejorar un sistema que ya tengo.", w: { evolucion: 3 }, note: "Ya tienes un sistema, pero se ha quedado corto." },
    { id: "ia", label: "Quiero aplicar inteligencia artificial, pero no sé por dónde empezar.", w: { ia: 2, asistente: 1, automatizacion: 1 }, note: "Quieres aprovechar la inteligencia artificial y buscas por dónde empezar." },
    { id: "nose", label: "No estoy seguro de qué necesita mi negocio.", note: "Sientes que algo se puede hacer mejor, pero aún no sabes qué." },
  ],
};

/* ---------------- Paso 2: preguntas según la situación ---------------- */

const Q_ACCION: Question = {
  id: "accion",
  phase: 1,
  title: "¿Qué quieres que haga quien llega a tu web?",
  short: "Acción que buscas",
  options: [
    { id: "escribir", label: "Que me escriba o pida presupuesto", w: { landing: 1, crm: 1 }, note: "Quieres que quien te visite te pida presupuesto.", feat: { to: ["landing", "rediseno"], text: "Formulario de presupuesto con preguntas que te ayudan a filtrar" } },
    { id: "reservar", label: "Que reserve una cita", w: { reservas: 2, landing: 1 }, note: "Quieres que tus clientes reserven cita directamente.", feat: { to: ["landing", "rediseno", "reservas"], text: "Reserva de citas integrada en la propia página" } },
    { id: "comprar", label: "Que compre directamente", w: { landing: 1, sistema: 1 }, note: "Quieres vender directamente por internet.", feat: { to: ["landing", "rediseno"], text: "Catálogo y compra online conectados a tu stock" } },
    { id: "whatsapp", label: "Que me escriba por WhatsApp", w: { landing: 1, asistente: 2 }, note: "Prefieres que te escriban por WhatsApp.", feat: { to: ["landing", "rediseno", "asistente"], text: "Acceso directo a WhatsApp con el mensaje ya preparado" } },
  ],
};

export const BRANCHES: Record<string, Question[]> = {
  clientes: [
    {
      id: "origen",
      phase: 1,
      title: "¿Cómo te llegan hoy la mayoría de tus clientes?",
      short: "Cómo llegan tus clientes",
      options: [
        { id: "recomendacion", label: "Por recomendación o boca a boca", w: { landing: 1 }, note: "Te llegan sobre todo por recomendación, y quien te recomienda te busca después en internet." },
        { id: "redes", label: "Por redes sociales", w: { landing: 2 }, note: "Generas interés en redes, pero ese interés se pierde si no llega a un sitio propio que lo convierta en contactos." },
        { id: "google", label: "Me buscan en Google", w: { landing: 1, rediseno: 1 }, note: "Ya te buscan en Google: cada visita que no termina en contacto es una oportunidad perdida." },
        { id: "publicidad", label: "Pago publicidad", w: { landing: 3 }, note: "Pagas publicidad, y si la página a la que llega no convence, pagas visitas que no vuelven." },
        { id: "casi", label: "Casi no me encuentran", w: { landing: 3 }, note: "Hoy casi nadie te encuentra: necesitas un lugar claro al que dirigir a cualquier interesado." },
      ],
    },
    {
      id: "web",
      phase: 1,
      title: "¿Tienes página web?",
      short: "Tu web",
      options: [
        { id: "no", label: "No, todavía no", w: { landing: 2 }, note: "Todavía no tienes una web propia." },
        { id: "vieja", label: "Sí, pero está anticuada o no me trae clientes", w: { rediseno: 2, landing: 1 }, note: "Tu web actual no te está trayendo contactos." },
        { id: "ok", label: "Sí, y funciona bien", w: { crm: 2, asistente: 1 }, note: "Tu web funciona; el margen está en lo que pasa después del primer contacto." },
      ],
    },
    Q_ACCION,
  ],
  imagen: [
    {
      id: "fallos",
      phase: 1,
      title: "¿Qué le falla a tu web actual?",
      hint: "Marca todas las que apliquen.",
      multi: true,
      short: "Qué falla en tu web",
      options: [
        { id: "anticuada", label: "Se ve anticuada", phrase: "se ve anticuada", w: { rediseno: 2 } },
        { id: "noentiende", label: "No se entiende qué ofrezco", phrase: "no se entiende qué ofreces", w: { rediseno: 1, landing: 1 }, feat: { to: ["rediseno", "landing"], text: "Mensaje principal reescrito y probado con tu cliente tipo" } },
        { id: "movil", label: "En el móvil se ve mal", phrase: "en el móvil se ve mal", w: { rediseno: 2 } },
        { id: "contactos", label: "No me llega ningún contacto", phrase: "no te llega ningún contacto", w: { landing: 2, crm: 1 } },
        { id: "editar", label: "Me cuesta actualizarla", phrase: "te cuesta actualizarla", w: { rediseno: 1 }, feat: { to: ["rediseno"], text: "Editor sencillo para cambiar textos, fotos y precios" } },
      ],
    },
    {
      id: "competencia",
      phase: 1,
      title: "Comparada con la de tu competencia, tu imagen en internet…",
      short: "Frente a tu competencia",
      options: [
        { id: "peor", label: "Se queda claramente por detrás", w: { rediseno: 2 }, note: "Tu competencia transmite una imagen mejor que la tuya, aunque tu trabajo no sea peor." },
        { id: "igual", label: "Es parecida, no destaca", w: { rediseno: 1, landing: 1 }, note: "Tu imagen se parece a la de tu competencia y no te diferencia." },
        { id: "nolose", label: "No me he fijado", note: "Todavía no has comparado tu imagen con la de tu competencia." },
      ],
    },
    Q_ACCION,
  ],
  manual: [],
  dispersa: [],
  atencion: [
    {
      id: "repite",
      phase: 1,
      title: "¿Qué es lo que más se repite en tu día?",
      hint: "Marca todas las que apliquen.",
      multi: true,
      short: "Lo que más se repite",
      options: [
        { id: "preguntas", label: "Responder las mismas preguntas", w: { asistente: 3 } },
        { id: "citas", label: "Dar, cambiar o confirmar citas", w: { reservas: 3, asistente: 1 }, feat: { to: ["asistente", "reservas"], text: "Citas que se dan, cambian y confirman solas" } },
        { id: "pedidos", label: "Informar del estado de los pedidos", w: { asistente: 2, integracion: 1 }, feat: { to: ["asistente"], text: "Consulta del estado de cada pedido en tiempo real" } },
        { id: "presupuestos", label: "Preparar presupuestos", w: { automatizacion: 2 }, feat: { to: ["automatizacion", "asistente"], text: "Presupuestos generados a partir de los datos del cliente" } },
        { id: "seguimiento", label: "Recordar a los clientes que vuelvan", w: { crm: 1, automatizacion: 2 }, feat: { to: ["automatizacion", "crm", "asistente"], text: "Mensajes de seguimiento programados" } },
      ],
    },
    {
      id: "canales",
      phase: 1,
      title: "¿Por dónde te escriben tus clientes?",
      hint: "Marca todas las que apliquen.",
      multi: true,
      short: "Canales",
      options: [
        { id: "whatsapp", label: "WhatsApp", phrase: "WhatsApp", w: { asistente: 2 } },
        { id: "email", label: "Correo electrónico", phrase: "correo electrónico", w: { automatizacion: 1 } },
        { id: "telefono", label: "Teléfono", phrase: "teléfono", w: { reservas: 1 } },
        { id: "instagram", label: "Instagram", phrase: "Instagram", w: { asistente: 1 } },
        { id: "web", label: "Formulario de la web", phrase: "el formulario de la web", w: { crm: 1 } },
      ],
    },
    {
      id: "volumen",
      phase: 1,
      title: "¿Cuántas consultas recibes en un día normal?",
      short: "Consultas al día",
      options: [
        { id: "pocas", label: "Menos de 10", w: { reservas: 1 }, note: "Recibes menos de 10 consultas al día." },
        { id: "medias", label: "Entre 10 y 50", w: { asistente: 1 }, note: "Recibes entre 10 y 50 consultas al día: suficiente para que responderlas sea casi un puesto de trabajo." },
        { id: "muchas", label: "Más de 50", w: { asistente: 2, crm: 1 }, note: "Recibes más de 50 consultas al día: atenderlas a mano no escala." },
      ],
    },
  ],
  mejorar: [
    {
      id: "tipo",
      phase: 1,
      title: "¿Qué sistema tienes ahora?",
      short: "Sistema actual",
      options: [
        { id: "medida", label: "Un programa hecho a medida", w: { evolucion: 2 }, note: "Tienes un programa hecho a medida." },
        { id: "comercial", label: "Un software comercial", w: { integracion: 2, evolucion: 1 }, note: "Usas un software comercial que no termina de adaptarse a ti." },
        { id: "hojas", label: "Hojas de cálculo muy complejas", w: { sistema: 3 }, note: "Tu 'sistema' son hojas de cálculo que han crecido demasiado." },
        { id: "web", label: "Una web con panel de administración", w: { evolucion: 2, rediseno: 1 }, note: "Tienes una web con panel de administración." },
      ],
    },
    {
      id: "problemas",
      phase: 1,
      title: "¿Qué le pasa?",
      hint: "Marca todas las que apliquen.",
      multi: true,
      short: "Qué le pasa",
      options: [
        { id: "lento", label: "Es lento o falla", w: { evolucion: 2 }, feat: { to: ["evolucion"], text: "Plan de estabilidad y rendimiento" } },
        { id: "faltan", label: "Le faltan funciones", w: { evolucion: 2 } },
        { id: "conecta", label: "No se conecta con otras herramientas", w: { integracion: 3 }, feat: { to: ["evolucion", "integracion"], text: "Conexión con las herramientas que ya usas" } },
        { id: "nousa", label: "El equipo no lo usa", w: { evolucion: 1, sistema: 1 }, feat: { to: ["evolucion", "sistema"], text: "Pantallas rediseñadas pensando en quien las usa cada día" } },
        { id: "nadie", label: "Nadie lo mantiene", w: { evolucion: 2 } },
      ],
    },
  ],
  ia: [
    {
      id: "usos",
      phase: 1,
      title: "¿Dónde crees que la IA te ayudaría más?",
      hint: "Marca todas las que apliquen.",
      multi: true,
      short: "Dónde ayudaría la IA",
      options: [
        { id: "atencion", label: "Atendiendo a clientes", phrase: "atender a tus clientes", w: { asistente: 3 } },
        { id: "correos", label: "Clasificando y respondiendo correos", phrase: "clasificar y responder correos", w: { automatizacion: 2 }, feat: { to: ["automatizacion", "ia"], text: "Correos clasificados y respuestas sugeridas" } },
        { id: "documentos", label: "Preparando presupuestos o documentos", phrase: "preparar presupuestos o documentos", w: { automatizacion: 2 }, feat: { to: ["automatizacion", "ia"], text: "Documentos redactados a partir de tus plantillas" } },
        { id: "datos", label: "Entendiendo mis datos y mis números", phrase: "entender tus datos y tus números", w: { sistema: 1, ia: 1 }, feat: { to: ["ia", "sistema"], text: "Preguntas a tus datos en lenguaje normal" } },
        { id: "nolose", label: "Aún no lo sé", w: { ia: 2 } },
      ],
    },
    {
      id: "herramientas",
      phase: 1,
      title: "¿Qué herramientas usáis a diario?",
      hint: "Marca todas las que apliquen.",
      multi: true,
      short: "Herramientas actuales",
      options: [
        { id: "whatsapp", label: "WhatsApp", phrase: "WhatsApp", w: { asistente: 1 } },
        { id: "correo", label: "Gmail u Outlook", phrase: "Gmail u Outlook", w: { automatizacion: 1 } },
        { id: "hojas", label: "Excel o Google Sheets", phrase: "Excel o Google Sheets", w: { integracion: 1 } },
        { id: "crm", label: "Un CRM", phrase: "un CRM", w: { integracion: 1 } },
        { id: "facturacion", label: "Un programa de facturación", phrase: "un programa de facturación", w: { integracion: 1 } },
        { id: "ninguna", label: "Ninguna en especial", w: { sistema: 1 } },
      ],
    },
  ],
  nose: [
    {
      id: "negocio",
      phase: 1,
      title: "¿Cómo describirías tu negocio?",
      short: "Tipo de negocio",
      options: [
        { id: "productos", label: "Vendo productos", w: { sistema: 1, landing: 1 }, note: "Vendes productos." },
        { id: "citas", label: "Ofrezco servicios con cita previa", w: { reservas: 2, asistente: 1 }, note: "Trabajas con cita previa." },
        { id: "proyectos", label: "Trabajo por proyectos o presupuestos", w: { crm: 2, landing: 1 }, note: "Trabajas por proyectos y presupuestos." },
        { id: "local", label: "Tengo un local o tienda física", w: { landing: 1, sistema: 1 }, note: "Tienes un local o tienda física." },
      ],
    },
    {
      id: "facil",
      phase: 1,
      title: "¿Qué te gustaría que fuera más fácil?",
      hint: "Marca todas las que apliquen.",
      multi: true,
      short: "Qué quieres facilitar",
      options: [
        { id: "captar", label: "Conseguir clientes", w: { landing: 3 } },
        { id: "atender", label: "Atenderlos", phrase: "atender a tus clientes", w: { asistente: 2, reservas: 1 } },
        { id: "organizar", label: "Organizar el trabajo", w: { sistema: 2 } },
        { id: "numeros", label: "Saber cómo va el negocio", w: { sistema: 2 }, feat: { to: ["sistema"], text: "Panel con ventas, márgenes y tendencias" } },
      ],
    },
  ],
};

const OPERATIONS: Question[] = [
  {
    id: "procesos",
    phase: 1,
    title: "¿Qué te quita más tiempo?",
    hint: "Marca todas las que apliquen.",
    multi: true,
    short: "Lo que más tiempo quita",
    options: [
      { id: "inventario", label: "Controlar inventario y stock", w: { sistema: 2 }, feat: { to: ["sistema", "integracion", "automatizacion"], text: "Inventario con alertas de stock mínimo" } },
      { id: "ventas", label: "Registrar ventas y pedidos", w: { sistema: 2 }, feat: { to: ["sistema", "integracion", "automatizacion"], text: "Ventas y pedidos registrados al momento" } },
      { id: "reservas", label: "Gestionar reservas y citas", w: { reservas: 3 }, feat: { to: ["sistema", "reservas"], text: "Agenda de citas compartida por el equipo" } },
      { id: "clientes", label: "Hacer seguimiento de clientes", w: { crm: 3 }, feat: { to: ["sistema", "crm"], text: "Ficha de cliente con historial y próximos pasos" } },
      { id: "admin", label: "Facturación y administración", w: { sistema: 1, automatizacion: 2 }, feat: { to: ["sistema", "automatizacion"], text: "Facturas y documentos generados automáticamente" } },
      { id: "equipo", label: "Coordinar al equipo", w: { sistema: 2 }, feat: { to: ["sistema"], text: "Tareas con responsable y fecha para cada persona" } },
    ],
  },
  {
    id: "donde",
    phase: 1,
    title: "¿Dónde vive hoy esa información?",
    hint: "Marca todas las que apliquen.",
    multi: true,
    short: "Dónde está la información",
    options: [
      { id: "excel", label: "En Excel u hojas de cálculo", phrase: "en hojas de Excel", w: { sistema: 1, integracion: 1 } },
      { id: "whatsapp", label: "En chats de WhatsApp", phrase: "en chats de WhatsApp", w: { sistema: 1, asistente: 1 } },
      { id: "papel", label: "En papel o libretas", phrase: "en papel", w: { sistema: 2 } },
      { id: "programa", label: "En un programa que no encaja con cómo trabajamos", phrase: "en un programa que no encaja con vuestra forma de trabajar", w: { sistema: 1, evolucion: 1 } },
      { id: "cabeza", label: "Cada uno lo lleva a su manera", phrase: "en la cabeza de cada uno", w: { sistema: 2 } },
    ],
  },
  {
    id: "equipo",
    phase: 1,
    title: "¿Cuántas personas trabajan con esa información?",
    short: "Personas implicadas",
    options: [
      { id: "solo", label: "Solo yo", w: { automatizacion: 2 }, note: "Lo gestionas tú solo, así que cada hora que se automatiza es una hora tuya." },
      { id: "pocos", label: "De 2 a 5 personas", w: { sistema: 1 }, note: "Sois un equipo pequeño compartiendo la misma información." },
      { id: "medio", label: "De 6 a 20 personas", w: { sistema: 2, integracion: 1 }, note: "Sois entre 6 y 20 personas: sin un sistema común, cada uno acaba con su versión de los datos." },
      { id: "muchos", label: "Más de 20 personas", w: { sistema: 2, integracion: 2 }, note: "Sois más de 20 personas: la coordinación ya depende de tener un sistema común." },
    ],
  },
];
BRANCHES.manual = OPERATIONS;
BRANCHES.dispersa = OPERATIONS;

/* ---------------- Paso 3: el objetivo ---------------- */

export const Q_GOAL: Question = {
  id: "objetivo",
  phase: 2,
  title: "¿Qué resultado te gustaría conseguir?",
  hint: "Elige hasta dos.",
  multi: true,
  max: 2,
  short: "Objetivo",
  options: [
    { id: "oportunidades", label: "Conseguir más oportunidades de venta", w: { landing: 2, crm: 1 } },
    { id: "imagen", label: "Mejorar la imagen de mi marca", phrase: "mejorar la imagen de tu marca", w: { rediseno: 2, landing: 1 } },
    { id: "tiempo", label: "Ahorrar tiempo", w: { automatizacion: 2, asistente: 1 } },
    { id: "orden", label: "Tener mi empresa organizada", phrase: "tener tu empresa organizada", w: { sistema: 2, crm: 1 } },
    { id: "errores", label: "Reducir errores manuales", w: { automatizacion: 1, sistema: 1, integracion: 1 } },
    { id: "atencion", label: "Atender a mis clientes sin estar pendiente", phrase: "atender a tus clientes sin estar pendiente", w: { asistente: 2, reservas: 1 } },
    { id: "escalar", label: "Poder crecer sin que todo se complique", w: { sistema: 1, integracion: 1, automatizacion: 1 } },
  ],
};

export type Answers = Record<string, string[]>;

export function flowFor(answers: Answers): Question[] {
  const p = answers.problema?.[0];
  return [Q_PROBLEM, ...(p ? BRANCHES[p] ?? [] : []), Q_GOAL];
}

/* ---------------- Utilidades de texto ---------------- */

function lowerFirst(t: string) {
  if (/^(WhatsApp|Gmail|Excel|Instagram|Google|IA|CRM)\b/.test(t)) return t;
  return t.charAt(0).toLowerCase() + t.slice(1);
}

function phraseOf(o: Option) {
  return o.phrase ?? lowerFirst(o.label);
}

export function joinEs(items: string[]) {
  if (items.length <= 1) return items.join("");
  return `${items.slice(0, -1).join(", ")} y ${items[items.length - 1]}`;
}

function pick(q: Question, ids: string[] | undefined) {
  return (ids ?? []).map((id) => q.options.find((o) => o.id === id)).filter(Boolean) as Option[];
}

/* ---------------- Resultado ---------------- */

export type Result = {
  primary: SolutionId;
  secondary: SolutionId | null;
  complements: SolutionId[];
  title: string;
  headline: string;
  findings: string[];
  reasons: string[];
  features: string[];
  scores: Record<SolutionId, number>;
  topic: Topic;
  summary: string;
};

const FAMILY_TOPIC: Record<Family, Topic> = { web: "web", ops: "sistema", auto: "automatizacion" };

/** Solución por defecto de cada situación, para desempatar. */
const DEFAULTS: Record<string, SolutionId> = {
  clientes: "landing",
  imagen: "rediseno",
  manual: "automatizacion",
  dispersa: "sistema",
  atencion: "asistente",
  mejorar: "evolucion",
  ia: "ia",
  nose: "landing",
};

export function computeResult(answers: Answers): Result {
  const flow = flowFor(answers);
  const scores = Object.fromEntries(Object.keys(SOLUTIONS).map((k) => [k, 0])) as Record<SolutionId, number>;

  for (const q of flow) {
    for (const o of pick(q, answers[q.id])) {
      for (const [k, v] of Object.entries(o.w ?? {})) scores[k as SolutionId] += v ?? 0;
    }
  }

  const problem = answers.problema?.[0] ?? "nose";
  const def = DEFAULTS[problem];
  const ranked = (Object.keys(scores) as SolutionId[]).sort(
    (a, b) => scores[b] - scores[a] || (a === def ? -1 : b === def ? 1 : 0),
  );
  const primary = ranked[0];
  const top = scores[primary];

  // Complementaria: de otra familia y con peso suficiente.
  const secondary =
    ranked.find(
      (id) =>
        id !== primary &&
        SOLUTIONS[id].family !== SOLUTIONS[primary].family &&
        scores[id] >= Math.max(3, top * 0.45),
    ) ?? null;

  const complements = SOLUTIONS[primary].pairs
    .filter((id) => id !== secondary)
    .sort((a, b) => scores[b] - scores[a])
    .slice(0, 2);

  // Hallazgos
  const findings: string[] = [];
  const p = pick(Q_PROBLEM, answers.problema)[0];
  if (p?.note) findings.push(p.note);
  const lead: Record<string, string> = {
    fallos: "Lo que falla en tu web:",
    repite: "Lo que más se repite en tu día:",
    canales: "Tus clientes te escriben por",
    problemas: "Tu sistema actual:",
    usos: "Crees que la IA te ayudaría a",
    herramientas: "Hoy trabajáis con",
    facil: "Te gustaría que fuera más fácil",
    procesos: "Lo que más tiempo te quita:",
    donde: "Esa información está hoy",
  };
  for (const q of flow.slice(1, -1)) {
    let chosen = pick(q, answers[q.id]);
    if (!chosen.length) continue;
    if (!q.multi) {
      if (chosen[0].note) findings.push(chosen[0].note);
      continue;
    }
    if (q.id === "usos" && chosen.some((o) => o.id === "nolose")) {
      chosen = chosen.filter((o) => o.id !== "nolose");
      if (!chosen.length) {
        findings.push("Aún no tienes claro en qué parte de tu negocio te ayudaría la IA, y es normal: para eso está el análisis.");
        continue;
      }
    }
    if (q.id === "herramientas" && chosen.some((o) => o.id === "ninguna")) {
      chosen = chosen.filter((o) => o.id !== "ninguna");
      if (!chosen.length) {
        findings.push("No usáis ninguna herramienta en especial, así que se puede diseñar todo desde cero y a vuestra medida.");
        continue;
      }
    }
    findings.push(`${lead[q.id] ?? `${q.short}:`} ${joinEs(chosen.map(phraseOf))}.`);
  }
  const goals = pick(Q_GOAL, answers.objetivo);
  if (goals.length) findings.push(`Tu objetivo: ${joinEs(goals.map(phraseOf))}.`);

  // Motivos: el general de la solución más los que se desprenden de las respuestas.
  const has = (q: string, id: string) => answers[q]?.includes(id);
  const reasons = [SOLUTIONS[primary].why];
  if (["sistema", "integracion"].includes(primary) && (has("donde", "excel") || has("donde", "whatsapp") || has("donde", "papel"))) {
    const where = pick(OPERATIONS[1], answers.donde).map(phraseOf);
    reasons.push(`Hoy esa información está ${joinEs(where)}; reunirla en un solo sitio evita copiarla a mano y los errores que eso trae.`);
  }
  if (primary === "asistente" && (has("canales", "whatsapp") || has("herramientas", "whatsapp") || has("accion", "whatsapp"))) {
    reasons.push("Tus clientes ya te escriben por WhatsApp, así que el asistente trabaja justo donde ellos están.");
  }
  if (["landing", "rediseno"].includes(primary) && has("accion", "reservar")) {
    reasons.push("Como quieres que reserven, la página no termina en un formulario: termina en una cita confirmada.");
  }
  if (["landing", "rediseno"].includes(primary) && has("origen", "publicidad")) {
    reasons.push("Ya pagas por atraer visitas; mejorar la página a la que llegan es la forma más directa de que esa inversión rinda.");
  }
  if (["landing", "rediseno"].includes(primary) && has("origen", "recomendacion")) {
    reasons.push("Quien llega recomendado ya confía en ti; la web tiene que confirmar esa confianza, no ponerla en duda.");
  }
  if (primary === "rediseno" && has("competencia", "peor")) {
    reasons.push("Tu cliente compara antes de decidir. Igualar o superar la imagen de tu competencia elimina una razón para elegirla a ella.");
  }
  if (primary === "automatizacion" && has("equipo", "solo")) {
    reasons.push("Lo llevas todo tú: cada tarea que se automatiza es tiempo que recuperas para atender tu negocio.");
  }
  if (primary === "reservas" && has("canales", "telefono")) {
    reasons.push("Muchas citas te llegan por teléfono; con la reserva online dejan de interrumpirte mientras trabajas.");
  }
  if (secondary) {
    reasons.push(
      `Lo combinamos con ${lowerFirst(SOLUTIONS[secondary].name)} porque tus respuestas también apuntan a ${SOLUTIONS[secondary].area}.`,
    );
  }

  // Funcionalidades: base de la solución + las que salen de las respuestas.
  const dynamic: string[] = [];
  for (const q of flow) {
    for (const o of pick(q, answers[q.id])) {
      if (o.feat && (o.feat.to.includes(primary) || (secondary && o.feat.to.includes(secondary)))) dynamic.push(o.feat.text);
    }
  }
  const features = Array.from(new Set([...dynamic, ...SOLUTIONS[primary].features])).slice(0, 6);

  const title = secondary ? `${SOLUTIONS[primary].name} + ${lowerFirst(SOLUTIONS[secondary].name)}` : SOLUTIONS[primary].name;
  const headline = `Tu principal oportunidad está en ${SOLUTIONS[primary].area}.`;

  // Resumen para enviar a Crescit
  const lines: string[] = ["Diagnóstico hecho en la web de Crescit", ""];
  for (const q of flow) {
    const chosen = pick(q, answers[q.id]).map((o) => o.label);
    if (chosen.length) lines.push(`${q.short}: ${chosen.join("; ")}`);
  }
  lines.push("", `Recomendación: ${title}`);
  if (complements.length) lines.push(`Para más adelante: ${complements.map((c) => SOLUTIONS[c].name).join("; ")}`);

  return {
    primary,
    secondary,
    complements,
    title,
    headline,
    findings,
    reasons,
    features,
    scores,
    topic: FAMILY_TOPIC[SOLUTIONS[primary].family],
    summary: lines.join("\n"),
  };
}
