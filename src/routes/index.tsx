import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, ArrowUpRight, CalendarDays, Clock3, MapPin, MessageCircle, ShieldCheck, Sparkles, Stethoscope, Zap, type LucideIcon } from "lucide-react";
import { useMemo } from "react";
import { SiteFooter, SiteHeader } from "@/components/pearl";
import { Button } from "@/components/ui/button";
import { CLINIC, SERVICES, addDays, fmtDate, fmtTime, sameDay, slotsFor, startOfDay, useAppointments, type ServiceId } from "@/lib/clinic";
import suite from "@/assets/clinic-suite.jpg";

export const Route = createFileRoute("/")({
  head: () => ({ meta: [
    { title: "PearlSmile Dental — Private dental care in Victoria Island, Lagos" },
    { name: "description", content: "Discover private dental care at PearlSmile Dental in Victoria Island. Choose your appointment and find an available time online." },
    { property: "og:title", content: "PearlSmile Dental — Private dental care in Victoria Island, Lagos" },
    { property: "og:description", content: "A calmer way to arrange dental care. Explore appointments and book your visit in Victoria Island, Lagos." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ] }),
  component: Landing,
});

const serviceIcons: Record<ServiceId, LucideIcon> = {
  new: Stethoscope,
  cleaning: Sparkles,
  cosmetic: Sparkles,
  emergency: Zap,
};
const whatsapp = `https://wa.me/${CLINIC.phone.replace(/\D/g, "")}`;

function Landing() {
  const appointments = useAppointments();
  const today = useMemo(() => startOfDay(new Date()), []);
  const nextRoutine = Array.from({ length: 21 }, (_, i) => addDays(today, i))
    .flatMap((day) => slotsFor(day, 60, appointments).filter((slot) => slot.available).slice(0, 1))[0];
  const nextUrgent = slotsFor(today, 30, appointments).find((slot) => slot.available);
  const nextLabel = nextRoutine
    ? `${sameDay(nextRoutine.time, today) ? "Today" : sameDay(nextRoutine.time, addDays(today, 1)) ? "Tomorrow" : fmtDate(nextRoutine.time)} at ${fmtTime(nextRoutine.time)}`
    : "See upcoming times";

  return <div className="flex min-h-screen flex-col">
    <SiteHeader />
    <main className="flex-1">
      <div className="border-b bg-card">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-x-8 gap-y-1 px-5 py-3 text-xs sm:text-sm">
          <p className="flex items-center gap-2 font-medium"><span className="size-2 shrink-0 rounded-full bg-primary" />{nextUrgent ? `Urgent appointment available today at ${fmtTime(nextUrgent.time)}` : "Looking for an appointment today?"}</p>
          <Button asChild variant="link" className="h-auto p-0 text-xs sm:text-sm"><Link to="/book" search={{ service: nextUrgent ? "emergency" : undefined }}>Explore open times <ArrowRight /></Link></Button>
        </div>
      </div>

      <section className="relative isolate flex min-h-[570px] items-center overflow-hidden bg-foreground py-16 text-primary-foreground sm:min-h-[610px] lg:min-h-[640px]">
        <img src={suite} alt="A light-filled private dental suite at PearlSmile Dental" className="absolute inset-0 -z-20 size-full object-cover object-[58%_center]" width={1408} height={880} fetchPriority="high" />
        <div className="landing-hero-overlay absolute inset-0 -z-10" />
        <div className="mx-auto w-full max-w-7xl px-5">
          <div className="max-w-[640px]">
            <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-primary-foreground/90"><span className="h-px w-9 bg-gold" /> PearlSmile Dental · Victoria Island</p>
            <h1 className="mt-7 font-display text-[clamp(2.8rem,4.8vw,4.75rem)] leading-[1.08]">A little more care, from the moment you arrive.</h1>
            <p className="mt-6 max-w-lg text-base leading-8 text-primary-foreground/90 sm:text-lg">Thoughtful, one-to-one dentistry in the heart of Lagos. Find a time that works for you and leave the waiting behind.</p>
            <div className="mt-9 flex flex-wrap gap-3">
              <Button asChild size="lg" className="h-12 px-6"><Link to="/book">Book an appointment <ArrowRight /></Link></Button>
              <Button asChild variant="outline" size="lg" className="h-12 border-primary-foreground/60 bg-card/90 px-6 text-foreground hover:bg-card"><a href={whatsapp} target="_blank" rel="noopener noreferrer"><MessageCircle /> WhatsApp us</a></Button>
            </div>
          </div>
        </div>
        <div className="absolute bottom-5 right-5 hidden border-l border-primary-foreground/70 pl-4 text-xs leading-5 text-primary-foreground/90 md:block">A private place for your smile<br />Victoria Island, Lagos</div>
      </section>

      <section className="border-b bg-card">
        <div className="mx-auto grid max-w-7xl divide-y px-5 py-6 md:grid-cols-3 md:divide-x md:divide-y-0 md:py-8">
          <div className="flex items-start gap-3 py-3 md:pr-7"><CalendarDays className="mt-0.5 size-5 shrink-0 text-primary" /><div><strong className="text-sm">A time reserved for you</strong><p className="mt-1 text-xs leading-5 text-muted-foreground">Appointments are planned around your visit, not a crowded waiting room.</p></div></div>
          <div className="flex items-start gap-3 py-3 md:px-7"><Clock3 className="mt-0.5 size-5 shrink-0 text-primary" /><div><strong className="text-sm">Book on your terms</strong><p className="mt-1 text-xs leading-5 text-muted-foreground">View available times and manage your appointment online.</p></div></div>
          <div className="flex items-start gap-3 py-3 md:pl-7"><ShieldCheck className="mt-0.5 size-5 shrink-0 text-primary" /><div><strong className="text-sm">Clear before you confirm</strong><p className="mt-1 text-xs leading-5 text-muted-foreground">See visit lengths, fees and any booking deposit upfront.</p></div></div>
        </div>
      </section>

      <section className="bg-background py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-5">
          <div className="mb-9 flex flex-wrap items-end justify-between gap-5">
            <div><p className="text-xs font-semibold uppercase tracking-widest text-primary">Care at PearlSmile</p><h2 className="mt-3 font-display text-3xl sm:text-4xl">Where would you like to begin?</h2><p className="mt-3 max-w-xl text-sm leading-6 text-muted-foreground">From a first visit to something more urgent, choose the care you need. You’ll see available times on the next page.</p></div>
            <p className="text-sm text-muted-foreground">Next routine opening <strong className="font-semibold text-foreground">{nextLabel}</strong></p>
          </div>
          <div className="grid gap-x-10 border-t md:grid-cols-2">
            {SERVICES.map((service) => {
              const Icon = serviceIcons[service.id];
              return <Link key={service.id} to="/book" search={{ service: service.id }} className="group flex min-h-36 items-start gap-4 border-b py-6 transition-colors hover:bg-secondary/40 sm:gap-5 sm:pr-4">
                <span className="grid size-11 shrink-0 place-items-center rounded-md bg-primary-soft text-primary"><Icon className="size-5" /></span>
                <span className="min-w-0 flex-1"><span className="block text-base font-semibold sm:text-lg">{service.name}</span><span className="mt-2 block text-sm leading-6 text-muted-foreground">{service.id === "new" ? "A thorough first visit to understand your dental health." : service.id === "cleaning" ? "A considered refresh for your teeth and gums." : service.id === "cosmetic" ? "Explore options for a smile that feels like yours." : "Support for sudden tooth pain and urgent concerns."}</span><span className="mt-3 block text-xs font-medium text-primary">{service.duration} minutes <span className="mx-1 text-muted-foreground">·</span> {service.price}</span></span>
                <ArrowUpRight className="mt-1 size-5 shrink-0 text-primary transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </Link>;
            })}
          </div>
        </div>
      </section>

      <section className="bg-secondary/65 py-14 sm:py-16">
        <div className="mx-auto grid max-w-7xl items-center gap-8 px-5 md:grid-cols-[1fr_auto]">
          <div><p className="text-xs font-semibold uppercase tracking-widest text-primary">Visit us</p><h2 className="mt-3 font-display text-3xl">Close to home, away from the rush.</h2><p className="mt-4 flex max-w-xl items-start gap-2 text-sm leading-6 text-muted-foreground"><MapPin className="mt-1 size-4 shrink-0 text-primary" />{CLINIC.address}</p><p className="mt-3 text-sm text-muted-foreground">{CLINIC.hours} · Sundays closed</p></div>
          <div className="flex flex-wrap gap-3"><Button asChild variant="outline" className="h-11 bg-card"><a href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(CLINIC.address)}`} target="_blank" rel="noopener noreferrer">Get directions <ArrowUpRight /></a></Button><Button asChild className="h-11"><Link to="/book">Find your appointment <ArrowRight /></Link></Button></div>
        </div>
      </section>
    </main>
    <SiteFooter />
  </div>;
}
