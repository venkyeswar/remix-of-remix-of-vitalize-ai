import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import {
  ArrowLeft, ArrowRight, Mars, Venus, CircleUser,
  Armchair, Footprints, Bike, Activity, Dumbbell,
  Leaf, Salad, Egg, Drumstick,
  Wallet, Coins, Crown,
  TrendingDown, TrendingUp, Flame, Target, Scale, Loader2, X, Check,
  Building2, Home as HomeIcon, MinusCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useOnboardingStore, type OnboardingData } from "@/lib/store";
import { motivationalQuotes } from "@/lib/static-data";

export const Route = createFileRoute("/onboarding/")({
  head: () => ({ meta: [{ title: "Build your plan — NorthForm" }, { name: "description", content: "Seven short questions. One personalized plan." }] }),
  beforeLoad: async () => {
    const { redirect } = await import("@tanstack/react-router");
    const { useUserStore, useOnboardingStore } = await import("@/lib/store");
    if (!useUserStore.getState().isLoggedIn) throw redirect({ to: "/auth/login" });
    if (useOnboardingStore.getState().isComplete) throw redirect({ to: "/dashboard" });
  },
  component: Onboarding,
});

const STEPS = ["Personal", "Body", "Activity", "Diet", "Budget", "Workout", "Goal", "Summary"];

function Onboarding() {
  const { step, data, patch, next, prev, setStep, complete } = useOnboardingStore();
  const navigate = useNavigate();
  const [generating, setGenerating] = useState(false);
  const stageRef = useRef<HTMLDivElement>(null);
  const dirRef = useRef(1);

  useEffect(() => {
    if (!stageRef.current) return;
    gsap.fromTo(stageRef.current, { x: 40 * dirRef.current, opacity: 0 }, { x: 0, opacity: 1, duration: 0.45, ease: "power2.out" });
  }, [step]);

  const handleNext = () => {
    dirRef.current = 1;
    if (step === STEPS.length - 1) {
      setGenerating(true);
      setTimeout(() => {
        complete();
        navigate({ to: "/results" });
      }, 1500);
      return;
    }
    next();
  };
  const handlePrev = () => { dirRef.current = -1; prev(); };

  const valid = isStepValid(step, data);

  return (
    <div className="relative flex min-h-screen flex-col bg-background">
      <div className="absolute inset-0 mesh-bg opacity-30" />
      <header className="relative z-10 mx-auto flex w-full max-w-5xl items-center justify-between px-6 py-6">
        <Link to="/" className="flex items-center gap-2">
          <span className="grid h-8 w-8 place-items-center rounded-lg bg-primary text-primary-foreground"><Leaf className="h-4 w-4" /></span>
          <span className="font-display text-lg font-semibold">NorthForm</span>
        </Link>
        <div className="text-xs uppercase tracking-widest text-muted-foreground">
          Step <span className="text-foreground">{step + 1}</span> of {STEPS.length}
        </div>
      </header>
      <div className="relative mx-auto w-full max-w-5xl px-6">
        <div className="h-1 w-full overflow-hidden rounded-full bg-border">
          <div className="h-full rounded-full bg-primary transition-all duration-500" style={{ width: `${((step + 1) / STEPS.length) * 100}%` }} />
        </div>
        <div className="mt-2 flex justify-between text-[10px] uppercase tracking-widest text-muted-foreground">
          {STEPS.map((s, i) => (
            <button key={s} onClick={() => i < step && setStep(i)} className={i <= step ? "text-primary" : ""}>{s}</button>
          ))}
        </div>
      </div>

      <main className="relative z-10 flex flex-1 items-center justify-center px-6 py-10">
        <div ref={stageRef} className="w-full max-w-3xl">
          {step === 0 && <StepPersonal data={data} patch={patch} />}
          {step === 1 && <StepBody data={data} patch={patch} />}
          {step === 2 && <StepActivity data={data} patch={patch} />}
          {step === 3 && <StepDiet data={data} patch={patch} />}
          {step === 4 && <StepBudget data={data} patch={patch} />}
          {step === 5 && <StepWorkout data={data} patch={patch} />}
          {step === 6 && <StepGoal data={data} patch={patch} />}
          {step === 7 && <StepSummary data={data} />}
        </div>
      </main>

      <footer className="relative z-10 border-t border-border/60 bg-background/70 backdrop-blur">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-6 py-4">
          <Button variant="ghost" onClick={handlePrev} disabled={step === 0} className="rounded-full">
            <ArrowLeft className="mr-1 h-4 w-4" /> Back
          </Button>
          <p className="hidden text-center text-xs italic text-muted-foreground/70 sm:block">
            {motivationalQuotes[step % motivationalQuotes.length]}
          </p>
          <Button onClick={handleNext} disabled={!valid || generating} className="rounded-full px-6">
            {generating ? (<><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Generating</>) : step === STEPS.length - 1 ? (<>Generate my plan <ArrowRight className="ml-1 h-4 w-4" /></>) : (<>Continue <ArrowRight className="ml-1 h-4 w-4" /></>)}
          </Button>
        </div>
      </footer>
    </div>
  );
}

function isStepValid(step: number, d: OnboardingData) {
  switch (step) {
    case 0: return d.fullName.length > 1 && !!d.age && !!d.gender && d.email.includes("@");
    case 1: return !!d.heightCm && !!d.weightKg && !!d.targetWeightKg;
    case 2: return !!d.activity;
    case 3: return !!d.dietType;
    case 4: return !!d.budget;
    case 5: return !!d.workout;
    case 6: return !!d.goal;
    case 7: return true;
    default: return false;
  }
}

function H({ title, sub }: { title: string; sub?: string }) {
  return (
    <div className="mb-8 text-center">
      <h2 className="font-display text-3xl font-semibold tracking-tight md:text-4xl">{title}</h2>
      {sub && <p className="mt-2 text-muted-foreground">{sub}</p>}
    </div>
  );
}

function CardOption({ active, onClick, children, className = "" }: { active: boolean; onClick: () => void; children: React.ReactNode; className?: string }) {
  return (
    <button type="button" onClick={onClick}
      className={`lift relative rounded-2xl border p-5 text-left transition-all ${active ? "border-primary bg-primary/10 ring-2 ring-primary/40" : "border-border bg-card/40 hover:border-primary/50"} ${className}`}>
      {active && <span className="absolute right-3 top-3 grid h-5 w-5 place-items-center rounded-full bg-primary text-primary-foreground"><Check className="h-3 w-3" /></span>}
      {children}
    </button>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="text-xs uppercase tracking-widest text-muted-foreground">{label}</span>
      <div className="mt-2">{children}</div>
    </label>
  );
}

function TextInput(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return <input {...props} className={"h-12 w-full rounded-xl border border-border bg-card/40 px-4 text-sm outline-none transition-all focus:border-primary " + (props.className ?? "")} />;
}

/* ────────────── STEP 1 ────────────── */
function StepPersonal({ data, patch }: { data: OnboardingData; patch: (d: Partial<OnboardingData>) => void }) {
  const genders = [
    { id: "male", label: "Male", Icon: Mars },
    { id: "female", label: "Female", Icon: Venus },
    { id: "other", label: "Other", Icon: CircleUser },
  ] as const;
  return (
    <div>
      <H title="Let's start with the basics." sub="Your plan will be tied to this profile." />
      <div className="grid gap-4 md:grid-cols-2">
        <Field label="Full name"><TextInput value={data.fullName} onChange={(e) => patch({ fullName: e.target.value })} placeholder="Alex Morgan" /></Field>
        <Field label="Age"><TextInput type="number" value={data.age ?? ""} onChange={(e) => patch({ age: +e.target.value || null })} placeholder="28" /></Field>
        <Field label="Email"><TextInput type="email" value={data.email} onChange={(e) => patch({ email: e.target.value })} placeholder="you@email.com" /></Field>
      </div>
      <p className="mt-8 mb-3 text-xs uppercase tracking-widest text-muted-foreground">Gender</p>
      <div className="grid grid-cols-3 gap-3">
        {genders.map((g) => (
          <CardOption key={g.id} active={data.gender === g.id} onClick={() => patch({ gender: g.id })}>
            <g.Icon className="h-6 w-6 text-primary" />
            <p className="mt-3 font-medium">{g.label}</p>
          </CardOption>
        ))}
      </div>
    </div>
  );
}

/* ────────────── STEP 2 ────────────── */
function StepBody({ data, patch }: { data: OnboardingData; patch: (d: Partial<OnboardingData>) => void }) {
  const [hUnit, setHUnit] = useState<"cm" | "ft">("cm");
  const [wUnit, setWUnit] = useState<"kg" | "lbs">("kg");
  const diff = data.targetWeightKg && data.weightKg ? +(data.targetWeightKg - data.weightKg).toFixed(1) : null;
  return (
    <div>
      <H title="Tell us about your body." sub="We use Mifflin-St Jeor — the formula RDs trust." />
      <div className="grid gap-6 md:grid-cols-3">
        <div>
          <UnitToggle a="cm" b="ft" value={hUnit} onChange={setHUnit} />
          <Field label="Height">
            <TextInput type="number" value={data.heightCm ?? ""} onChange={(e) => patch({ heightCm: +e.target.value || null })} placeholder={hUnit === "cm" ? "175" : "5.9"} />
          </Field>
        </div>
        <div>
          <UnitToggle a="kg" b="lbs" value={wUnit} onChange={setWUnit} />
          <Field label="Current weight">
            <TextInput type="number" value={data.weightKg ?? ""} onChange={(e) => patch({ weightKg: +e.target.value || null })} placeholder={wUnit === "kg" ? "78" : "172"} />
          </Field>
        </div>
        <div>
          <UnitToggle a="kg" b="lbs" value={wUnit} onChange={setWUnit} />
          <Field label="Target weight">
            <TextInput type="number" value={data.targetWeightKg ?? ""} onChange={(e) => patch({ targetWeightKg: +e.target.value || null })} placeholder={wUnit === "kg" ? "72" : "158"} />
          </Field>
        </div>
      </div>
      {diff !== null && (
        <div className="mt-6 rounded-2xl border border-primary/30 bg-primary/10 p-4 text-center">
          <p className="text-sm text-muted-foreground">You want to <span className="font-display text-lg font-semibold text-primary">{diff < 0 ? `lose ${Math.abs(diff)}` : diff > 0 ? `gain ${diff}` : "maintain"}</span> {diff !== 0 && "kg"}</p>
        </div>
      )}
    </div>
  );
}

function UnitToggle<T extends string>({ a, b, value, onChange }: { a: T; b: T; value: T; onChange: (v: T) => void }) {
  return (
    <div className="mb-3 inline-flex rounded-full border border-border bg-card/40 p-0.5 text-xs">
      {[a, b].map((u) => (
        <button key={u} type="button" onClick={() => onChange(u as T)} className={`rounded-full px-3 py-1 transition-all ${value === u ? "bg-primary text-primary-foreground" : "text-muted-foreground"}`}>{u}</button>
      ))}
    </div>
  );
}

/* ────────────── STEP 3 ────────────── */
function StepActivity({ data, patch }: { data: OnboardingData; patch: (d: Partial<OnboardingData>) => void }) {
  const opts = [
    { id: "sedentary", label: "Sedentary", desc: "Mostly desk work, little movement", Icon: Armchair },
    { id: "light", label: "Lightly Active", desc: "Walks, light errands, 1–2 sessions/wk", Icon: Footprints },
    { id: "moderate", label: "Moderately Active", desc: "Cycling or gym 3–4 days a week", Icon: Bike },
    { id: "very", label: "Very Active", desc: "Running, training 5–6 days a week", Icon: Activity },
    { id: "athlete", label: "Athlete", desc: "Twice-a-day or competitive training", Icon: Dumbbell },
  ] as const;
  return (
    <div>
      <H title="How active are you, really?" sub="Be honest — your calories depend on it." />
      <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
        {opts.map((o) => (
          <CardOption key={o.id} active={data.activity === o.id} onClick={() => patch({ activity: o.id })}>
            <o.Icon className="h-6 w-6 text-primary" />
            <p className="mt-3 font-medium">{o.label}</p>
            <p className="mt-1 text-xs text-muted-foreground">{o.desc}</p>
          </CardOption>
        ))}
      </div>
    </div>
  );
}

/* ────────────── STEP 4 ────────────── */
function StepDiet({ data, patch }: { data: OnboardingData; patch: (d: Partial<OnboardingData>) => void }) {
  const types = [
    { id: "vegetarian", label: "Vegetarian", emoji: "🥗", Icon: Salad },
    { id: "vegan", label: "Vegan", emoji: "🌱", Icon: Leaf },
    { id: "eggetarian", label: "Eggetarian", emoji: "🥚", Icon: Egg },
    { id: "non-veg", label: "Non-Vegetarian", emoji: "🍗", Icon: Drumstick },
  ] as const;
  const allergens = ["Nuts", "Dairy", "Gluten", "Soy", "Eggs", "Shellfish"];
  return (
    <div>
      <H title="What does your plate look like?" />
      <div className="grid gap-3 md:grid-cols-4">
        {types.map((t) => (
          <CardOption key={t.id} active={data.dietType === t.id} onClick={() => patch({ dietType: t.id })}>
            <span className="text-2xl">{t.emoji}</span>
            <p className="mt-2 font-medium text-sm">{t.label}</p>
          </CardOption>
        ))}
      </div>
      <div className="mt-8">
        <p className="mb-3 text-xs uppercase tracking-widest text-muted-foreground">Allergies</p>
        <div className="flex flex-wrap gap-2">
          {allergens.map((a) => {
            const on = data.allergies.includes(a);
            return (
              <button key={a} type="button"
                onClick={() => patch({ allergies: on ? data.allergies.filter((x) => x !== a) : [...data.allergies, a] })}
                className={`rounded-full border px-4 py-2 text-sm transition-all ${on ? "border-primary bg-primary/15 text-primary" : "border-border text-muted-foreground hover:border-primary/50"}`}>
                {a}
              </button>
            );
          })}
        </div>
      </div>
      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <Chips label="Preferred foods" values={data.preferred} onChange={(v) => patch({ preferred: v })} placeholder="e.g. paneer, eggs, oats" />
        <Chips label="Disliked foods" values={data.disliked} onChange={(v) => patch({ disliked: v })} placeholder="e.g. okra, mushrooms" />
      </div>
    </div>
  );
}

function Chips({ label, values, onChange, placeholder }: { label: string; values: string[]; onChange: (v: string[]) => void; placeholder?: string }) {
  const [v, setV] = useState("");
  const add = () => {
    const t = v.trim();
    if (!t) return;
    onChange([...values, t]);
    setV("");
  };
  return (
    <div>
      <p className="mb-2 text-xs uppercase tracking-widest text-muted-foreground">{label}</p>
      <div className="flex flex-wrap gap-2 rounded-xl border border-border bg-card/40 p-2">
        {values.map((t, i) => (
          <span key={i} className="inline-flex items-center gap-1 rounded-full bg-primary/15 px-3 py-1 text-xs text-primary">
            {t}
            <button type="button" onClick={() => onChange(values.filter((_, j) => j !== i))} className="hover:text-foreground"><X className="h-3 w-3" /></button>
          </span>
        ))}
        <input value={v} onChange={(e) => setV(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); add(); } }}
          placeholder={placeholder} className="min-w-[8ch] flex-1 bg-transparent px-2 py-1 text-sm outline-none" />
      </div>
    </div>
  );
}

/* ────────────── STEP 5 ────────────── */
function StepBudget({ data, patch }: { data: OnboardingData; patch: (d: Partial<OnboardingData>) => void }) {
  const opts = [
    { id: "budget", label: "Budget", desc: "Whole foods, smart swaps", range: "₹150–250 / day", Icon: Wallet, popular: false },
    { id: "moderate", label: "Moderate", desc: "Balanced quality and variety", range: "₹250–450 / day", Icon: Coins, popular: false },
    { id: "premium", label: "Premium", desc: "Top-tier sources & supplements", range: "₹450+ / day", Icon: Crown, popular: true },
  ] as const;
  return (
    <div>
      <H title="What's your daily food budget?" />
      <div className="grid gap-4 md:grid-cols-3">
        {opts.map((o) => (
          <CardOption key={o.id} active={data.budget === o.id} onClick={() => patch({ budget: o.id })}>
            {o.popular && (
              <span className="absolute -top-2 right-4 overflow-hidden rounded-full bg-primary px-3 py-0.5 text-[10px] font-medium uppercase tracking-widest text-primary-foreground">
                <span className="relative">Most popular<span className="absolute inset-0 shimmer" /></span>
              </span>
            )}
            <o.Icon className="h-6 w-6 text-primary" />
            <p className="mt-3 font-display text-lg">{o.label}</p>
            <p className="mt-1 text-xs text-muted-foreground">{o.desc}</p>
            <p className="mt-3 text-sm font-medium">{o.range}</p>
          </CardOption>
        ))}
      </div>
    </div>
  );
}

/* ────────────── STEP: WORKOUT ────────────── */
function StepWorkout({ data, patch }: { data: OnboardingData; patch: (d: Partial<OnboardingData>) => void }) {
  const opts = [
    { id: "gym", label: "Gym", desc: "Weights, machines, structured sessions", Icon: Building2 },
    { id: "home", label: "Home workouts", desc: "Bodyweight, resistance bands, yoga", Icon: HomeIcon },
    { id: "none", label: "Not right now", desc: "Skip pre/post-workout meals", Icon: MinusCircle },
  ] as const;
  return (
    <div>
      <H title="Are you training?" sub="We'll add pre and post-workout meals only if you need them." />
      <div className="grid gap-3 md:grid-cols-3">
        {opts.map((o) => (
          <CardOption key={o.id} active={data.workout === o.id} onClick={() => patch({ workout: o.id })}>
            <o.Icon className="h-7 w-7 text-primary" />
            <p className="mt-3 font-display text-lg">{o.label}</p>
            <p className="mt-1 text-xs text-muted-foreground">{o.desc}</p>
          </CardOption>
        ))}
      </div>
    </div>
  );
}

/* ────────────── STEP 6 ────────────── */
function StepGoal({ data, patch }: { data: OnboardingData; patch: (d: Partial<OnboardingData>) => void }) {
  const opts = [
    { id: "weight-loss", label: "Weight Loss", desc: "Reduce overall body weight steadily", Icon: TrendingDown },
    { id: "weight-gain", label: "Weight Gain", desc: "Build mass with surplus calories", Icon: TrendingUp },
    { id: "muscle-gain", label: "Muscle Gain", desc: "Lean tissue with mild surplus", Icon: Dumbbell },
    { id: "fat-loss", label: "Fat Loss", desc: "Recomposition — keep muscle, lose fat", Icon: Flame },
    { id: "maintenance", label: "Maintenance", desc: "Hold current weight & feel great", Icon: Target },
  ] as const;
  return (
    <div>
      <H title="What's the mission?" />
      <div className="grid gap-3 md:grid-cols-3">
        {opts.map((o) => (
          <CardOption key={o.id} active={data.goal === o.id} onClick={() => patch({ goal: o.id })} className="hover:scale-[1.02]">
            <o.Icon className="h-7 w-7 text-primary" />
            <p className="mt-3 font-display text-lg">{o.label}</p>
            <p className="mt-1 text-xs text-muted-foreground">{o.desc}</p>
          </CardOption>
        ))}
      </div>
    </div>
  );
}

/* ────────────── STEP 7 ────────────── */
function StepSummary({ data }: { data: OnboardingData }) {
  const rows: [string, string][] = [
    ["Name", data.fullName || "—"],
    ["Age", String(data.age ?? "—")],
    ["Gender", data.gender ?? "—"],
    ["Height", data.heightCm ? `${data.heightCm} cm` : "—"],
    ["Current weight", data.weightKg ? `${data.weightKg} kg` : "—"],
    ["Target", data.targetWeightKg ? `${data.targetWeightKg} kg` : "—"],
    ["Activity", data.activity ?? "—"],
    ["Diet type", data.dietType ?? "—"],
    ["Allergies", data.allergies.join(", ") || "None"],
    ["Budget", data.budget ?? "—"],
    ["Workout", data.workout ?? "—"],
    ["Goal", data.goal ?? "—"],
  ];
  return (
    <div>
      <H title="Here's your profile." sub="Looks right? Hit generate." />
      <div className="glass rounded-3xl p-8">
        <div className="mb-6 flex items-center gap-4">
          <span className="grid h-14 w-14 place-items-center rounded-2xl bg-primary text-primary-foreground"><Scale className="h-6 w-6" /></span>
          <div>
            <p className="font-display text-xl">{data.fullName || "Your plan"}</p>
            <p className="text-sm text-muted-foreground">Generated just for you in seconds.</p>
          </div>
        </div>
        <dl className="grid gap-x-8 gap-y-3 sm:grid-cols-2">
          {rows.map(([k, v]) => (
            <div key={k} className="flex justify-between border-b border-border/60 pb-2 text-sm">
              <dt className="capitalize text-muted-foreground">{k}</dt>
              <dd className="font-medium capitalize">{v}</dd>
            </div>
          ))}
        </dl>
      </div>
    </div>
  );
}