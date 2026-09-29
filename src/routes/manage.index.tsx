import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { useState } from "react";
import { Logo } from "@/components/pearl";
import { fmtDate, fmtTime, getService, useAppointments } from "@/lib/clinic";

export const Route = createFileRoute("/manage/")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Manage your booking — PearlSmile Dental" },
      { name: "description", content: "Find, reschedule or cancel your PearlSmile Dental appointment." },
      { property: "og:title", content: "Manage your booking — PearlSmile Dental" },
      { property: "og:description", content: "Reschedule or cancel online — no phone call needed." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Find,
});

function Find() {
  const appts = useAppointments();
  const [q, setQ] = useState("");
  const digits = q.replace(/\D/g, "");
  const found =
    q.trim().length < 3
      ? []
      : appts.filter(
          (a) =>
            a.status !== "cancelled" &&
            new Date(a.start) > new Date() &&
            (a.id.toLowerCase() === q.trim().toLowerCase() || (digits.length >= 7 && a.phone.replace(/\D/g, "").endsWith(digits.slice(-7)))),
        );
  return (
    <div className="min-h-screen">
      <header className="mx-auto max-w-6xl px-5 py-6"><Logo /></header>
      <main className="mx-auto max-w-lg px-5 pt-10">
        <h1 className="font-display text-4xl">Manage your booking</h1>
        <p className="mt-3 text-muted-foreground">Enter your booking reference (e.g. PS-4K2QX) or the phone number you booked with.</p>
        <input className="field mt-6" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Reference or phone number" />
        <div className="mt-6 space-y-3">
          {found.map((a) => (
            <Link key={a.id} to="/manage/$id" params={{ id: a.id }} className="card-soft flex items-center justify-between p-5 hover:border-primary/40">
              <div>
                <p className="font-semibold">{getService(a.serviceId).name}</p>
                <p className="text-sm text-muted-foreground">{fmtDate(a.start)} · {fmtTime(a.start)}</p>
              </div>
              <ArrowRight className="size-4 text-primary" />
            </Link>
          ))}
          {q.trim().length >= 3 && found.length === 0 && <p className="text-sm text-muted-foreground">No upcoming appointments match yet.</p>}
        </div>
      </main>
    </div>
  );
}
