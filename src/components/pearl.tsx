import { Link } from "@tanstack/react-router";
import { CalendarCheck2, Check, ChevronLeft, ChevronRight, Zap } from "lucide-react";
import { useMemo, useState } from "react";
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

export function Logo({ sub }: { sub?: string }) {
  return (
    <Link to="/" className="flex items-center gap-3">
      <span className="grid size-9 place-items-center rounded-full border border-gold/50 bg-card">
        <svg viewBox="0 0 24 24" className="size-5 text-primary" fill="none" stroke="currentColor" strokeWidth="1.6">
          <path d="M7 3.5c-2.2 0-3.5 1.8-3.5 4.3 0 3 1.2 4.2 1.8 7.4.5 2.8 1 5.3 2.3 5.3 1.6 0 1.5-4.8 4.4-4.8s2.8 4.8 4.4 4.8c1.3 0 1.8-2.5 2.3-5.3.6-3.2 1.8-4.4 1.8-7.4 0-2.5-1.3-4.3-3.5-4.3-2 0-3 1.2-5 1.2S9 3.5 7 3.5Z" />
        </svg>
      </span>
      <span className="leading-tight">
        <span className="block font-display text-xl text-foreground">{CLINIC.name}</span>
        <span className="block text-xs text-muted-foreground">{sub ?? CLINIC.city}</span>
      </span>
    </Link>
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

/** Date strip + slot grid. Availability respects the service duration. */
export function SlotPicker({
  duration,
  value,
  onChange,
  excludeId,
  emergency,
}: {
  duration: number;
  value: Date | null;
  onChange: (d: Date) => void;
  excludeId?: string;
  emergency?: boolean;
}) {
  const appts = useAppointments();
  const today = startOfDay(new Date());
  const [day, setDay] = useState<Date>(() => (value ? startOfDay(value) : today));
  const [windowStart, setWindowStart] = useState<Date>(today);
  const days = Array.from({ length: 7 }, (_, i) => addDays(windowStart, i));

  const count = (d: Date) => slotsFor(d, duration, appts, excludeId).filter((s) => s.available).length;
  const slots = useMemo(() => slotsFor(day, duration, appts, excludeId), [day, duration, appts, excludeId]);
  const todayFree = useMemo(
    () => slotsFor(today, duration, appts, excludeId).filter((s) => s.available),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [duration, appts, excludeId],
  );

  const go = (d: Date) => {
    if (d < today) return;
    setDay(d);
    if (d < windowStart || d >= addDays(windowStart, 7)) setWindowStart(d < windowStart ? d : addDays(d, -6));
  };

  const groups = [
    ["Morning", slots.filter((s) => s.time.getHours() < 12)],
    ["Afternoon", slots.filter((s) => s.time.getHours() >= 12 && s.time.getHours() < 16)],
    ["Evening", slots.filter((s) => s.time.getHours() >= 16)],
  ] as const;

  return (
    <div className="space-y-6">
      {emergency && todayFree.length > 0 && (
        <div className="flex flex-col gap-4 rounded-2xl border border-urgent/25 bg-urgent-soft p-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex gap-3">
            <Zap className="mt-0.5 size-5 shrink-0 text-urgent" />
            <div>
              <p className="font-semibold">Same-day emergency slot available</p>
              <p className="text-sm text-muted-foreground">
                The dentist can see you today at {fmtTime(todayFree[0].time)}.
              </p>
            </div>
          </div>
          <button
            className="btn-primary shrink-0"
            onClick={() => {
              go(today);
              onChange(todayFree[0].time);
            }}
          >
            Take today {fmtTime(todayFree[0].time)}
          </button>
        </div>
      )}

      <div className="flex items-center justify-between gap-3">
        <p className="font-display text-2xl">{day.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}</p>
        <div className="flex items-center gap-2">
          <button className="btn-outline !px-4 !py-2 text-sm" onClick={() => go(today)} disabled={sameDay(day, today)}>
            Today
          </button>
          <button aria-label="Previous day" className="btn-outline !p-2.5" onClick={() => go(addDays(day, -1))} disabled={sameDay(day, today)}>
            <ChevronLeft className="size-4" />
          </button>
          <button aria-label="Next day" className="btn-outline !p-2.5" onClick={() => go(addDays(day, 1))}>
            <ChevronRight className="size-4" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-1.5 sm:gap-2">
        {days.map((d) => {
          const closed = d.getDay() === 0;
          const c = closed ? 0 : count(d);
          const sel = sameDay(d, day);
          return (
            <button
              key={d.toISOString()}
              onClick={() => go(d)}
              disabled={closed}
              className={cn(
                "flex flex-col items-center rounded-2xl border px-1 py-3 transition",
                sel ? "border-primary bg-primary text-primary-foreground" : "border-border bg-card hover:border-primary/50",
                closed && "opacity-40",
              )}
            >
              <span className="text-[11px] font-medium uppercase tracking-wider opacity-75">
                {sameDay(d, today) ? "Today" : d.toLocaleDateString("en-US", { weekday: "short" })}
              </span>
              <span className="font-display text-2xl">{d.getDate()}</span>
              <span className={cn("mt-0.5 text-[10px] sm:text-[11px]", !sel && (c === 0 ? "text-muted-foreground" : c <= 3 ? "text-warn" : "text-primary"))}>
                {closed ? "Closed" : c === 0 ? "Full" : `${c} open`}
              </span>
            </button>
          );
        })}
      </div>

      {day.getDay() === 6 && (
        <p className="rounded-xl bg-gold-soft px-4 py-2.5 text-sm text-foreground">
          Saturday appointments fill quickly — we recommend booking early.
        </p>
      )}

      {slots.length === 0 ? (
        <p className="rounded-2xl border border-dashed p-8 text-center text-muted-foreground">We're closed on Sundays.</p>
      ) : slots.every((s) => !s.available) ? (
        <div className="rounded-2xl border border-dashed p-8 text-center">
          <p className="font-medium">No openings on this day</p>
          <button className="mt-3 text-sm font-semibold text-primary" onClick={() => go(addDays(day, 1))}>
            Check the next day →
          </button>
        </div>
      ) : (
        <div className="space-y-5">
          {groups.map(([label, list]) =>
            list.length ? (
              <div key={label}>
                <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">{label}</p>
                <div className="grid grid-cols-3 gap-2 sm:grid-cols-4 md:grid-cols-5">
                  {list.map((s) => {
                    const sel = value && value.getTime() === s.time.getTime();
                    return (
                      <button
                        key={s.time.toISOString()}
                        disabled={!s.available}
                        onClick={() => onChange(s.time)}
                        className={cn(
                          "rounded-full border py-2.5 text-sm font-semibold transition",
                          sel
                            ? "border-primary bg-primary text-primary-foreground"
                            : s.available
                              ? "border-primary/30 bg-card text-foreground hover:border-primary hover:bg-primary-soft"
                              : "cursor-not-allowed border-transparent bg-muted text-muted-foreground/60 line-through",
                        )}
                      >
                        {fmtTime(s.time)}
                      </button>
                    );
                  })}
                </div>
              </div>
            ) : null,
          )}
          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <span className="flex items-center gap-1.5"><span className="size-3 rounded-full border border-primary/40 bg-card" /> Available</span>
            <span className="flex items-center gap-1.5"><span className="size-3 rounded-full bg-muted" /> Unavailable</span>
            <span className="flex items-center gap-1.5"><CalendarCheck2 className="size-3.5" /> {duration} min appointment</span>
          </div>
        </div>
      )}
    </div>
  );
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
