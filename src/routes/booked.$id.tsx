import { createFileRoute, Link } from "@tanstack/react-router";
import { BellRing, CalendarPlus, Check, MessageCircle } from "lucide-react";
import { Logo, downloadIcs } from "@/components/pearl";
import { CLINIC, apptEnd, fmtDate, fmtTime, getService, naira, useAppointment } from "@/lib/clinic";

export const Route = createFileRoute("/booked/$id")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "You're booked — PearlSmile Dental" },
      { name: "description", content: "Your PearlSmile Dental appointment is confirmed." },
      { property: "og:title", content: "You're booked — PearlSmile Dental" },
      { property: "og:description", content: "Your appointment is confirmed. A reminder will be sent before your visit." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: Booked,
});

function Booked() {
  const { id } = Route.useParams();
  const a = useAppointment(id);
  if (!a) return <Missing />;
  const s = getService(a.serviceId);

  return (
    <div className="min-h-screen">
      <header className="mx-auto max-w-6xl px-5 py-6"><Logo /></header>
      <main className="mx-auto max-w-xl px-5 pb-20 pt-6 text-center">
        <span className="mx-auto grid size-16 place-items-center rounded-full bg-primary text-primary-foreground animate-in zoom-in-50 duration-500">
          <Check className="size-8" strokeWidth={2.5} />
        </span>
        <h1 className="mt-6 font-display text-5xl md:text-6xl">You're booked.</h1>
        <p className="mx-auto mt-4 max-w-md text-muted-foreground">
          Your appointment has been confirmed. We'll send you a reminder before your visit.
        </p>

        <div className="card-soft mt-10 overflow-hidden text-left">
          <div className="border-b bg-secondary/60 px-7 py-5">
            <p className="font-display text-xl">{CLINIC.name}</p>
            <p className="text-sm text-muted-foreground">{CLINIC.city}</p>
          </div>
          <div className="space-y-6 p-7">
            <div>
              <p className="font-display text-3xl">{fmtDate(a.start)}</p>
              <p className="text-2xl text-primary">{fmtTime(a.start)}</p>
              <p className="mt-2 font-medium">{s.name}</p>
            </div>
            <dl className="grid grid-cols-2 gap-4 border-t pt-5 text-sm">
              <Item k="Patient" v={a.name} />
              <Item k="Duration" v={`${s.duration} minutes`} />
              <Item k="Deposit" v={a.deposit === "paid" ? `${naira(CLINIC.deposit)} paid` : "Not required"} />
              <Item k="Reference" v={a.id} />
              <div className="col-span-2"><Item k="Location" v={CLINIC.address} /></div>
            </dl>
          </div>
        </div>

        <div className="mt-6 grid gap-3 text-left text-sm sm:grid-cols-2">
          <p className="flex items-center gap-2.5 rounded-2xl bg-card px-4 py-3 ring-1 ring-border"><MessageCircle className="size-4 text-primary" /> Confirmation sent to WhatsApp</p>
          <p className="flex items-center gap-2.5 rounded-2xl bg-card px-4 py-3 ring-1 ring-border"><BellRing className="size-4 text-primary" /> Reminder set for 24h before</p>
        </div>

        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <button className="btn-primary" onClick={() => downloadIcs(a, s.name, apptEnd(a))}><CalendarPlus className="size-4" /> Add to Calendar</button>
          <Link to="/manage/$id" params={{ id: a.id }} className="btn-outline">Manage Appointment</Link>
        </div>
      </main>
    </div>
  );
}

function Item({ k, v }: { k: string; v: string }) {
  return (
    <div>
      <dt className="text-muted-foreground">{k}</dt>
      <dd className="font-medium">{v}</dd>
    </div>
  );
}

export function Missing() {
  return (
    <div className="grid min-h-screen place-items-center px-5 text-center">
      <div>
        <p className="font-display text-3xl">We couldn't find that appointment</p>
        <Link to="/manage" className="btn-outline mt-6">Find my booking</Link>
      </div>
    </div>
  );
}
