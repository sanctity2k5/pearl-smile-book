import { Link } from "@tanstack/react-router";
import { Check, ChevronLeft, ChevronRight, LockKeyhole, MapPin, Phone, Zap } from "lucide-react";
import { useState } from "react";
import {
  CLINIC,
  addDays,
  fmtTime,
  sameDay,
  slotsFor,
  startOfDay,
  useAppointments,
  type Appt,
  type Status,
} from "@/lib/clinic";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import logoAsset from "@/assets/pearlsmile-logo.png.asset.json";

export function Logo({ sub }: { sub?: string }) {
  return (
    <Link to="/" className="flex shrink-0 items-center gap-4">
      <img src={logoAsset.url} alt="PearlSmile Dental" className="h-10 w-auto" width={143} height={42} />
      {sub && <span className="hidden border-l border-border pl-4 text-xs text-muted-foreground sm:block">{sub}</span>}
    </Link>
  );
}

export function SiteHeader() {
  return (
    <header className="border-b border-primary/30 bg-primary text-primary-foreground">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-5">
        <span className="rounded-lg bg-card px-3 py-1.5 shadow-sm"><Logo /></span>
        <span className="hidden items-center gap-2 rounded-full bg-primary-foreground/10 px-3.5 py-1.5 text-xs font-medium text-primary-foreground/90 lg:inline-flex"><Phone className="size-3.5 text-gold" /> Direct Line: &nbsp;{CLINIC.phone}</span>
        <nav className="flex items-center gap-2 sm:gap-5 text-sm">
          <Link to="/manage" className="hidden font-medium text-primary-foreground/85 transition-colors hover:text-gold md:block">Manage Booking</Link>
          <Link to="/portal/login" className="inline-flex items-center gap-1.5 rounded-md bg-gold px-3 py-2 font-semibold text-primary shadow-sm transition-colors hover:bg-gold/85 sm:px-5"><LockKeyhole className="size-3.5" />Owner Portal</Link>
        </nav>
      </div>
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="mt-auto border-t bg-secondary/80">
      <div className="mx-auto flex max-w-7xl flex-col gap-4 px-5 py-8 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap items-center gap-4"><img src={logoAsset.url} alt="" className="h-6 w-auto" width={143} height={42} /><strong className="text-base font-medium text-primary">PearlSmile Dental</strong><span>© 2026. Private Dental Care Victoria Island.</span></div>
        <div className="flex flex-wrap gap-6"><a href="mailto:concierge@pearlsmile-dental.com?subject=Patient%20confidentiality">Patient Confidentiality</a><Link to="/book" search={{ service: "emergency" }}>Emergency Triage</Link><a href="mailto:concierge@pearlsmile-dental.com?subject=Terms%20of%20service">Terms of Service</a></div>
      </div>
    </footer>
  );
}

export function StatusPill({ status, emergency }: { status: Status; emergency?: boolean }) {
  const map = {
    confirmed: ["Confirmed", "bg-primary-soft text-primary"],
    needs_confirmation: ["Needs confirmation", "bg-warn-soft text-warn"],
    cancelled: ["Cancelled", "bg-muted text-muted-foreground line-through"],
  } as const;
  const [label, cls] = map[status];
  return (
    <span className="inline-flex flex-wrap gap-1.5">
      <span className={cn("rounded-full px-2.5 py-1 text-xs font-semibold", cls)}>{label}</span>
      {emergency && status !== "cancelled" && (
        <span className="rounded-full bg-urgent-soft px-2.5 py-1 text-xs font-semibold text-urgent">Emergency</span>
      )}
    </span>
  );
}

export function Timeline({ items }: { items: Appt["timeline"] }) {
  return (
    <ol className="space-y-4">
      {items.map((t, i) => (
        <li key={i} className="flex gap-3">
          <span className="mt-0.5 grid size-6 shrink-0 place-items-center rounded-full bg-primary-soft text-primary">
            <Check className="size-3.5" strokeWidth={3} />
          </span>
          <div>
            <p className="text-sm font-medium">{t.label}</p>
            <p className="text-xs text-muted-foreground">
              {new Date(t.at).toLocaleString("en-US", { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" })}
            </p>
          </div>
        </li>
      ))}
    </ol>
  );
}

/** Month calendar and time windows; availability respects the selected service duration. */
export function SlotPicker({ duration, value, onChange, excludeId, emergency }: { duration: number; value: Date | null; onChange: (d: Date) => void; excludeId?: string; emergency?: boolean }) {
  const appts = useAppointments();
  const today = startOfDay(new Date());
  const [day, setDay] = useState<Date>(() => value ? startOfDay(value) : today);
  const [month, setMonth] = useState<Date>(() => new Date(today.getFullYear(), today.getMonth(), 1));
  const start = new Date(month.getFullYear(), month.getMonth(), 1);
  const gridStart = addDays(start, -start.getDay());
  const days = Array.from({ length: 42 }, (_, i) => addDays(gridStart, i));
  const slots = slotsFor(day, duration, appts, excludeId);
  const todayFree = slotsFor(today, duration, appts, excludeId).filter(s => s.available);
  const go = (d: Date) => { if (d < today || d.getDay() === 0) return; setDay(d); setMonth(new Date(d.getFullYear(), d.getMonth(), 1)); };
  const moveMonth = (n: number) => { const next = new Date(month.getFullYear(), month.getMonth() + n, 1); setMonth(next); const first = next.getDay() === 0 ? addDays(next, 1) : next; if (first >= today) setDay(first); };
  return <div className="space-y-5">
    {emergency && todayFree.length > 0 && <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-urgent/25 bg-urgent-soft p-4"><div className="flex items-center gap-3"><Zap className="size-5 text-urgent" /><div><p className="text-sm font-semibold">Same-day emergency appointment available</p><p className="text-xs text-muted-foreground">Your earliest open time is {fmtTime(todayFree[0].time)} today.</p></div></div><Button onClick={() => { go(today); onChange(todayFree[0].time); }}>Take today {fmtTime(todayFree[0].time)}</Button></div>}
    <div className="grid gap-6 lg:grid-cols-[1fr_0.85fr]">
      <section><div className="mb-5 flex items-center justify-between gap-2"><h2 className="text-lg font-semibold">{month.toLocaleDateString("en-US", { month: "long", year: "numeric" })}</h2><div className="flex gap-2"><Button variant="outline" size="icon" aria-label="Previous month" onClick={() => moveMonth(-1)} disabled={month.getFullYear() === today.getFullYear() && month.getMonth() === today.getMonth()}><ChevronLeft /></Button><Button variant="outline" size="icon" aria-label="Next month" onClick={() => moveMonth(1)}><ChevronRight /></Button></div></div><div className="grid grid-cols-7 text-center text-xs font-semibold text-muted-foreground">{["Sun","Mon","Tue","Wed","Thu","Fri","Sat"].map(d => <span key={d} className="py-2">{d}</span>)}</div><div className="grid grid-cols-7 gap-1">{days.map(d => { const outside = d.getMonth() !== month.getMonth(); const disabled = outside || d < today || d.getDay() === 0; const available = !disabled && slotsFor(d, duration, appts, excludeId).some(s => s.available); const selected = sameDay(d, day); return <Button key={d.toISOString()} variant={selected ? "default" : "ghost"} disabled={disabled} onClick={() => go(d)} aria-label={d.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })} aria-pressed={selected} className={cn("h-11 min-w-0 flex-col gap-0 p-1 text-sm", !selected && available && "text-primary", !selected && !available && !disabled && "text-muted-foreground")}>{d.getDate()}{available && <span className={cn("size-1 rounded-full",selected ? "bg-primary-foreground" : "bg-primary")} />}</Button>; })}</div><div className="mt-5 flex gap-3"><Button variant="secondary" onClick={() => go(today)} disabled={sameDay(day,today) || today.getDay() === 0}>Today</Button><p className="self-center text-xs text-muted-foreground">A dot marks days with open appointments.</p></div>{day.getDay() === 6 && <p className="mt-4 rounded-md bg-gold-soft px-3 py-2 text-xs">Saturday appointments fill quickly — book early.</p>}</section>
      <section className="border-t pt-5 lg:border-l lg:border-t-0 lg:pl-6 lg:pt-0"><p className="text-xs font-semibold uppercase text-primary">Available times</p><h2 className="mt-2 text-xl font-semibold">{day.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}</h2><p className="mt-1 text-xs text-muted-foreground">{slots.filter(s => s.available).length} available · {duration} minute visit</p>{slots.length === 0 ? <p className="mt-6 rounded-md bg-secondary p-5 text-sm text-muted-foreground">We're closed on Sundays.</p> : slots.every(s => !s.available) ? <div className="mt-6 rounded-md bg-secondary p-5"><p className="text-sm">No openings on this day.</p><Button className="mt-3" variant="outline" onClick={() => go(addDays(day,1))}>Check the next day <ChevronRight /></Button></div> : <div className="mt-5 grid max-h-80 grid-cols-2 gap-2 overflow-y-auto pr-1 sm:grid-cols-3 lg:grid-cols-2">{slots.map(s => { const selected = value?.getTime() === s.time.getTime(); return <Button key={s.time.toISOString()} variant={selected ? "default" : "outline"} disabled={!s.available} onClick={() => onChange(s.time)} aria-pressed={selected} className={cn("h-10", !s.available && "line-through")}>{fmtTime(s.time)}</Button>; })}</div>}<div className="mt-5 flex gap-3 text-xs text-muted-foreground"><span className="flex items-center gap-1"><span className="size-2 rounded-full bg-primary" /> Available</span><span className="flex items-center gap-1"><span className="size-2 rounded-full bg-muted" /> Unavailable</span></div></section>
    </div>
  </div>;
}

export function downloadIcs(a: Appt, title: string, end: Date) {
  const f = (d: Date) => d.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";
  const ics = [
    "BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//PearlSmile Dental//EN", "BEGIN:VEVENT",
    `UID:${a.id}@pearlsmile`, `DTSTAMP:${f(new Date())}`, `DTSTART:${f(new Date(a.start))}`, `DTEND:${f(end)}`,
    `SUMMARY:${title} — PearlSmile Dental`, `LOCATION:${CLINIC.address}`, "END:VEVENT", "END:VCALENDAR",
  ].join("\r\n");
  const url = URL.createObjectURL(new Blob([ics], { type: "text/calendar" }));
  const el = document.createElement("a");
  el.href = url;
  el.download = "pearlsmile-appointment.ics";
  el.click();
  URL.revokeObjectURL(url);
}
