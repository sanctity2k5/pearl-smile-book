import { createFileRoute, Link } from "@tanstack/react-router";
import { CalendarClock, Check, MapPin, Phone } from "lucide-react";
import { useState } from "react";
import { SiteHeader, SiteFooter, SlotPicker, StatusPill } from "@/components/pearl";
import { CLINIC, cancelAppointment, fmtDate, fmtTime, getService, naira, rescheduleAppointment, useAppointment } from "@/lib/clinic";
import { Missing } from "./booked.$id";

export const Route = createFileRoute("/manage/$id")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Your appointment — PearlSmile Dental" },
      { name: "description", content: "View, reschedule or cancel your PearlSmile Dental appointment." },
      { property: "og:title", content: "Your appointment — PearlSmile Dental" },
      { property: "og:description", content: "Reschedule to any open time online." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: Manage,
});

function Manage() {
  const { id } = Route.useParams();
  const a = useAppointment(id);
  const [mode, setMode] = useState<"view" | "reschedule" | "cancel">("view");
  const [time, setTime] = useState<Date | null>(null);
  const [notice, setNotice] = useState("");
  if (!a) return <Missing />;
  const s = getService(a.serviceId);
  const cancelled = a.status === "cancelled";

  return (
    <div className="flex min-h-screen flex-col"><SiteHeader />
      <main className="mx-auto w-full max-w-3xl flex-1 px-5 py-12">
        <p className="text-sm text-muted-foreground">Reference {a.id}</p>
        <h1 className="mt-1 font-display text-4xl md:text-5xl">Your appointment</h1>

        {notice && (
          <p className="mt-6 flex items-center gap-2 rounded-2xl bg-primary-soft px-4 py-3 text-sm font-medium text-primary animate-in fade-in">
            <Check className="size-4" /> {notice}
          </p>
        )}

        <div className="card-soft mt-6 p-7">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className="font-display text-3xl">{fmtDate(a.start)}</p>
              <p className="text-xl text-primary">{fmtTime(a.start)}</p>
            </div>
            <StatusPill status={a.status} />
          </div>
          <dl className="mt-6 grid gap-5 border-t pt-6 text-sm sm:grid-cols-3">
            <div><dt className="text-muted-foreground">Service</dt><dd className="font-medium">{s.name} · {s.duration} min</dd></div>
            <div>
              <dt className="text-muted-foreground">Deposit</dt>
              <dd className="font-medium">{a.deposit === "paid" ? `${naira(CLINIC.deposit)} paid` : a.deposit === "refunded" ? "Credited back" : "Not required"}</dd>
            </div>
            <div><dt className="text-muted-foreground">Patient</dt><dd className="font-medium">{a.name}</dd></div>
          </dl>
          <div className="mt-6 flex flex-col gap-2 rounded-2xl bg-secondary/60 p-4 text-sm sm:flex-row sm:gap-6">
            <span className="flex items-center gap-2"><MapPin className="size-4 text-primary" />{CLINIC.address}</span>
            <span className="flex items-center gap-2"><Phone className="size-4 text-primary" />{CLINIC.phone}</span>
          </div>

          {!cancelled && mode === "view" && (
            <div className="mt-6 flex flex-wrap gap-3">
              <button className="btn-primary" onClick={() => { setMode("reschedule"); setNotice(""); }}><CalendarClock className="size-4" /> Reschedule</button>
              <button className="btn-outline" onClick={() => { setMode("cancel"); setNotice(""); }}>Cancel Appointment</button>
            </div>
          )}
        </div>

        {mode === "reschedule" && (
          <section className="card-soft mt-6 p-7">
            <h2 className="mb-6 font-display text-2xl">Pick a new time</h2>
            <SlotPicker duration={s.duration} value={time} onChange={setTime} excludeId={a.id} />
            <div className="mt-6 flex flex-wrap gap-3">
              <button
                className="btn-primary"
                disabled={!time}
                onClick={() => {
                  if (!time) return;
                  rescheduleAppointment(a.id, time, "patient");
                  setNotice(`Rescheduled to ${fmtDate(time)} at ${fmtTime(time)}. Your deposit carries over and a new reminder is set.`);
                  setMode("view");
                  setTime(null);
                }}
              >
                Confirm new time
              </button>
              <button className="btn-outline" onClick={() => setMode("view")}>Keep current time</button>
            </div>
          </section>
        )}

        {mode === "cancel" && (
          <section className="card-soft mt-6 p-7">
            <h2 className="font-display text-2xl">Cancel this appointment?</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              {a.deposit === "paid" ? "Your deposit will be credited back. " : ""}Would rescheduling work better? Openings are often available this week.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <button className="btn-primary" onClick={() => setMode("reschedule")}>Reschedule instead</button>
              <button
                className="btn-outline !border-destructive/40 !text-destructive"
                onClick={() => {
                  cancelAppointment(a.id, "patient");
                  setNotice("Your appointment has been cancelled. The clinic has been notified.");
                  setMode("view");
                }}
              >
                Yes, cancel
              </button>
            </div>
          </section>
        )}
        {cancelled && (
          <Link to="/book" search={{ service: a.serviceId }} className="btn-primary mt-6">Book a new time</Link>
        )}
      </main><SiteFooter />
    </div>
  );
}
