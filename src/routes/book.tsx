import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { ArrowLeft, Check, Clock, CreditCard, Loader2, Lock, X } from "lucide-react";
import { useState } from "react";
import { z } from "zod";
import { Logo, SlotPicker } from "@/components/pearl";
import { CLINIC, SERVICES, createAppointment, fmtDate, fmtTime, getService, naira, type ServiceId } from "@/lib/clinic";
import { cn } from "@/lib/utils";

const search = z.object({ service: z.enum(["new", "cleaning", "cosmetic", "emergency"]).optional() });

export const Route = createFileRoute("/book")({
  ssr: false,
  validateSearch: (s) => search.parse(s),
  head: () => ({
    meta: [
      { title: "Book an appointment — PearlSmile Dental" },
      { name: "description", content: "Pick a service and a live available time at PearlSmile Dental, Lagos." },
      { property: "og:title", content: "Book an appointment — PearlSmile Dental" },
      { property: "og:description", content: "See real availability and confirm your dental appointment in minutes." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Book,
});

const REASONS = ["New patient", "Routine cleaning", "Tooth pain", "Consultation", "Other"];
const STEPS = ["Service", "Date & time", "Your details"];

function Book() {
  const { service } = Route.useSearch();
  const navigate = useNavigate();
  const [step, setStep] = useState(service ? 1 : 0);
  const [sid, setSid] = useState<ServiceId | null>(service ?? null);
  const [time, setTime] = useState<Date | null>(null);
  const [form, setForm] = useState({ name: "", phone: "", email: "", reason: "" });
  const [paying, setPaying] = useState<"idle" | "open" | "processing">("idle");
  const s = sid ? getService(sid) : null;
  const valid = form.name.trim().length > 1 && form.phone.replace(/\D/g, "").length >= 10 && /\S+@\S+\.\S+/.test(form.email);

  const finish = () => {
    if (!s || !time) return;
    const a = createAppointment({ ...form, serviceId: s.id, start: time, reason: form.reason || undefined });
    navigate({ to: "/booked/$id", params: { id: a.id } });
  };
  const confirm = () => {
    if (s?.deposit) setPaying("open");
    else finish();
  };

  return (
    <div className="min-h-screen pb-28">
      <header className="mx-auto flex max-w-6xl items-center justify-between px-5 py-6">
        <Logo />
        <Link to="/" className="text-sm font-medium text-muted-foreground hover:text-foreground">Exit</Link>
      </header>

      <div className="mx-auto max-w-6xl px-5">
        <ol className="mb-10 flex items-center gap-2 text-sm">
          {STEPS.map((l, i) => (
            <li key={l} className="flex items-center gap-2">
              <button
                disabled={i > step}
                onClick={() => setStep(i)}
                className={cn(
                  "flex items-center gap-2 rounded-full px-3 py-1.5 font-medium",
                  i === step ? "bg-primary-soft text-primary" : i < step ? "text-foreground" : "text-muted-foreground",
                )}
              >
                <span className={cn("grid size-5 place-items-center rounded-full text-[11px]", i < step ? "bg-primary text-primary-foreground" : "border")}>
                  {i < step ? <Check className="size-3" strokeWidth={3} /> : i + 1}
                </span>
                <span className="hidden sm:inline">{l}</span>
              </button>
              {i < STEPS.length - 1 && <span className="h-px w-6 bg-border sm:w-10" />}
            </li>
          ))}
        </ol>

        <div className="grid gap-10 lg:grid-cols-[1fr_320px]">
          <main>
            {step > 0 && (
              <button onClick={() => setStep(step - 1)} className="mb-4 inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground">
                <ArrowLeft className="size-4" /> Back
              </button>
            )}

            {step === 0 && (
              <>
                <h1 className="font-display text-4xl md:text-5xl">What can we help you with?</h1>
                <div className="mt-8 grid gap-4 sm:grid-cols-2">
                  {SERVICES.map((sv) => {
                    const sel = sid === sv.id;
                    return (
                      <button
                        key={sv.id}
                        onClick={() => {
                          setSid(sv.id);
                          setTime(null);
                          setStep(1);
                        }}
                        className={cn(
                          "card-soft flex min-h-52 flex-col justify-between p-6 text-left transition",
                          sel ? "border-primary ring-2 ring-primary/20" : "hover:border-primary/40",
                        )}
                      >
                        <div>
                          <div className="flex items-start justify-between gap-3">
                            <p className="font-display text-2xl leading-tight">{sv.name}</p>
                            {sv.id === "emergency" && (
                              <span className="shrink-0 rounded-full bg-urgent-soft px-2.5 py-1 text-xs font-semibold text-urgent">Same-day</span>
                            )}
                          </div>
                          <p className="mt-2 text-muted-foreground">{sv.description}</p>
                        </div>
                        <div className="mt-6 flex flex-wrap items-center gap-2 text-sm">
                          <span className="inline-flex items-center gap-1.5 rounded-full bg-secondary px-3 py-1 font-medium"><Clock className="size-3.5" />{sv.duration} min</span>
                          <span className="rounded-full bg-muted px-3 py-1 font-medium">{sv.price}</span>
                          {sv.deposit && <span className="rounded-full bg-gold-soft px-3 py-1 font-medium">{naira(CLINIC.deposit)} deposit</span>}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </>
            )}

            {step === 1 && s && (
              <>
                <h1 className="font-display text-4xl md:text-5xl">Find a time that works for you</h1>
                <p className="mb-8 mt-3 text-muted-foreground">Showing times with a full {s.duration}-minute opening for {s.name.toLowerCase()}.</p>
                <SlotPicker duration={s.duration} value={time} onChange={setTime} emergency={s.id === "emergency"} />
              </>
            )}

            {step === 2 && s && time && (
              <>
                <h1 className="font-display text-4xl md:text-5xl">Almost there</h1>
                <p className="mb-8 mt-3 text-muted-foreground">We'll send your confirmation and reminder by WhatsApp, SMS and email.</p>
                <div className="card-soft space-y-5 p-6 md:p-8">
                  <label className="block">
                    <span className="mb-1.5 block text-sm font-medium">Full name</span>
                    <input className="field" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="e.g. Adaeze Okonkwo" />
                  </label>
                  <div className="grid gap-5 sm:grid-cols-2">
                    <label className="block">
                      <span className="mb-1.5 block text-sm font-medium">Phone number</span>
                      <input className="field" inputMode="tel" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="+234 803 000 0000" />
                    </label>
                    <label className="block">
                      <span className="mb-1.5 block text-sm font-medium">Email address</span>
                      <input className="field" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="you@example.com" />
                    </label>
                  </div>
                  <div>
                    <span className="mb-2 block text-sm font-medium">What brings you in? <span className="font-normal text-muted-foreground">(optional)</span></span>
                    <div className="flex flex-wrap gap-2">
                      {REASONS.map((r) => (
                        <button
                          key={r}
                          onClick={() => setForm({ ...form, reason: form.reason === r ? "" : r })}
                          className={cn(
                            "rounded-full border px-4 py-2 text-sm font-medium transition",
                            form.reason === r ? "border-primary bg-primary-soft text-primary" : "bg-card hover:border-primary/50",
                          )}
                        >
                          {r}
                        </button>
                      ))}
                    </div>
                  </div>
                  {s.deposit && (
                    <div className="flex gap-3 rounded-2xl border border-gold/40 bg-gold-soft p-4 text-sm">
                      <Lock className="mt-0.5 size-4 shrink-0 text-gold" />
                      <p><strong>{naira(CLINIC.deposit)} booking deposit</strong> required to confirm this appointment. It's deducted from your bill on the day.</p>
                    </div>
                  )}
                </div>
              </>
            )}
          </main>

          {/* Summary */}
          <aside className="hidden lg:block">
            <div className="card-soft sticky top-6 space-y-4 p-6">
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Your appointment</p>
              <Row label="Service" value={s?.name} />
              <Row label="Duration" value={s ? `${s.duration} min` : undefined} />
              <Row label="Date" value={time ? fmtDate(time) : undefined} />
              <Row label="Time" value={time ? fmtTime(time) : undefined} />
              {s?.deposit && <Row label="Deposit" value={naira(CLINIC.deposit)} />}
              <div className="border-t pt-4 text-sm text-muted-foreground">{CLINIC.name}<br />{CLINIC.address}</div>
            </div>
          </aside>
        </div>
      </div>

      {/* Sticky action bar */}
      {step > 0 && (
        <div className="fixed inset-x-0 bottom-0 border-t bg-card/95 backdrop-blur">
          <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-5 py-4">
            <div className="min-w-0 text-sm">
              <p className="truncate font-semibold">{s?.name}</p>
              <p className="truncate text-muted-foreground">{time ? `${fmtDate(time)} · ${fmtTime(time)}` : "Choose a time"}</p>
            </div>
            {step === 1 ? (
              <button className="btn-primary" disabled={!time} onClick={() => setStep(2)}>Continue</button>
            ) : (
              <button className="btn-primary" disabled={!valid} onClick={confirm}>Confirm Appointment</button>
            )}
          </div>
        </div>
      )}

      {paying !== "idle" && s && time && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-foreground/30 p-4">
          <div className="card-soft w-full max-w-md p-7">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Secure booking deposit</p>
                <p className="mt-1 font-display text-4xl">{naira(CLINIC.deposit)}</p>
              </div>
              {paying === "open" && (
                <button aria-label="Close" onClick={() => setPaying("idle")} className="rounded-full p-1.5 hover:bg-muted"><X className="size-5" /></button>
              )}
            </div>
            <p className="mt-2 text-sm text-muted-foreground">{s.name} · {fmtDate(time)}, {fmtTime(time)}</p>
            <div className="mt-6 space-y-3">
              <input className="field" defaultValue="5399 8312 4410 2076" aria-label="Card number" />
              <div className="grid grid-cols-2 gap-3">
                <input className="field" defaultValue="09 / 28" aria-label="Expiry" />
                <input className="field" defaultValue="•••" aria-label="CVV" />
              </div>
            </div>
            <button
              className="btn-primary mt-6 w-full !py-4"
              disabled={paying === "processing"}
              onClick={() => {
                setPaying("processing");
                setTimeout(finish, 1400);
              }}
            >
              {paying === "processing" ? <><Loader2 className="size-4 animate-spin" /> Processing…</> : <><CreditCard className="size-4" /> Pay {naira(CLINIC.deposit)} & confirm</>}
            </button>
            <p className="mt-3 text-center text-xs text-muted-foreground">Demo payment — no real card is charged.</p>
          </div>
        </div>
      )}
    </div>
  );
}

function Row({ label, value }: { label: string; value?: string }) {
  return (
    <div className="flex justify-between gap-4 text-sm">
      <span className="text-muted-foreground">{label}</span>
      <span className={cn("text-right font-medium", !value && "text-muted-foreground/60")}>{value ?? "—"}</span>
    </div>
  );
}
