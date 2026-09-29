import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";
import {
  CLINIC, addDays, apptEnd, fmtTime, getService, sameDay, startOfDay, useAppointments, weekStart, type Appt,
} from "@/lib/clinic";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/portal/_app/calendar")({
  head: () => ({
    meta: [
      { title: "Calendar — PearlSmile Dental Portal" },
      { name: "description", content: "Weekly clinic calendar for PearlSmile Dental." },
      { property: "og:title", content: "Calendar — PearlSmile Dental Portal" },
      { property: "og:description", content: "Weekly clinic calendar, Monday to Saturday." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: CalendarPage,
});

const HOUR = 72;
const OPEN = CLINIC.openHour * 60;
const CLOSE = CLINIC.closeHour * 60;
const mins = (d: Date) => d.getHours() * 60 + d.getMinutes();

function CalendarPage() {
  const appts = useAppointments();
  const nav = useNavigate();
  const [view, setView] = useState<"week" | "day">("week");
  const [anchor, setAnchor] = useState(() => startOfDay(new Date()));
  const today = startOfDay(new Date());
  const days = view === "week" ? Array.from({ length: 6 }, (_, i) => addDays(weekStart(anchor), i)) : [anchor];
  const step = (n: number) => {
    let d = addDays(anchor, view === "week" ? 7 * n : n);
    if (view === "day" && d.getDay() === 0) d = addDays(d, n);
    setAnchor(d);
  };
  const label =
    view === "week"
      ? `${days[0].toLocaleDateString("en-US", { month: "short", day: "numeric" })} – ${days[5].toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}`
      : anchor.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" });
  const hours = Array.from({ length: CLINIC.closeHour - CLINIC.openHour }, (_, i) => CLINIC.openHour + i);

  return (
    <main className="mx-auto max-w-7xl px-5 py-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-4xl">Calendar</h1>
          <p className="text-muted-foreground">{label} · {CLINIC.hours}</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex rounded-full border bg-card p-1">
            {(["day", "week"] as const).map((v) => (
              <button key={v} onClick={() => { setView(v); if (v === "day" && anchor.getDay() === 0) setAnchor(addDays(anchor, 1)); }} className={cn("rounded-full px-4 py-1.5 text-sm font-medium capitalize", view === v ? "bg-primary text-primary-foreground" : "text-muted-foreground")}>{v}</button>
            ))}
          </div>
          <button className="btn-outline !px-4 !py-2 text-sm" onClick={() => setAnchor(today.getDay() === 0 ? addDays(today, 1) : today)}>Today</button>
          <button aria-label="Previous" className="btn-outline !p-2.5" onClick={() => step(-1)}><ChevronLeft className="size-4" /></button>
          <button aria-label="Next" className="btn-outline !p-2.5" onClick={() => step(1)}><ChevronRight className="size-4" /></button>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap gap-4 text-xs text-muted-foreground">
        <Legend cls="bg-primary-soft border-l-primary" label="Confirmed" />
        <Legend cls="bg-warn-soft border-l-warn" label="Needs confirmation" />
        <Legend cls="bg-urgent-soft border-l-urgent" label="Emergency" />
        <Legend cls="border border-dashed border-primary/40 bg-card" label="Available" />
      </div>

      <div className="card-soft mt-5 overflow-x-auto">
        <div className={cn("grid", view === "week" ? "min-w-[860px]" : "")} style={{ gridTemplateColumns: `64px repeat(${days.length}, 1fr)` }}>
          <div className="border-b" />
          {days.map((d) => (
            <button key={d.toISOString()} onClick={() => { setAnchor(d); setView("day"); }} className={cn("border-b border-l px-3 py-3 text-left", sameDay(d, today) && "bg-primary-soft/50")}>
              <span className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground">{d.toLocaleDateString("en-US", { weekday: "short" })}</span>
              <span className={cn("font-display text-2xl", sameDay(d, today) && "text-primary")}>{d.getDate()}</span>
            </button>
          ))}

          <div className="relative">
            {hours.map((h) => (
              <div key={h} style={{ height: HOUR }} className="pr-2 pt-1 text-right text-[11px] text-muted-foreground">
                {fmtTime(new Date(2000, 0, 1, h))}
              </div>
            ))}
          </div>
          {days.map((d) => {
            const list = appts.filter((a) => a.status !== "cancelled" && sameDay(new Date(a.start), d)).sort((a, b) => a.start.localeCompare(b.start));
            return (
              <div key={d.toISOString()} className="relative border-l" style={{ height: HOUR * hours.length }}>
                {hours.map((h, i) => <div key={h} className="absolute inset-x-0 border-t border-border/60" style={{ top: i * HOUR }} />)}
                {gaps(list, d).map(([s, e]) => (
                  <div key={s} className="absolute inset-x-1.5 flex items-center justify-center rounded-lg border border-dashed border-primary/30 text-[11px] font-medium text-primary/70" style={{ top: ((s - OPEN) / 60) * HOUR + 2, height: ((e - s) / 60) * HOUR - 4 }}>
                    {e - s >= 45 ? "Open" : ""}
                  </div>
                ))}
                {list.map((a) => <Block key={a.id} a={a} onClick={() => nav({ to: "/portal/appointments/$id", params: { id: a.id } })} wide={view === "day"} />)}
              </div>
            );
          })}
        </div>
      </div>
    </main>
  );
}

function gaps(list: Appt[], d: Date): [number, number][] {
  if (d.getDay() === 0 || d < startOfDay(new Date())) return [];
  const out: [number, number][] = [];
  let cur = OPEN;
  if (sameDay(d, new Date())) cur = Math.max(OPEN, Math.ceil(mins(new Date()) / 30) * 30);
  for (const a of list) {
    const s = mins(new Date(a.start));
    if (s - cur >= 30) out.push([cur, s]);
    cur = Math.max(cur, mins(apptEnd(a)));
  }
  if (CLOSE - cur >= 30) out.push([cur, CLOSE]);
  return out;
}

function Block({ a, onClick, wide }: { a: Appt; onClick: () => void; wide: boolean }) {
  const s = getService(a.serviceId);
  const start = mins(new Date(a.start));
  const cls =
    a.status === "needs_confirmation" ? "bg-warn-soft border-l-warn" : a.serviceId === "emergency" ? "bg-urgent-soft border-l-urgent" : "bg-primary-soft border-l-primary";
  return (
    <button
      onClick={onClick}
      className={cn("absolute inset-x-1.5 overflow-hidden rounded-lg border-l-[3px] px-2.5 py-1.5 text-left transition hover:brightness-95", cls)}
      style={{ top: ((start - OPEN) / 60) * HOUR + 2, height: (s.duration / 60) * HOUR - 4 }}
    >
      <p className="truncate text-xs font-semibold">{a.name}</p>
      <p className="truncate text-[11px] text-muted-foreground">{fmtTime(a.start)}{wide || s.duration >= 45 ? ` · ${s.name}` : ""}</p>
    </button>
  );
}

function Legend({ cls, label }: { cls: string; label: string }) {
  return <span className="flex items-center gap-1.5"><span className={cn("h-3 w-4 rounded border-l-[3px] border-l-transparent", cls)} />{label}</span>;
}
