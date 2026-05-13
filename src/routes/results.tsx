import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { ArrowRight, Sparkles } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { toast } from "sonner";
import { useOnboardingStore, useDietStore } from "@/lib/store";
import { calculate } from "@/lib/calculations";
import { staticDietPlans, type DietPlan } from "@/lib/static-data";

export const Route = createFileRoute("/results")({
  head: () => ({
    meta: [
      { title: "Your plan — NorthForm" },
      { name: "description", content: "Your daily fuel protocol — calorie target, macro split, and exactly what to eat today." },
    ],
  }),
  component: Results,
});

function Results() {
  const data = useOnboardingStore((s) => s.data);
  const calc = useMemo(() => calculate(data), [data]);
  const { selectedPlanId, selectPlan } = useDietStore();
  const plan = staticDietPlans.find((p) => p.id === selectedPlanId) ?? staticDietPlans[0];

  // Force the Iron & Ink dark aesthetic on this page regardless of global theme.
  useEffect(() => {
    const html = document.documentElement;
    const had = html.classList.contains("dark");
    html.classList.add("dark");
    return () => { if (!had) html.classList.remove("dark"); };
  }, []);

  const today = new Date().toLocaleDateString(undefined, { weekday: "long", month: "long", day: "numeric" });
  const firstName = data.fullName?.split(" ")[0];
  const macroSplit = [
    { label: "Protein",       g: calc.protein, pct: 30, tone: "bg-primary",            text: "text-primary" },
    { label: "Carbohydrates", g: calc.carbs,   pct: 45, tone: "bg-foreground/55",      text: "text-foreground" },
    { label: "Fats",          g: calc.fat,     pct: 25, tone: "bg-foreground/30",      text: "text-foreground" },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />

      {/* Hero + Stats */}
      <section className="relative overflow-hidden border-b border-border">
        <div className="iron-motif" />
        <div className="relative mx-auto max-w-6xl px-6 py-14 md:py-20">
          <div className="flex flex-col gap-10 md:flex-row md:items-end md:justify-between">
            <div className="space-y-4">
              <span className="inline-flex items-center gap-2 rounded-full border border-border bg-card/60 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.22em] text-muted-foreground">
                <Sparkles className="h-3 w-3 text-primary" /> Performance Protocol
              </span>
              <h1 className="font-condensed text-5xl uppercase leading-[0.92] tracking-tight md:text-7xl">
                {firstName ? `${firstName}, your plan,` : "Your plan,"}{" "}
                <span className="italic text-primary">calibrated.</span>
              </h1>
              <p className="max-w-xl text-sm leading-relaxed text-muted-foreground">
                Engineered for steady progress and lean-mass retention from your age, body, activity and goal — using
                Mifflin–St Jeor. Treat the numbers as targets and adjust as you learn.
              </p>
            </div>

            {/* Condensed Stats Bar — replaces the four confusing tiles */}
            <div className="grid grid-cols-3 gap-8 rounded-2xl border border-border bg-card/60 p-6 backdrop-blur md:gap-10">
              <StatPill label="Maintenance" value={calc.tdee} unit="kcal" hint="TDEE — body burn" />
              <Divider />
              <StatPill label="Daily target" value={calc.calories} unit="kcal" hint={data.goal ?? "Goal pace"} accent />
              <Divider />
              <StatPill label="Timeline" value={calc.weeks} unit="weeks" hint={`To ${data.targetWeightKg ?? "—"} kg`} />
            </div>
          </div>
        </div>
      </section>

      {/* Today's plan + macro sidebar */}
      <section className="mx-auto max-w-6xl px-6 py-14">
        <div className="grid gap-8 lg:grid-cols-12">
          {/* LEFT: Daily Blueprint — the focus */}
          <div className="lg:col-span-8">
            <div className="mb-5 flex items-end justify-between">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-muted-foreground">What to eat today</p>
                <h2 className="font-condensed text-3xl uppercase tracking-tight md:text-4xl">Daily Blueprint</h2>
              </div>
              <span className="text-xs italic text-muted-foreground">{today}</span>
            </div>

            {/* Plan switcher */}
            <div className="mb-5 inline-flex rounded-full border border-border bg-card p-1 text-xs">
              {staticDietPlans.map((p) => (
                <button
                  key={p.id}
                  onClick={() => selectPlan(p.id)}
                  className={`rounded-full px-4 py-1.5 font-semibold uppercase tracking-wider transition-colors ${
                    selectedPlanId === p.id
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {p.name}
                </button>
              ))}
            </div>

            <MealTimeline plan={plan} />

            <div className="mt-6 flex justify-end">
              <Button asChild size="lg" className="rounded-full px-7 font-semibold uppercase tracking-wider">
                <Link to="/dashboard">
                  Activate this plan <ArrowRight className="ml-1 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>

          {/* RIGHT: Macro split + coach note */}
          <aside className="lg:col-span-4">
            <div className="rounded-3xl border border-border bg-card p-7">
              <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-muted-foreground">Target macro split</p>
              <p className="mt-2 font-condensed text-2xl">
                {calc.calories.toLocaleString()} <span className="text-sm text-muted-foreground">kcal / day</span>
              </p>

              <div className="mt-7 space-y-5">
                {macroSplit.map((m) => (
                  <div key={m.label}>
                    <div className="mb-1.5 flex items-end justify-between">
                      <span className="text-xs font-bold uppercase tracking-wider">{m.label}</span>
                      <span className={`font-condensed text-sm ${m.text}`}>{m.g}g · {m.pct}%</span>
                    </div>
                    <div className="h-1.5 overflow-hidden rounded-full bg-muted">
                      <div className={`h-full rounded-full ${m.tone}`} style={{ width: `${m.pct}%` }} />
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-8 rounded-2xl border border-border bg-background/60 p-5">
                <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Coach note</p>
                <p className="mt-2 text-xs italic leading-relaxed text-muted-foreground">
                  {calc.delta < 0
                    ? `You're aiming to lose ${Math.abs(calc.delta)} kg. We've set a sustainable ~0.5 kg/week pace — prioritise protein at every meal to protect lean muscle.`
                    : calc.delta > 0
                    ? `Goal: gain ${calc.delta} kg of mass on a controlled surplus. Hit your protein target first, then carbs around training.`
                    : `You're holding at ${data.weightKg ?? "—"} kg. Use this window to dial in habits and recovery.`}
                </p>
              </div>
            </div>

            {/* Mini reference: BMR — kept but de-emphasised */}
            <div className="mt-5 rounded-2xl border border-border bg-card/40 p-5">
              <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Resting burn (BMR)</p>
              <p className="mt-1 font-condensed text-2xl">{calc.bmr.toLocaleString()} <span className="text-sm text-muted-foreground">kcal</span></p>
              <p className="mt-1 text-[11px] text-muted-foreground">Calories your body uses at rest — informational only.</p>
            </div>
          </aside>
        </div>

        {/* Consultation CTA */}
        <div className="relative mt-16 overflow-hidden rounded-[2rem] border border-border bg-card p-10 md:p-14">
          <div className="iron-motif" />
          <div className="relative flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
            <div className="max-w-xl">
              <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-primary">1:1 coaching</p>
              <h2 className="mt-2 font-condensed text-3xl uppercase tracking-tight md:text-4xl">
                Want this delivered to your door?
              </h2>
              <p className="mt-3 text-sm text-muted-foreground">
                A registered dietitian reviews your plan and arranges weekly meal delivery in your city.
              </p>
            </div>
            <ConsultDialog />
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

function StatPill({
  label, value, unit, hint, accent,
}: { label: string; value: number | string; unit: string; hint?: string; accent?: boolean }) {
  return (
    <div className="min-w-0">
      <p className={`text-[10px] font-bold uppercase tracking-[0.22em] ${accent ? "text-primary" : "text-muted-foreground"}`}>{label}</p>
      <p className={`mt-1 font-condensed text-2xl leading-none md:text-3xl ${accent ? "text-primary" : ""}`}>
        {typeof value === "number" ? value.toLocaleString() : value}{" "}
        <span className="text-xs text-muted-foreground">{unit}</span>
      </p>
      {hint ? <p className="mt-1 truncate text-[10px] uppercase tracking-wider text-muted-foreground">{hint}</p> : null}
    </div>
  );
}

function Divider() {
  return <div className="hidden h-12 w-px self-center bg-border md:block" />;
}

function MealTimeline({ plan }: { plan: DietPlan }) {
  const meals = Object.entries(plan.meals);
  return (
    <ul className="space-y-3">
      {meals.map(([key, m]) => {
        const [time, period] = (m.time || "").split(" ");
        return (
          <li
            key={key}
            className="group flex items-center gap-5 rounded-2xl border border-border bg-card p-5 transition-colors hover:border-foreground/25"
          >
            <div className="flex w-16 shrink-0 flex-col items-center justify-center border-r border-border pr-5">
              <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">{time || "—"}</span>
              <span className="font-condensed text-sm uppercase">{period || ""}</span>
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-muted-foreground">
                {key.replace("_", " ")}
              </p>
              <h3 className="mt-0.5 truncate text-base font-semibold transition-colors group-hover:text-primary md:text-lg">
                {m.name}
              </h3>
            </div>
            <div className="text-right">
              <div className="font-condensed text-xl">
                {m.calories} <span className="text-xs text-muted-foreground">kcal</span>
              </div>
              <div className="mt-1 flex justify-end gap-1.5">
                <Macro tag={`P ${m.protein}g`} />
                <Macro tag={`C ${m.carbs}g`} />
                <Macro tag={`F ${m.fat}g`} />
              </div>
            </div>
          </li>
        );
      })}
    </ul>
  );
}

function Macro({ tag }: { tag: string }) {
  return (
    <span className="rounded bg-muted px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wider text-muted-foreground">
      {tag}
    </span>
  );
}

function ConsultDialog() {
  const [open, setOpen] = useState(false);
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="lg" className="rounded-full px-7 font-semibold uppercase tracking-wider">
          Request consultation
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader><DialogTitle className="font-condensed text-2xl uppercase">Talk to a dietitian</DialogTitle></DialogHeader>
        <form
          onSubmit={(e) => { e.preventDefault(); setOpen(false); toast.success("Our team will contact you within 24 hours 🎉"); }}
          className="space-y-3"
        >
          <input required placeholder="Full name" className="h-12 w-full rounded-xl border border-border bg-card px-4 text-sm outline-none focus:border-primary" />
          <input required type="email" placeholder="Email" className="h-12 w-full rounded-xl border border-border bg-card px-4 text-sm outline-none focus:border-primary" />
          <input required placeholder="Phone" className="h-12 w-full rounded-xl border border-border bg-card px-4 text-sm outline-none focus:border-primary" />
          <Button type="submit" className="h-12 w-full rounded-xl">Request callback</Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
