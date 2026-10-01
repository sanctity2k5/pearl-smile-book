import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, BellRing, CalendarClock, Mail, Phone, User, X } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { SlotPicker, StatusPill, Timeline } from "@/components/pearl";
import {
  CLINIC, cancelAppointment, fmtDate, fmtTime, getService, markConfirmed, naira, rescheduleAppointment, sendReminder, useAppointment,
} from "@/lib/clinic";

export const Route = createFileRoute("/portal/_app/appointments/$id")({
  head: () => ({
    meta: [
      { title: "Appointment details — PearlSmile Dental Portal" },
      { name: "description", content: "Appointment status, deposit and activity timeline." },
      { property: "og:title", content: "Appointment details — PearlSmile Dental Portal" },
      { property: "og:description", content: "Appointment status, deposit and activity timeline." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: Detail,
});

function Detail() {
  const { id } = Route.useParams();
  const a = useAppointment(id);
  const [mode, setMode] = useState<"view" | "reschedule">("view");
  const [showCancel, setShowCancel] = useState(false);
  const [time, setTime] = useState<Date | null>(null);
  useEffect(() => {
    if (!showCancel) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setShowCancel(false); };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => { window.removeEventListener("keydown", onKey); document.body.style.overflow = ""; };
  }, [showCancel]);
  if (!a) return <main className="mx-auto max-w-4xl px-5 py-16 text-center text-muted-foreground">Appointment not found.</main>;
  const s = getService(a.serviceId);
  const cancelled = a.status === "cancelled";
  const flash = (m: string, fn?: () => void) => {
    try { fn?.(); toast.success(m); return true; } catch (e) { toast.error((e as Error).message); return false; }
  };

  return (
    <main className="mx-auto max-w-5xl px-5 py-8">
      <Link to="/portal" className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground"><ArrowLeft className="size-4" /> Dashboard</Link>


      <div className="mt-4 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-4xl md:text-5xl">{a.name}</h1>
          <p className="mt-2 text-lg">{s.name}</p>
          <p className="text-muted-foreground">{fmtDate(a.start)} · {fmtTime(a.start)} · {s.duration} min</p>
        </div>
        {!cancelled && (
          <div className="flex flex-wrap gap-2">
            <button className="btn-outline" onClick={() => setMode("reschedule")}><CalendarClock className="size-4" /> Reschedule</button>
            <button className="btn-outline" onClick={() => setMode("cancel")}><X className="size-4" /> Cancel</button>
            <button className="btn-primary" onClick={() => flash("Reminder sent successfully.", () => sendReminder(a.id))}><BellRing className="size-4" /> Send Reminder</button>
          </div>
        )}
      </div>

      {mode === "reschedule" && (
        <section className="card-soft mt-6 p-6">
          <h2 className="mb-5 font-display text-2xl">Move to a new time</h2>
          <SlotPicker duration={s.duration} value={time} onChange={setTime} excludeId={a.id} />
          <div className="mt-6 flex gap-3">
            <button className="btn-primary" disabled={!time} onClick={() => { if (!time) return; if (flash("Rescheduled — patient notified.", () => rescheduleAppointment(a.id, time, "clinic"))) { setMode("view"); setTime(null); } }}>Confirm new time</button>
            <button className="btn-outline" onClick={() => setMode("view")}>Close</button>
          </div>
        </section>
      )}
      {mode === "cancel" && (
        <section className="card-soft mt-6 flex flex-wrap items-center justify-between gap-4 p-6">
          <p>Cancel this appointment? The patient will be notified{a.deposit === "paid" ? " and the deposit credited back" : ""}.</p>
          <div className="flex gap-2">
            <button className="btn-outline" onClick={() => setMode("view")}>Keep</button>
            <button className="btn-primary !bg-destructive" onClick={() => { flash("Appointment cancelled.", () => cancelAppointment(a.id, "clinic")); setMode("view"); }}>Cancel appointment</button>
          </div>
        </section>
      )}

      <div className="mt-8 grid gap-6 md:grid-cols-[1fr_1.1fr]">
        <div className="space-y-6">
          <section className="card-soft grid grid-cols-2 gap-5 p-6">
            <div>
              <p className="text-sm text-muted-foreground">Status</p>
              <div className="mt-1.5"><StatusPill status={a.status} emergency={a.serviceId === "emergency"} /></div>
              {a.status === "needs_confirmation" && (
                <button className="mt-3 text-sm font-semibold text-primary" onClick={() => flash("Marked as confirmed.", () => markConfirmed(a.id))}>Mark confirmed</button>
              )}
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Deposit</p>
              <p className="mt-1 text-lg font-semibold">
                {a.deposit === "paid" ? <span className="text-primary">{naira(CLINIC.deposit)} Paid</span> : a.deposit === "refunded" ? "Credited back" : "Not required"}
              </p>
            </div>
          </section>
          <section className="card-soft p-6">
            <h2 className="mb-4 font-display text-2xl">Patient information</h2>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center gap-3"><User className="size-4 text-primary" />{a.name}</li>
              <li className="flex items-center gap-3"><Phone className="size-4 text-primary" /><a href={`tel:${a.phone}`} className="hover:underline">{a.phone}</a></li>
              <li className="flex items-center gap-3"><Mail className="size-4 text-primary" /><a href={`mailto:${a.email}`} className="hover:underline">{a.email}</a></li>
              {a.reason && <li className="rounded-xl bg-muted px-3 py-2">Reason for visit: {a.reason}</li>}
            </ul>
          </section>
        </div>
        <section className="card-soft p-6">
          <h2 className="mb-5 font-display text-2xl">Activity</h2>
          <Timeline items={a.timeline} />
        </section>
      </div>
    </main>
  );
}
