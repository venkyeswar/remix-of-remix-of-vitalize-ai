import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Area, AreaChart, Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid } from "recharts";
import { Scale, Flame, Droplet, Trophy, TrendingDown, Plus, Activity } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useOnboardingStore, useDietStore } from "@/lib/store";
import { calculate } from "@/lib/calculations";
import { getWeeklyPlan, DAY_NAMES } from "@/lib/static-data";
import { StatCard } from "@/components/StatCard";
import { StreakCalendar } from "@/components/StreakCalendar";

export const Route = createFileRoute("/dashboard/progress")({
  head: () => ({ meta: [{ title: "Progress — NorthForm" }] }),
  component: ProgressPage,
});

const dateForDay = (idx: number) => {
  const today = new Date();
  const jsDay = today.getDay();
  const todayIdx = jsDay === 0 ? 6 : jsDay - 1;
  const d = new Date(today);
  d.setDate(today.getDate() + (idx - todayIdx));
  return d.toISOString().slice(0, 10);
};

function ProgressPage() {
  const data = useOnboardingStore((s) => s.data);
  const calc = useMemo(() => calculate(data), [data]);
  const { weightLog, logs, logWeight } = useDietStore();
  const week = useMemo(() => getWeeklyPlan(data.dietType, data.workout), [data.dietType, data.workout]);
  const [newWeight, setNewWeight] = useState("");

  const start = weightLog[0]?.kg ?? 0;
  const current = weightLog.at(-1)?.kg ?? 0;
  const lost = +(start - current).toFixed(1);
  const target = data.targetWeightKg ?? current;
  const toGo = +(current - target).toFixed(1);
  const progressPct = Math.max(0, Math.min(100, Math.round(((start - current) / Math.max(0.1, start - target)) * 100)));

  // weekly compliance chart
  const weeklyData = week.map((day, i) => {
    const date = dateForDay(i);
    const log = logs[date];
    const total = day.meals.length;
    const done = log ? Object.values(log.meals).filter(Boolean).length : 0;
    return {
      day: day.day.slice(0, 3),
      compliance: Math.round((done / total) * 100),
      water: log?.waterMl ?? 0,
      kcalEaten: day.meals.reduce((s, m) => s + (log?.meals[m.key] ? m.calories : 0), 0),
    };
  });

  const avgCompliance = Math.round(weeklyData.reduce((s, d) => s + d.compliance, 0) / weeklyData.length) || 0;
  const avgWater = Math.round(weeklyData.reduce((s, d) => s + d.water, 0) / weeklyData.length) || 0;
  const totalKcal = weeklyData.reduce((s, d) => s + d.kcalEaten, 0);

  // BMI
  const h = (data.heightCm ?? 170) / 100;
  const bmi = +(current / (h * h)).toFixed(1);
  const bmiCat = bmi < 18.5 ? "Underweight" : bmi < 25 ? "Healthy" : bmi < 30 ? "Overweight" : "Obese";

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 md:px-6 md:py-10">
      <header className="mb-8">
        <p className="text-xs uppercase tracking-widest text-muted-foreground">Progress</p>
        <h1 className="mt-2 font-display text-3xl font-semibold tracking-tight md:text-4xl">Your transformation</h1>
        <p className="mt-2 text-sm text-muted-foreground">Numbers don't lie — and they're moving the right way.</p>
      </header>

      <div className="grid gap-3 md:grid-cols-4">
        <StatCard label="Weight lost" value={lost} suffix="kg" icon={TrendingDown} hint={`From ${start} kg`} />
        <StatCard label="To target" value={Math.abs(toGo)} suffix="kg" icon={Scale} hint={`Goal ${target} kg`} />
        <StatCard label="Avg compliance" value={avgCompliance} suffix="%" icon={Trophy} hint="this week" />
        <StatCard label="BMI" value={bmi} icon={Activity} hint={bmiCat} />
      </div>

      {/* Weight chart */}
      <div className="mt-6 grid gap-6 lg:grid-cols-[1.5fr_1fr]">
        <div className="glass rounded-3xl p-6 md:p-7">
          <header className="mb-4 flex items-end justify-between">
            <div>
              <p className="text-xs uppercase tracking-widest text-muted-foreground">Weight journey</p>
              <h2 className="mt-1 font-display text-2xl">Last 8 weeks</h2>
            </div>
            <div className="text-right">
              <p className="text-xs text-muted-foreground">Goal progress</p>
              <p className="font-display text-2xl text-primary">{progressPct}%</p>
            </div>
          </header>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={weightLog}>
                <defs>
                  <linearGradient id="wg" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--primary)" stopOpacity={0.4} />
                    <stop offset="100%" stopColor="var(--primary)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="var(--border)" strokeDasharray="2 4" vertical={false} />
                <XAxis dataKey="date" tick={{ fill: "var(--muted-foreground)", fontSize: 10 }} />
                <YAxis tick={{ fill: "var(--muted-foreground)", fontSize: 10 }} domain={["auto", "auto"]} />
                <Tooltip contentStyle={{ background: "var(--popover)", color: "var(--popover-foreground)", border: "1px solid var(--border)", borderRadius: 12 }} />
                <Area type="monotone" dataKey="kg" stroke="var(--primary)" strokeWidth={2.5} fill="url(#wg)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Log weight */}
        <div className="glass flex flex-col rounded-3xl p-6">
          <p className="text-xs uppercase tracking-widest text-muted-foreground">Log today's weight</p>
          <div className="mt-4 flex items-center gap-2">
            <input value={newWeight} onChange={(e) => setNewWeight(e.target.value)} type="number" step="0.1"
              placeholder={`${current} kg`}
              className="h-12 flex-1 rounded-xl border border-border bg-background/40 px-4 text-sm outline-none focus:border-primary" />
            <Button onClick={() => { const v = parseFloat(newWeight); if (v > 0) { logWeight(v); setNewWeight(""); } }} className="h-12 rounded-xl">
              <Plus className="mr-1 h-4 w-4" /> Log
            </Button>
          </div>
          <div className="mt-6 space-y-2">
            <p className="text-xs uppercase tracking-widest text-muted-foreground">Recent entries</p>
            {weightLog.slice(-5).reverse().map((w) => (
              <div key={w.date} className="flex items-center justify-between rounded-xl border border-border/60 bg-background/40 px-3 py-2 text-sm">
                <span className="text-muted-foreground">{w.date}</span>
                <span className="font-medium">{w.kg} kg</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Weekly compliance & water */}
      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <div className="glass rounded-3xl p-6 md:p-7">
          <p className="text-xs uppercase tracking-widest text-muted-foreground">Meal compliance</p>
          <h2 className="mt-1 font-display text-xl">This week</h2>
          <div className="mt-4 h-52">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weeklyData}>
                <CartesianGrid stroke="var(--border)" strokeDasharray="2 4" vertical={false} />
                <XAxis dataKey="day" tick={{ fill: "var(--muted-foreground)", fontSize: 11 }} />
                <YAxis tick={{ fill: "var(--muted-foreground)", fontSize: 10 }} domain={[0, 100]} />
                <Tooltip contentStyle={{ background: "var(--popover)", color: "var(--popover-foreground)", border: "1px solid var(--border)", borderRadius: 12 }} />
                <Bar dataKey="compliance" fill="var(--primary)" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="glass rounded-3xl p-6 md:p-7">
          <p className="text-xs uppercase tracking-widest text-muted-foreground">Hydration</p>
          <h2 className="mt-1 font-display text-xl">Daily water (ml)</h2>
          <div className="mt-4 h-52">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weeklyData}>
                <CartesianGrid stroke="var(--border)" strokeDasharray="2 4" vertical={false} />
                <XAxis dataKey="day" tick={{ fill: "var(--muted-foreground)", fontSize: 11 }} />
                <YAxis tick={{ fill: "var(--muted-foreground)", fontSize: 10 }} />
                <Tooltip contentStyle={{ background: "var(--popover)", color: "var(--popover-foreground)", border: "1px solid var(--border)", borderRadius: 12 }} />
                <Bar dataKey="water" fill="var(--chart-2)" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <p className="mt-3 text-xs text-muted-foreground">Average <span className="text-foreground">{avgWater} ml/day</span> · weekly intake {totalKcal > 0 ? `${totalKcal.toLocaleString()} kcal logged` : "track meals to see kcal"}</p>
        </div>
      </div>

      {/* Macro targets */}
      <div className="mt-6 glass rounded-3xl p-6 md:p-7">
        <p className="text-xs uppercase tracking-widest text-muted-foreground">Daily targets</p>
        <h2 className="mt-1 font-display text-xl">Macro & calorie goals</h2>
        <div className="mt-4 grid gap-3 md:grid-cols-4">
          {[
            { label: "Calories", value: calc.calories, unit: "kcal", icon: Flame },
            { label: "Protein", value: calc.protein, unit: "g", icon: Activity },
            { label: "Carbs", value: calc.carbs, unit: "g", icon: Activity },
            { label: "Fat", value: calc.fat, unit: "g", icon: Droplet },
          ].map((s) => (
            <div key={s.label} className="rounded-2xl border border-border/60 bg-background/40 p-4">
              <p className="text-xs uppercase tracking-widest text-muted-foreground">{s.label}</p>
              <p className="mt-2 font-display text-2xl">{s.value}<span className="ml-1 text-sm text-muted-foreground">{s.unit}</span></p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
