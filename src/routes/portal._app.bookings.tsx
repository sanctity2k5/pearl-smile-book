import { createFileRoute, Link } from "@tanstack/react-router";
import { ChevronRight, Inbox } from "lucide-react";
import { useState } from "react";
import { StatusPill } from "@/components/pearl";
import { bookedAt, fmtDate, fmtTime, getService, isOnlineBooking, useAppointments } from "@/lib/clinic";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/portal/_app/bookings")({
  head: () => ({
    meta: [
      { title: "Bookings — PearlSmile Dental Portal" },
      { name: "description", content: "Every appointment booked online and upcoming at PearlSmile Dental." },
      { property: "og:title", content: "Bookings — PearlSmile Dental Portal" },
      { property: "og:description", content: "Online bookings and upcoming appointments." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: Bookings,
});

const tabs = [
  { id: "online", label: "New online bookings" },
  { id: "upcoming", label: "All upcoming" },
  { id: "cancelled", label: "Cancelled" },
] as const;

function Bookings() {
  const appts = useAppointments();
  const [tab, setTab] = useState<(typeof tabs)[number]["id"]>("online");
  const now = new Date();
  const list =
    tab === "online"
      ? appts.filter(isOnlineBooking).sort((a, b) => bookedAt(b).localeCompare(bookedAt(a)))
      : tab === "cancelled"
        ? appts.filter((a) => a.status === "cancelled").sort((a, b) => b.start.localeCompare(a.start))
        : appts.filter((a) => a.status !== "cancelled" && new Date(a.start) >= now).sort((a, b) => a.start.localeCompare(b.start));

  return (
    <main className="mx-auto w-full max-w-6xl px-5 py-8">
      <h1 className="font-display text-4xl">Bookings</h1>
      <p className="text-muted-foreground">Appointments saved from the patient booking page appear here instantly.</p>
      <div className="mt-6 flex flex-wrap gap-2">
        {tabs.map((t) => (
          <button key={t.id} onClick={() => setTab(t.id)} className={cn("rounded-full border px-4 py-1.5 text-sm font-medium", tab === t.id ? "border-primary bg-primary text-primary-foreground" : "bg-card text-muted-foreground")}>{t.label}</button>
        ))}
      </div>
      <section className="card-soft mt-5 p-2 sm:p-4">
        {list.length === 0 ? (
          <div className="flex flex-col items-center gap-2 py-16 text-center text-muted-foreground">
            <Inbox className="size-8" />
            <p>{tab === "online" ? "No online bookings yet. New patient bookings will show here." : "Nothing here yet."}</p>
          </div>
        ) : (
          <ul className="divide-y">
            {list.map((a) => {
              const s = getService(a.serviceId);
              return (
                <li key={a.id}>
                  <Link to="/portal/appointments/$id" params={{ id: a.id }} className="flex items-center gap-4 rounded-md px-3 py-4 hover:bg-muted/60">
                    <span className="w-36 shrink-0 text-sm"><span className="block font-semibold">{fmtDate(a.start)}</span><span className="text-muted-foreground">{fmtTime(a.start)}</span></span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate font-medium">{a.name} {isOnlineBooking(a) && <span className="ml-1 text-xs text-primary">· {a.id}</span>}</span>
                      <span className="block truncate text-sm text-muted-foreground">{s.name} · {s.duration} min</span>
                    </span>
                    <span className="hidden sm:block"><StatusPill status={a.status} emergency={a.serviceId === "emergency"} /></span>
                    <ChevronRight className="size-4 shrink-0 text-muted-foreground" />
                  </Link>
                </li>
              );
            })}
          </ul>
        )}
      </section>
    </main>
  );
}
