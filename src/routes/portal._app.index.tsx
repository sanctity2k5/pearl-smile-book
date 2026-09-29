import { createFileRoute, Link } from "@tanstack/react-router";
import { AlertCircle, BellRing, Check, ChevronRight, Sparkles } from "lucide-react";
import { useState } from "react";
import { StatusPill } from "@/components/pearl";
import { CLINIC, fmtTime, getService, markConfirmed, naira, sameDay, sendReminder, useAppointments } from "@/lib/clinic";

export const Route = createFileRoute("/portal/_app/")({
  head: () => ({
    meta: [
      { title: "Dashboard — PearlSmile Dental Portal" },
      { name: "description", content: "Today's appointments, confirmations and deposits at PearlSmile Dental." },
      { property: "og:title", content: "Dashboard — PearlSmile Dental Portal" },
      { property: "og:description", content: "Only the appointments that need attention." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: Dashboard,
});

function Dashboard() {
  const appts = useAppointments();
  const [sent, setSent] = useState<Record<string, boolean>>({});
  const now = new Date();
  const today = appts
    .filter((a) => sameDay(new Date(a.start), now) && a.status !== "cancelled")
    .sort((a, b) => a.start.localeCompare(b.start));
  const confirmed = today.filter((a) => a.status === "confirmed").length;
  const attention = today.filter((a) => a.status === "needs_confirmation");
  const deposits = today.filter((a) => a.deposit === "paid").length * CLINIC.deposit;
  const scheduled = appts.filter((a) => {
    const t = new Date(a.start).getTime() - now.getTime();
    return a.status === "confirmed" && t > 0 && t < 48 * 3600000;
  }).length;
  const h = now.getHours();
  const greet = h < 12 ? "Good morning" : h < 17 ? "Good afternoon" : "Good evening";

  return (
    <main className="mx-auto max-w-7xl px-5 py-8">
      <p className="text-sm text-muted-foreground">{now.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" })}</p>
      <h1 className="font-display text-4xl md:text-5xl">{greet}</h1>

      <div className="mt-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
        <Stat label="Today's Appointments" value={String(today.length)} />
        <Stat label="Confirmed" value={String(confirmed)} tone="primary" />
        <Stat label="Needs Attention" value={String(attention.length)} tone={attention.length ? "warn" : undefined} />
        <Stat label="Deposits Collected" value={naira(deposits)} tone="gold" />
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_380px]">
        <section className="card-soft p-6">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-display text-2xl">Today's Schedule</h2>
            <Link to="/portal/calendar" className="text-sm font-semibold text-primary">Full calendar →</Link>
          </div>
          <ul className="divide-y">
            {today.map((a) => {
              const s = getService(a.serviceId);
              const past = new Date(a.start) < now;
              return (
                <li key={a.id}>
                  <Link to="/portal/appointments/$id" params={{ id: a.id }} className="-mx-3 flex items-center gap-4 rounded-md px-3 py-4 hover:bg-muted/60">
                    <span className={`w-20 shrink-0 text-sm font-semibold ${past ? "text-muted-foreground" : ""}`}>{fmtTime(a.start)}</span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate font-medium">{a.name}</span>
                      <span className="block truncate text-sm text-muted-foreground">{s.name} · {s.duration} min</span>
                    </span>
                    <span className="hidden sm:block"><StatusPill status={a.status} emergency={a.serviceId === "emergency"} /></span>
                    <ChevronRight className="size-4 shrink-0 text-muted-foreground" />
                  </Link>
                </li>
              );
            })}
          </ul>
        </section>

        <div className="space-y-6">
          <section className="card-soft border-warn/30 p-6">
            <h2 className="flex items-center gap-2 font-display text-2xl"><AlertCircle className="size-5 text-warn" /> Needs Attention</h2>
            {attention.length === 0 ? (
              <p className="mt-4 flex items-center gap-2 text-sm text-muted-foreground"><Check className="size-4 text-primary" /> Nothing needs you right now.</p>
            ) : (
              <ul className="mt-4 space-y-4">
                {attention.map((a) => (
                  <li key={a.id} className="rounded-lg bg-warn-soft p-4">
                    <Link to="/portal/appointments/$id" params={{ id: a.id }} className="font-semibold hover:underline">{a.name}</Link>
                    <p className="text-sm">Appointment today at {fmtTime(a.start)}</p>
                    <p className="mt-2 text-sm text-muted-foreground">"Reminder sent. Patient has not confirmed."</p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {sent[a.id] ? (
                        <span className="inline-flex items-center gap-1.5 rounded-md bg-card px-3 py-2 text-sm font-medium text-primary"><Check className="size-4" /> Reminder sent</span>
                      ) : (
                        <button className="btn-primary !px-4 !py-2 text-sm" onClick={() => { sendReminder(a.id); setSent({ ...sent, [a.id]: true }); }}>
                          <BellRing className="size-4" /> Send Reminder
                        </button>
                      )}
                      <button className="btn-outline !px-4 !py-2 text-sm" onClick={() => markConfirmed(a.id)}>Mark confirmed</button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </section>

          <section className="rounded-lg bg-secondary p-6">
            <p className="flex items-center gap-2 text-sm font-semibold text-primary"><Sparkles className="size-4" /> Automation</p>
            <p className="mt-2 font-display text-2xl leading-snug">{scheduled} appointment reminders are scheduled automatically.</p>
            <ul className="mt-4 space-y-2 text-sm text-secondary-foreground">
              <li className="flex gap-2"><Check className="mt-0.5 size-4 text-primary" /> Confirmations sent instantly on booking</li>
              <li className="flex gap-2"><Check className="mt-0.5 size-4 text-primary" /> WhatsApp + SMS reminders 24h before</li>
              <li className="flex gap-2"><Check className="mt-0.5 size-4 text-primary" /> Patients reschedule online — no calls</li>
            </ul>
          </section>
        </div>
      </div>
    </main>
  );
}

function Stat({ label, value, tone }: { label: string; value: string; tone?: "primary" | "warn" | "gold" }) {
  const c = tone === "primary" ? "text-primary" : tone === "warn" ? "text-warn" : tone === "gold" ? "text-gold" : "";
  return (
    <div className="card-soft p-5">
      <p className="text-sm text-muted-foreground">{label}</p>
      <p className={`mt-2 font-display text-4xl ${c}`}>{value}</p>
    </div>
  );
}
