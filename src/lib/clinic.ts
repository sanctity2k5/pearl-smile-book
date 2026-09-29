import { useSyncExternalStore } from "react";

export const CLINIC = {
  name: "PearlSmile Dental",
  city: "Lagos, Nigeria",
  address: "Plot 1242 Adetokunbo Ademola Street, Victoria Island, Lagos",
  phone: "+234 811 951 5005",
  landline: "+234 1 293 8470",
  email: "concierge@pearlsmile-dental.com",
  hours: "Mon–Sat · 9:00 AM – 6:00 PM",
  openHour: 9,
  closeHour: 18,
  deposit: 25000,
};

export type ServiceId = "new" | "cleaning" | "cosmetic" | "emergency";
export type Service = {
  id: ServiceId;
  name: string;
  duration: number;
  description: string;
  price: string;
  deposit: boolean;
};

export const SERVICES: Service[] = [
  {
    id: "new",
    name: "New Patient Consultation",
    duration: 60,
    description: "Comprehensive physical and digital dental examination, full periodontal mouth mapping, bite alignment review, and a personalized preventative care blueprint.",
    price: "₦45,000",
    deposit: true,
  },
  {
    id: "cleaning",
    name: "Dental Cleaning & Airflow Therapy",
    duration: 60,
    description: "Professional ultrasonic plaque and stubborn calculus removal, gentle subgingival airflow polishing to erase deep coffee stains, followed by a remineralizing enamel shield.",
    price: "₦40,000",
    deposit: true,
  },
  {
    id: "cosmetic",
    name: "Cosmetic & Smile Design",
    duration: 45,
    description: "Bespoke aesthetic smile analysis. Review options for handcrafted ultrathin porcelain veneers, composite bonding, and in-chair cold-light whitening tailored to facial symmetry.",
    price: "₦50,000",
    deposit: true,
  },
  {
    id: "emergency",
    name: "Tooth Pain / Emergency Triage",
    duration: 30,
    description: "Urgent symptom relief assessment for acute throbbing pain, chipped enamel, damaged crowns, or gum abscesses. Includes localized digital X-rays and immediate clinical stabilization.",
    price: "₦35,000",
    deposit: true,
  },
];

export const getService = (id: string) => SERVICES.find((s) => s.id === id) ?? SERVICES[0];

export type Status = "confirmed" | "needs_confirmation" | "cancelled";
export type Deposit = "paid" | "not_required" | "refunded";
export type TimelineItem = { label: string; at: string };
export type Appt = {
  id: string;
  name: string;
  phone: string;
  email: string;
  serviceId: ServiceId;
  start: string;
  status: Status;
  deposit: Deposit;
  reason?: string;
  timeline: TimelineItem[];
};

/* ---------- date helpers ---------- */
export const startOfDay = (d: Date) => {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  return x;
};
export const addDays = (d: Date, n: number) => {
  const x = new Date(d);
  x.setDate(x.getDate() + n);
  return x;
};
export const sameDay = (a: Date, b: Date) => startOfDay(a).getTime() === startOfDay(b).getTime();
export const weekStart = (d: Date) => addDays(startOfDay(d), -((d.getDay() + 6) % 7));
export const fmtTime = (d: Date | string) =>
  new Date(d).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
export const fmtDate = (d: Date | string) =>
  new Date(d).toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" });
export const fmtShort = (d: Date | string) =>
  new Date(d).toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" });
export const naira = (n: number) => "₦" + n.toLocaleString("en-NG");
export const apptEnd = (a: Appt) =>
  new Date(new Date(a.start).getTime() + getService(a.serviceId).duration * 60000);

/* ---------- seed data ---------- */
const at = (day: Date, h: number, m = 0) => {
  const x = new Date(day);
  x.setHours(h, m, 0, 0);
  return x;
};

function makeAppt(
  id: string,
  name: string,
  serviceId: ServiceId,
  start: Date,
  status: Status = "confirmed",
): Appt {
  const s = getService(serviceId);
  const email = name.toLowerCase().replace(/[^a-z]+/g, ".") + "@gmail.com";
  const phone = "+234 80" + (3 + (name.length % 6)) + " " + String(100 + name.length * 37).slice(0, 3) + " " + String(1000 + name.charCodeAt(0) * 41).slice(0, 4);
  const requested = new Date(start.getTime() - 3 * 86400000);
  const tl: TimelineItem[] = [{ label: "Appointment requested", at: requested.toISOString() }];
  if (s.deposit) tl.push({ label: "Deposit received", at: new Date(requested.getTime() + 4 * 60000).toISOString() });
  tl.push({ label: "Appointment confirmed", at: new Date(requested.getTime() + 5 * 60000).toISOString() });
  tl.push({ label: "Confirmation sent via WhatsApp & SMS", at: new Date(requested.getTime() + 6 * 60000).toISOString() });
  tl.push({ label: "Reminder scheduled for 24 hours before", at: new Date(requested.getTime() + 6 * 60000).toISOString() });
  if (status === "needs_confirmation")
    tl.push({ label: "Reminder sent — awaiting patient reply", at: new Date(start.getTime() - 20 * 3600000).toISOString() });
  return { id, name, phone, email, serviceId, start: start.toISOString(), status, deposit: s.deposit ? "paid" : "not_required", timeline: tl };
}

const NAMES = [
  "Adaeze Okonkwo", "Tunde Bakare", "Chioma Nwosu", "Olumide Adeyemi", "Funmilayo Ade", "Ifeanyi Obi",
  "Grace Etim", "Babajide Salako", "Kemi Oladipo", "Emeka Nnaji", "Aisha Bello", "David Okoro",
  "Zainab Musa", "Segun Afolabi", "Ngozi Eze", "Yetunde Lawal", "Obinna Uche", "Halima Sani",
];
const TEMPLATES: [number, number, ServiceId][][] = [
  [[9, 0, "cleaning"], [11, 0, "new"], [14, 0, "cosmetic"], [16, 30, "cleaning"]],
  [[9, 30, "new"], [12, 0, "cleaning"], [15, 0, "emergency"], [16, 0, "cosmetic"]],
  [[10, 0, "cleaning"], [13, 0, "new"], [15, 30, "cleaning"]],
  [[9, 0, "new"], [10, 30, "cosmetic"], [14, 30, "cleaning"], [17, 0, "emergency"]],
];
const SATURDAY: [number, number, ServiceId][] = [
  [9, 0, "cleaning"], [10, 0, "new"], [11, 0, "cleaning"], [12, 0, "cosmetic"], [13, 0, "cleaning"],
  [14, 0, "new"], [15, 0, "cleaning"], [16, 0, "cosmetic"], [17, 0, "cleaning"],
];

function seed(): Appt[] {
  const today = startOfDay(new Date());
  const list: Appt[] = [
    makeAppt("emily-carter", "Emily Carter", "cleaning", at(today, 9)),
    makeAppt("james-wilson", "James Wilson", "new", at(today, 10, 30)),
    makeAppt("chinedu-okafor", "Chinedu Okafor", "cosmetic", at(today, 11, 45)),
    makeAppt("sarah-miller", "Sarah Miller", "cosmetic", at(today, 13)),
    makeAppt("tolu-bankole", "Tolu Bankole", "cleaning", at(today, 14)),
    makeAppt("michael-brown", "Michael Brown", "emergency", at(today, 15), "needs_confirmation"),
    makeAppt("ngozi-eze", "Ngozi Eze", "cleaning", at(today, 16)),
    makeAppt("funmi-adebayo", "Funmi Adebayo", "cleaning", at(today, 17)),
  ];
  const ws = weekStart(today);
  let n = 0;
  for (let i = 0; i < 14; i++) {
    const day = addDays(ws, i);
    if (day.getDay() === 0 || sameDay(day, today)) continue;
    const tpl = day.getDay() === 6 ? SATURDAY.filter((_, k) => i < 7 || k % 3 !== 1) : TEMPLATES[i % TEMPLATES.length];
    tpl.forEach(([h, m, sid]) => {
      const name = NAMES[n++ % NAMES.length];
      list.push(makeAppt(`a-${i}-${h}${m}`, name, sid, at(day, h, m)));
    });
  }
  return list;
}

/* ---------- store ---------- */
const KEY = "pearlsmile-appts-v1";
let state: Appt[] = seed();
if (typeof window !== "undefined") {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) {
      const p = JSON.parse(raw);
      if (p.day === startOfDay(new Date()).toISOString()) state = p.items;
    }
  } catch {
    /* ignore */
  }
}
const listeners = new Set<() => void>();
function set(next: Appt[]) {
  state = next;
  try {
    localStorage.setItem(KEY, JSON.stringify({ day: startOfDay(new Date()).toISOString(), items: state }));
  } catch {
    /* ignore */
  }
  listeners.forEach((l) => l());
}
const subscribe = (l: () => void) => {
  listeners.add(l);
  return () => listeners.delete(l);
};
export const useAppointments = () => useSyncExternalStore(subscribe, () => state, () => state);
export const useAppointment = (id: string) => useAppointments().find((a) => a.id === id);

const now = () => new Date().toISOString();

export function createAppointment(input: {
  name: string;
  phone: string;
  email: string;
  serviceId: ServiceId;
  start: Date;
  reason?: string;
}): Appt {
  const s = getService(input.serviceId);
  const t = Date.now();
  const iso = (o: number) => new Date(t + o * 1000).toISOString();
  const tl: TimelineItem[] = [{ label: "Appointment requested", at: iso(0) }];
  if (s.deposit) tl.push({ label: `Deposit received · ${naira(CLINIC.deposit)}`, at: iso(1) });
  tl.push({ label: "Appointment confirmed", at: iso(2) });
  tl.push({ label: "Confirmation sent via WhatsApp & SMS", at: iso(3) });
  tl.push({ label: "Reminder scheduled for 24 hours before", at: iso(3) });
  const a: Appt = {
    id: "PS-" + Math.random().toString(36).slice(2, 7).toUpperCase(),
    name: input.name,
    phone: input.phone,
    email: input.email,
    serviceId: input.serviceId,
    start: input.start.toISOString(),
    reason: input.reason,
    status: "confirmed",
    deposit: s.deposit ? "paid" : "not_required",
    timeline: tl,
  };
  set([...state, a]);
  return a;
}

function patch(id: string, fn: (a: Appt) => Appt) {
  set(state.map((a) => (a.id === id ? fn(a) : a)));
}
export const rescheduleAppointment = (id: string, start: Date, by: "patient" | "clinic") =>
  patch(id, (a) => ({
    ...a,
    start: start.toISOString(),
    status: "confirmed",
    timeline: [
      ...a.timeline,
      { label: `Rescheduled by ${by} to ${fmtShort(start)}, ${fmtTime(start)}`, at: now() },
      { label: "Updated confirmation sent · reminder re-scheduled", at: now() },
    ],
  }));
export const cancelAppointment = (id: string, by: "patient" | "clinic") =>
  patch(id, (a) => ({
    ...a,
    status: "cancelled",
    deposit: a.deposit === "paid" ? "refunded" : a.deposit,
    timeline: [
      ...a.timeline,
      { label: `Cancelled by ${by}`, at: now() },
      ...(a.deposit === "paid" ? [{ label: "Deposit credited back to patient", at: now() }] : []),
      { label: "Slot released for new bookings", at: now() },
    ],
  }));
export const sendReminder = (id: string) =>
  patch(id, (a) => ({ ...a, timeline: [...a.timeline, { label: "Reminder sent via WhatsApp & SMS", at: now() }] }));
export const markConfirmed = (id: string) =>
  patch(id, (a) => ({
    ...a,
    status: "confirmed",
    timeline: [...a.timeline, { label: "Patient confirmed attendance", at: now() }],
  }));

/* ---------- availability ---------- */
export type Slot = { time: Date; available: boolean };
export function slotsFor(day: Date, duration: number, appts: Appt[], excludeId?: string): Slot[] {
  if (day.getDay() === 0) return [];
  const busy = appts
    .filter((a) => a.status !== "cancelled" && a.id !== excludeId && sameDay(new Date(a.start), day))
    .map((a) => [new Date(a.start).getTime(), apptEnd(a).getTime()]);
  const out: Slot[] = [];
  const nowT = Date.now() + 30 * 60000;
  for (let min = CLINIC.openHour * 60; min + duration <= CLINIC.closeHour * 60; min += 30) {
    const t = at(day, Math.floor(min / 60), min % 60);
    const s = t.getTime();
    const e = s + duration * 60000;
    const free = s > nowT && !busy.some(([bs, be]) => s < be && e > bs);
    out.push({ time: t, available: free });
  }
  return out;
}
