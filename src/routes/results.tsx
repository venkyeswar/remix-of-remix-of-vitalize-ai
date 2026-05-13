import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { ArrowRight, Calendar, Flame, Gauge, Sparkles, Utensils } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { toast } from "sonner";
import { useOnboardingStore, useDietStore } from "@/lib/store";
import { calculate } from "@/lib/calculations";
import { staticDietPlans, type DietPlan } from "@/lib/static-data";
import { StatCard } from "@/components/StatCard";
import { MacroRing } from "@/components/MacroRing";

export const Route = createFileRoute("/results")({
  head: () => ({ meta: [{ title: "Your plan — NorthForm" }, { name: "description", content: "Calorie and macro targets, plus two meal plans built for your goal." }] }),
  component: Results,
});

function Results() {
  const data = useOnboardingStore((s) => s.data);
  const calc = useMemo(() => calculate(data), [data]);
  const { selectedPlanId, selectPlan } = useDietStore();
  const plan = staticDietPlans.find((p) => p.id === selectedPlanId) ?? staticDietPlans[0];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <section className="relative overflow-hidden border-b border-border/60">
        <div className="absolute inset-0 mesh-bg opacity-50" />
        <div className="relative mx-auto max-w-7xl px-6 py-16">
          <span className="inline-flex items-center gap-2 rounded-full border border-border bg-card/60 px-3 py-1 text-xs text-muted-foreground backdrop-blur">
            <Sparkles className="h-3 w-3 text-primary" /> Plan ready
          </span>
          <h1 className="mt-6 max-w-3xl font-display text-4xl font-semibold tracking-tight md:text-6xl">
            {data.fullName ? `${data.fullName.split(" ")[0]}, ` : "Your plan, "}<span className="text-primary">calibrated.</span>
          </h1>
          <p className="mt-4 max-w-xl text-muted-foreground">
            Built from your age, body, activity and goal using Mifflin-St Jeor. Numbers are targets — adjust as you learn.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-16">
        <div className="grid gap-4 md:grid-cols-4">
          <StatCard label="BMR" value={calc.bmr} suffix="kcal" icon={Gauge} hint="Resting burn" />
          <StatCard label="TDEE" value={calc.tdee} suffix="kcal" icon={Flame} hint="With activity" />
          <StatCard label="Daily target" value={calc.calories} suffix="kcal" icon={Utensils} hint={data.goal ?? ""} />
          <StatCard label="Timeline" value={calc.weeks} suffix="weeks" icon={Calendar} hint={`To ${data.targetWeightKg ?? "—"} kg`} />
        </div>

        <div className="mt-10 grid gap-6 lg:grid-cols-[auto_1fr]">
          <div className="glass rounded-3xl p-8">
            <p className="text-xs uppercase tracking-widest text-muted-foreground">Macros</p>
            <div className="mt-4">
              <MacroRing protein={calc.protein} carbs={calc.carbs} fat={calc.fat} calories={calc.calories} size={240} />
            </div>
          </div>
          <div className="glass rounded-3xl p-8">
            <p className="text-xs uppercase tracking-widest text-muted-foreground">Daily macro split</p>
            <div className="mt-4 grid gap-4">
              {[
                { label: "Protein", g: calc.protein, pct: 30, color: "var(--primary)" },
                { label: "Carbs", g: calc.carbs, pct: 45, color: "var(--chart-2)" },
                { label: "Fat", g: calc.fat, pct: 25, color: "var(--chart-3)" },
              ].map((m) => (
                <div key={m.label}>
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium">{m.label}</span>
                    <span className="text-muted-foreground">{m.g} g · {m.pct}%</span>
                  </div>
                  <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-border">
                    <div className="h-full rounded-full transition-all" style={{ width: `${m.pct * 2}%`, background: m.color }} />
                  </div>
                </div>
              ))}
            </div>
            <p className="mt-6 rounded-xl border border-dashed border-border p-4 text-sm text-muted-foreground">
              {calc.delta < 0
                ? `You're aiming to lose ${Math.abs(calc.delta)} kg. We've set a sustainable ~0.5 kg/week pace.`
                : calc.delta > 0
                ? `Goal: gain ${calc.delta} kg of mass. We're running a controlled surplus.`
                : `You're holding steady at ${data.weightKg ?? "—"} kg.`}
            </p>
          </div>
        </div>

        {/* Plans */}
        <div className="mt-16">
          <div className="mb-6 flex items-end justify-between">
            <div>
              <p className="text-xs uppercase tracking-widest text-primary">Meal plans</p>
              <h2 className="mt-2 font-display text-3xl font-semibold tracking-tight md:text-4xl">Pick a starting point.</h2>
            </div>
            <div className="inline-flex rounded-full border border-border bg-card/40 p-1">
              {staticDietPlans.map((p) => (
                <button key={p.id} onClick={() => selectPlan(p.id)}
                  className={`rounded-full px-4 py-2 text-sm transition-all ${selectedPlanId === p.id ? "bg-primary text-primary-foreground" : "text-muted-foreground"}`}>
                  {p.name}
                </button>
              ))}
            </div>
          </div>
          <PlanCard plan={plan} />
        </div>

        {/* Consultation CTA */}
        <div className="mt-16 overflow-hidden rounded-[2rem] border border-border bg-card/40 p-10 md:p-14">
          <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
            <div className="max-w-xl">
              <h2 className="font-display text-3xl font-semibold tracking-tight md:text-4xl">Want this delivered to your door?</h2>
              <p className="mt-3 text-muted-foreground">A registered dietitian reviews your plan and arranges weekly meal delivery in your city.</p>
            </div>
            <ConsultDialog />
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
}

function PlanCard({ plan }: { plan: DietPlan }) {
  const meals = Object.entries(plan.meals);
  return (
    <div className="glass rounded-3xl p-8">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <span className="rounded-full bg-primary/15 px-3 py-1 text-xs font-medium text-primary">{plan.tag}</span>
          <h3 className="mt-3 font-display text-2xl">{plan.name}</h3>
        </div>
        <div className="text-right">
          <p className="text-xs uppercase tracking-widest text-muted-foreground">Daily total</p>
          <p className="font-display text-3xl">{plan.totalCalories}<span className="ml-1 text-sm text-muted-foreground">kcal</span></p>
        </div>
      </div>
      <ul className="space-y-3">
        {meals.map(([key, m]) => (
          <li key={key} className="lift flex items-center gap-4 rounded-2xl border border-border/60 bg-background/40 p-4">
            <div className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-primary/15 text-primary text-xs uppercase tracking-widest">
              {m.time.split(" ")[0]}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs uppercase tracking-widest text-muted-foreground">{key.replace("_", " ")}</p>
              <p className="mt-0.5 truncate font-medium">{m.name}</p>
            </div>
            <div className="hidden gap-2 text-xs sm:flex">
              <Chip label={`P ${m.protein}`} />
              <Chip label={`C ${m.carbs}`} />
              <Chip label={`F ${m.fat}`} />
            </div>
            <p className="ml-2 text-sm font-medium">{m.calories} <span className="text-muted-foreground">kcal</span></p>
          </li>
        ))}
      </ul>
      <div className="mt-6 flex justify-end">
        <Button asChild className="rounded-full"><Link to="/dashboard">Use this plan <ArrowRight className="ml-1 h-4 w-4" /></Link></Button>
      </div>
    </div>
  );
}
function Chip({ label }: { label: string }) {
  return <span className="rounded-full border border-border px-2.5 py-0.5 text-[10px] uppercase tracking-widest text-muted-foreground">{label}</span>;
}

function ConsultDialog() {
  const [open, setOpen] = useState(false);
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="lg" className="rounded-full px-7">Request consultation</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader><DialogTitle className="font-display text-2xl">Talk to a dietitian</DialogTitle></DialogHeader>
        <form onSubmit={(e) => { e.preventDefault(); setOpen(false); toast.success("Our team will contact you within 24 hours 🎉"); }} className="space-y-3">
          <input required placeholder="Full name" className="h-12 w-full rounded-xl border border-border bg-card/40 px-4 text-sm outline-none focus:border-primary" />
          <input required type="email" placeholder="Email" className="h-12 w-full rounded-xl border border-border bg-card/40 px-4 text-sm outline-none focus:border-primary" />
          <input required placeholder="Phone" className="h-12 w-full rounded-xl border border-border bg-card/40 px-4 text-sm outline-none focus:border-primary" />
          <Button type="submit" className="h-12 w-full rounded-xl">Request callback</Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}