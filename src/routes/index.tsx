import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import {
  ArrowRight, Calculator, Utensils, Donut, Shield, Gauge, Headset,
  Sparkles, Lock, CheckCircle2,
} from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { MacroRing } from "@/components/MacroRing";
import { features, howItWorks, socialProof, testimonials, staticDietPlans } from "@/lib/static-data";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "NorthForm — Personalized diet & fitness plans, instantly" },
      { name: "description", content: "Calibrated nutrition for real bodies. Get a science-backed diet plan tuned to your body, lifestyle and goal in under 2 minutes." },
      { property: "og:title", content: "NorthForm — Personalized diet & fitness plans, instantly" },
      { property: "og:description", content: "Calibrated nutrition for real bodies. Get a plan tuned to your body and goal in under 2 minutes." },
    ],
  }),
  component: Landing,
});

const ICONS: Record<string, React.ElementType> = {
  calculator: Calculator, utensils: Utensils, donut: Donut, shield: Shield, gauge: Gauge, headset: Headset,
};

function Landing() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <Hero />
      <SocialProofBar />
      <HowItWorks />
      <Features />
      <SamplePlan />
      <Testimonials />
      <FinalCTA />
      <Footer />
    </div>
  );
}

function Hero() {
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".hero-word", { y: 40, opacity: 0, stagger: 0.08, duration: 0.8, ease: "power3.out" });
      gsap.from(".hero-sub", { y: 20, opacity: 0, delay: 0.4, duration: 0.6 });
      gsap.from(".hero-cta", { y: 16, opacity: 0, delay: 0.55, duration: 0.5, stagger: 0.08 });
      gsap.from(cardRef.current, { y: 60, opacity: 0, delay: 0.7, duration: 1, ease: "power3.out" });
      gsap.to(cardRef.current, {
        y: -12, duration: 4, repeat: -1, yoyo: true, ease: "sine.inOut",
      });
    });
    return () => ctx.revert();
  }, []);

  const words = ["Nutrition", "calibrated", "to", "the", "body", "you", "actually", "have."];
  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 mesh-bg opacity-60" />
      <div className="absolute inset-0 grid-bg opacity-40" />
      <div className="relative mx-auto grid max-w-7xl gap-12 px-6 pt-20 pb-28 lg:grid-cols-[1.1fr_1fr] lg:items-center lg:pt-28">
        <div>
          <div className="hero-cta inline-flex items-center gap-2 rounded-full border border-border bg-card/60 px-3 py-1.5 text-xs text-muted-foreground backdrop-blur">
            <Sparkles className="h-3 w-3 text-primary" />
            New — cuisine-aware planning is live
          </div>
          <h1 ref={headlineRef} className="mt-6 font-display text-5xl font-semibold leading-[1.05] tracking-tight md:text-6xl lg:text-7xl">
            {words.map((w, i) => (
              <span key={i} className="hero-word inline-block">
                {i === 1 ? <span className="text-primary">{w}</span> : w}
                {i < words.length - 1 && <span>&nbsp;</span>}
              </span>
            ))}
          </h1>
          <p className="hero-sub mt-6 max-w-xl text-lg text-muted-foreground">
            Answer 7 short questions. Get a science-backed diet plan, macro split and meal schedule built around your goal, taste and budget — in under two minutes.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Button asChild size="lg" className="hero-cta rounded-full px-7 text-base font-medium">
              <Link to="/onboarding">Get my free plan <ArrowRight className="ml-1 h-4 w-4" /></Link>
            </Button>
            <Button asChild size="lg" variant="ghost" className="hero-cta rounded-full px-7 text-base">
              <a href="#how">See how it works</a>
            </Button>
          </div>
          <div className="hero-cta mt-8 flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-muted-foreground">
            <span className="inline-flex items-center gap-1.5"><CheckCircle2 className="h-3.5 w-3.5 text-primary" /> No credit card</span>
            <span className="inline-flex items-center gap-1.5"><CheckCircle2 className="h-3.5 w-3.5 text-primary" /> Built on Mifflin-St Jeor</span>
            <span className="inline-flex items-center gap-1.5"><CheckCircle2 className="h-3.5 w-3.5 text-primary" /> 10,000+ plans generated</span>
          </div>
        </div>

        <div ref={cardRef} className="relative">
          <div className="glass relative rounded-3xl p-6 shadow-2xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-widest text-muted-foreground">Today</p>
                <p className="font-display text-xl font-semibold">Good morning, Alex</p>
              </div>
              <span className="rounded-full bg-primary/15 px-3 py-1 text-xs font-medium text-primary">Day 12 · streak</span>
            </div>
            <div className="mt-6 grid grid-cols-3 gap-3">
              {[
                { l: "Calories", v: "1,840" },
                { l: "Protein", v: "138g" },
                { l: "Water", v: "2.4L" },
              ].map((s) => (
                <div key={s.l} className="rounded-xl border border-border bg-background/50 p-3">
                  <p className="text-[10px] uppercase tracking-widest text-muted-foreground">{s.l}</p>
                  <p className="mt-1 font-display text-lg">{s.v}</p>
                </div>
              ))}
            </div>
            <div className="mt-6 flex items-center gap-5">
              <MacroRing protein={138} carbs={205} fat={51} size={150} calories={1840} />
              <div className="space-y-2 text-sm">
                <Row dot="var(--primary)" label="Protein" value="138g · 30%" />
                <Row dot="var(--chart-2)" label="Carbs" value="205g · 45%" />
                <Row dot="var(--chart-3)" label="Fat" value="51g · 25%" />
              </div>
            </div>
            <div className="mt-6 rounded-xl border border-dashed border-border p-3 text-xs text-muted-foreground">
              Next meal · Grilled salmon, quinoa, tenderstem · 7:00 PM
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Row({ dot, label, value }: { dot: string; label: string; value: string }) {
  return (
    <div className="flex items-center gap-2">
      <span className="h-2.5 w-2.5 rounded-full" style={{ background: dot }} />
      <span className="text-muted-foreground">{label}</span>
      <span className="ml-auto font-medium">{value}</span>
    </div>
  );
}

function SocialProofBar() {
  const items = [...socialProof, ...socialProof];
  return (
    <section className="border-y border-border/60 bg-card/30 py-6">
      <div className="overflow-hidden">
        <div className="marquee flex gap-12 whitespace-nowrap text-sm uppercase tracking-widest text-muted-foreground">
          {items.map((i, idx) => (
            <span key={idx} className="flex items-center gap-12">
              {i}
              <span className="h-1 w-1 rounded-full bg-primary/50" />
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}

function HowItWorks() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        gsap.from(el.querySelectorAll(".hiw-card"), { y: 30, opacity: 0, stagger: 0.12, duration: 0.7, ease: "power3.out" });
        obs.disconnect();
      }
    }, { threshold: 0.2 });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return (
    <section id="how" ref={ref} className="mx-auto max-w-7xl px-6 py-28">
      <div className="mb-14 max-w-2xl">
        <p className="text-xs uppercase tracking-widest text-primary">How it works</p>
        <h2 className="mt-3 font-display text-4xl font-semibold tracking-tight md:text-5xl">From confused to calibrated in two minutes.</h2>
      </div>
      <div className="grid gap-6 md:grid-cols-3">
        {howItWorks.map((s) => (
          <div key={s.n} className="hiw-card lift glass rounded-3xl p-7">
            <span className="font-display text-5xl text-primary">{s.n}</span>
            <h3 className="mt-6 text-xl font-semibold">{s.title}</h3>
            <p className="mt-2 text-sm text-muted-foreground">{s.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function Features() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current; if (!el) return;
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) {
        gsap.from(el.querySelectorAll(".feat"), { y: 24, opacity: 0, stagger: 0.08, duration: 0.6 });
        obs.disconnect();
      }
    }, { threshold: 0.15 });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  // bento sizes
  const sizes = ["md:col-span-2", "", "", "", "md:col-span-2", ""];
  return (
    <section id="features" className="bg-card/30 py-28">
      <div ref={ref} className="mx-auto max-w-7xl px-6">
        <div className="mb-14 max-w-2xl">
          <p className="text-xs uppercase tracking-widest text-primary">Features</p>
          <h2 className="mt-3 font-display text-4xl font-semibold tracking-tight md:text-5xl">
            Built like a tool, not a brochure.
          </h2>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {features.map((f, i) => {
            const Icon = ICONS[f.icon] ?? Sparkles;
            return (
              <div key={f.title} className={`feat lift glass rounded-3xl p-7 ${sizes[i] ?? ""}`}>
                <span className="grid h-10 w-10 place-items-center rounded-xl bg-primary/15 text-primary">
                  <Icon className="h-5 w-5" />
                </span>
                <h3 className="mt-5 text-lg font-semibold">{f.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{f.desc}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function SamplePlan() {
  const plan = staticDietPlans[0];
  return (
    <section id="sample" className="mx-auto max-w-7xl px-6 py-28">
      <div className="mb-14 max-w-2xl">
        <p className="text-xs uppercase tracking-widest text-primary">A peek inside</p>
        <h2 className="mt-3 font-display text-4xl font-semibold tracking-tight md:text-5xl">
          Real meals, real timings, real macros.
        </h2>
      </div>
      <div className="relative">
        <div className="glass rounded-3xl p-8">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-widest text-muted-foreground">Plan A</p>
              <h3 className="font-display text-2xl">{plan.name}</h3>
            </div>
            <span className="rounded-full bg-primary/15 px-3 py-1 text-xs font-medium text-primary">{plan.totalCalories} kcal</span>
          </div>
          <div className="grid gap-3 md:grid-cols-2">
            {Object.values(plan.meals).map((m) => (
              <div key={m.name} className="flex items-center justify-between rounded-2xl border border-border/60 bg-background/40 p-4">
                <div>
                  <p className="text-xs uppercase tracking-widest text-muted-foreground">{m.time}</p>
                  <p className="mt-1 font-medium">{m.name}</p>
                </div>
                <span className="text-sm text-muted-foreground">{m.calories} kcal</span>
              </div>
            ))}
          </div>
        </div>
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/2 rounded-b-3xl bg-gradient-to-t from-background via-background/80 to-transparent" />
        <div className="absolute inset-x-0 bottom-10 flex flex-col items-center gap-4">
          <span className="grid h-12 w-12 place-items-center rounded-full bg-primary text-primary-foreground"><Lock className="h-5 w-5" /></span>
          <p className="text-center font-display text-xl">Unlock your personalized plan</p>
          <Button asChild className="pointer-events-auto rounded-full">
            <Link to="/onboarding">Build mine now</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}

function Testimonials() {
  return (
    <section className="bg-card/30 py-28">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mb-14 max-w-2xl">
          <p className="text-xs uppercase tracking-widest text-primary">From the community</p>
          <h2 className="mt-3 font-display text-4xl font-semibold tracking-tight md:text-5xl">People who stopped guessing.</h2>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          {testimonials.map((t) => (
            <figure key={t.name} className="lift glass rounded-3xl p-7">
              <blockquote className="text-base leading-relaxed">"{t.quote}"</blockquote>
              <figcaption className="mt-6 flex items-center gap-3">
                <span className="grid h-10 w-10 place-items-center rounded-full bg-primary/20 font-semibold text-primary">
                  {t.name.split(" ").map((p) => p[0]).join("")}
                </span>
                <div>
                  <p className="text-sm font-medium">{t.name}</p>
                  <p className="text-xs text-primary">{t.goal}</p>
                </div>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}

function FinalCTA() {
  return (
    <section className="relative mx-auto my-20 max-w-7xl overflow-hidden rounded-[2rem] border border-border px-6 py-20 text-center">
      <div className="absolute inset-0 mesh-bg opacity-80" />
      <div className="relative">
        <h2 className="mx-auto max-w-3xl font-display text-4xl font-semibold tracking-tight md:text-6xl">
          Start your transformation today.
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
          Two minutes of questions. A plan that respects your body, your kitchen and your calendar.
        </p>
        <Button asChild size="lg" className="mt-8 rounded-full px-8 text-base font-medium">
          <Link to="/onboarding">Build my free plan <ArrowRight className="ml-1 h-4 w-4" /></Link>
        </Button>
      </div>
    </section>
  );
}
