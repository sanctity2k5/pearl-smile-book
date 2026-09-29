import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, CalendarClock, Clock, MapPin, ShieldCheck, Sun } from "lucide-react";
import { Logo } from "@/components/pearl";
import { CLINIC, SERVICES } from "@/lib/clinic";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "PearlSmile Dental — Book a dentist in Lagos" },
      { name: "description", content: "Modern private dental care in Lagos. Choose a service, find a time and confirm your appointment in minutes." },
      { property: "og:title", content: "PearlSmile Dental — Book a dentist in Lagos" },
      { property: "og:description", content: "Modern dental care, without the waiting room hassle." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Landing,
});

function Landing() {
  return (
    <div className="min-h-screen">
      <header className="mx-auto flex max-w-6xl items-center justify-between px-5 py-6">
        <Logo />
        <nav className="flex items-center gap-5 text-sm">
          <Link to="/manage" className="hidden font-medium text-muted-foreground hover:text-foreground sm:block">Manage booking</Link>
          <Link to="/book" className="btn-primary !px-4 !py-2 text-sm">Book</Link>
        </nav>
      </header>

      <main className="mx-auto max-w-6xl px-5">
        <section className="grid gap-12 pb-16 pt-10 md:grid-cols-[1.15fr_1fr] md:pt-16">
          <div>
            <p className="mb-5 inline-flex items-center gap-2 rounded-full border border-gold/40 bg-gold-soft px-3 py-1 text-xs font-semibold text-foreground">
              <MapPin className="size-3.5 text-gold" /> {CLINIC.city}
            </p>
            <h1 className="font-display text-5xl leading-[1.05] md:text-6xl">
              Modern dental care, without the waiting room hassle.
            </h1>
            <p className="mt-6 max-w-lg text-lg text-muted-foreground">
              Choose a service, find a convenient time, and confirm your appointment in minutes.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <Link to="/book" className="btn-primary !px-7 !py-4 text-base">
                Book an Appointment <ArrowRight className="size-4" />
              </Link>
              <span className="text-sm text-muted-foreground">{CLINIC.hours}</span>
            </div>
          </div>

          <aside className="card-soft space-y-5 self-end p-7">
            {[
              [Sun, "Same-day appointments", "Available when slots are open — see live availability instantly."],
              [CalendarClock, "Saturday fills quickly", "Weekend appointments are popular. Book early to secure yours."],
              [ShieldCheck, "Booking deposit", "A ₦10,000 deposit may be required for selected appointments."],
            ].map(([Icon, t, d]) => {
              const I = Icon as typeof Sun;
              return (
                <div key={t as string} className="flex gap-4">
                  <span className="grid size-10 shrink-0 place-items-center rounded-full bg-secondary text-primary">
                    <I className="size-5" />
                  </span>
                  <div>
                    <p className="font-semibold">{t as string}</p>
                    <p className="text-sm text-muted-foreground">{d as string}</p>
                  </div>
                </div>
              );
            })}
          </aside>
        </section>

        <section className="border-t pb-20 pt-12">
          <div className="mb-6 flex items-end justify-between">
            <h2 className="font-display text-3xl">Our appointments</h2>
            <Link to="/book" className="text-sm font-semibold text-primary">View all →</Link>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {SERVICES.map((s) => (
              <Link
                key={s.id}
                to="/book"
                search={{ service: s.id }}
                className="card-soft group flex flex-col justify-between gap-6 p-6 transition hover:border-primary/40"
              >
                <div>
                  <p className="font-semibold">{s.name}</p>
                  <p className="mt-1 text-sm text-muted-foreground">{s.description}</p>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="inline-flex items-center gap-1.5 text-muted-foreground"><Clock className="size-4" />{s.duration} min</span>
                  <ArrowRight className="size-4 text-primary transition group-hover:translate-x-1" />
                </div>
              </Link>
            ))}
          </div>
        </section>
      </main>

      <footer className="border-t">
        <div className="mx-auto flex max-w-6xl flex-col gap-2 px-5 py-8 text-sm text-muted-foreground sm:flex-row sm:justify-between">
          <span>{CLINIC.address} · {CLINIC.phone}</span>
          <Link to="/portal/login" className="hover:text-foreground">Clinic portal</Link>
        </div>
      </footer>
    </div>
  );
}
