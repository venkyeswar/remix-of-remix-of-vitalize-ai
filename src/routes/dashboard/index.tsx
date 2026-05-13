import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { LineChart as RLineChart, Line, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts";
import { Flame, Droplet, Trophy, Scale, Check, Plus, Minus, Dumbbell, CalendarDays } from "lucide-react";
import { StatCard } from "@/components/StatCard";
import { MacroRing } from "@/components/MacroRing";
import { useUserStore, useOnboardingStore, useDietStore } from "@/lib/store";
import { calculate } from "@/lib/calculations";
import { getWeeklyPlan, todayName, DAY_NAMES } from "@/lib/static-data";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/dashboard/")({
  head: () => ({ meta: [{ title: "Dashboard — NorthForm" }] }),
  component: DashHome,
});

const WATER_GOAL = 3000;
const dateForDay = (dayName: string) => {
  // get date for currently-selected weekday in current week (Mon-first)
  const idx = DAY_NAMES.indexOf(dayName);
  const today = new Date();
  const jsDay = today.getDay();
  const todayIdx = jsDay === 0 ? 6 : jsDay - 1;
  const diff = idx - todayIdx;
  const d = new Date(today);
  d.setDate(today.getDate() + diff);
  return d.toISOString().slice(0, 10);
};

function DashHome() {
  const user = useUserStore((s) => s.user);
  const data = useOnboardingStore((s) => s.data);
  const calc = useMemo(() => calculate(data), [data]);
  const { weightLog, logs, toggleMeal, addWater, toggleWorkout } = useDietStore();

  const [selectedDay, setSelectedDay] = useState<string>(todayName());
  const week = useMemo(() => getWeeklyPlan(data.dietType, data.workout), [data.dietType, data.workout]);
  const dayPlan = week.find((d) => d.day === selectedDay) ?? week[0];
  const date = dateForDay(selectedDay);
  const log = logs[date] ?? { date, meals: {}, waterMl: 0, workoutDone: false };

  const greeting = (() => {
    const h = new Date().getHours();
    return h < 12 ? "Good morning" : h < 18 ? "Good afternoon" : "Good evening";
  })();

  const eaten = dayPlan.meals.reduce((s, m) => s + (log.meals[m.key] ? m.calories : 0), 0);
  const completionPct = Math.round((Object.values(log.meals).filter(Boolean).length / dayPlan.meals.length) * 100) || 0;
  const waterPct = Math.min(100, Math.round((log.waterMl / WATER_GOAL) * 100));

  // streak: count of recent consecutive days with >=50% meal completion
  const streak = useMemo(() => {
    let s = 0;
    for (let i = 0; i < 30; i++) {
      const d = new Date(); d.setDate(d.getDate() - i);
      const k = d.toISOString().slice(0, 10);
      const l = logs[k];
      const total = week[0]?.meals.length ?? 5;
      const done = l ? Object.values(l.meals).filter(Boolean).length : 0;
      if (done / total >= 0.5) s++; else break;
    }
    return s;
  }, [logs, week]);

  return (
    <div className="relative mx-auto max-w-6xl px-4 py-8 md:px-6 md:py-10">
      <div className="food-motif" />
      <header className="relative mb-8">
        <p className="text-xs uppercase tracking-widest text-muted-foreground">
          {new Date().toLocaleDateString(undefined, { weekday: "long", month: "long", day: "numeric" })}
        </p>
        <h1 className="mt-2 font-display text-3xl font-semibold tracking-tight md:text-4xl">
          {greeting}, {user.name.split(" ")[0]} <span className="ml-1">👋</span>
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">Here's your plan for {selectedDay}. Tap meals as you eat them.</p>
      </header>

      {/* Stat strip */}
      <div className="grid gap-3 md:grid-cols-4">
        <StatCard label="Daily target" value={calc.calories} suffix="kcal" icon={Flame} hint={`Eaten ${eaten}`} />
        <StatCard label="Water" value={log.waterMl} suffix="ml" icon={Droplet} hint={`${waterPct}% of ${WATER_GOAL}`} />
        <StatCard label="Streak" value={streak} suffix={streak === 1 ? "day" : "days"} icon={Trophy} hint="Keep it going" />
        <StatCard label="Current" value={data.weightKg ?? 78} suffix="kg" icon={Scale} hint={`Target ${data.targetWeightKg ?? 72} kg`} />
      </div>

      {/* Day picker */}
      <div className="mt-8 flex items-center gap-2 overflow-x-auto rounded-2xl border border-border/60 bg-card/40 p-2">
        <CalendarDays className="ml-2 h-4 w-4 shrink-0 text-muted-foreground" />
        {week.map((d) => {
          const active = d.day === selectedDay;
          const isToday = d.day === todayName();
          return (
            <button key={d.day} onClick={() => setSelectedDay(d.day)}
              className={`shrink-0 rounded-xl px-3 py-2 text-xs font-medium transition-colors ${active ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-muted hover:text-foreground"}`}>
              {d.day.slice(0, 3)} {isToday && <span className="ml-1 opacity-70">·today</span>}
            </button>
          );
        })}
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1.5fr_1fr]">
        {/* Meal plan */}
        <div className="glass rounded-3xl p-6 md:p-7">
          <div className="mb-4 flex flex-wrap items-end justify-between gap-2">
            <div>
              <p className="text-xs uppercase tracking-widest text-muted-foreground">{selectedDay}'s meals</p>
              <h2 className="mt-1 font-display text-2xl">{dayPlan.totalCalories} kcal · {dayPlan.meals.length} items</h2>
            </div>
            <div className="text-right">
              <p className="text-xs text-muted-foreground">Completion</p>
              <p className="font-display text-2xl text-primary">{completionPct}%</p>
            </div>
          </div>
          <div className="mb-4 h-1.5 w-full overflow-hidden rounded-full bg-border">
            <div className="h-full rounded-full bg-primary transition-all duration-500" style={{ width: `${completionPct}%` }} />
          </div>
          <ul className="space-y-2">
            {dayPlan.meals.map((m) => {
              const isDone = !!log.meals[m.key];
              const tag = m.key === "pre" ? "Pre-workout" : m.key === "post" ? "Post-workout" : m.key.replace("_", " ");
              return (
                <li key={m.key} className="flex items-center gap-3 rounded-2xl border border-border/60 bg-background/40 p-3">
                  <button onClick={() => toggleMeal(date, m.key)}
                    className={`grid h-8 w-8 shrink-0 place-items-center rounded-full border transition-colors ${isDone ? "border-primary bg-primary text-primary-foreground" : "border-border hover:border-primary/60"}`}>
                    {isDone && <Check className="h-4 w-4" />}
                  </button>
                  <div className="min-w-0 flex-1">
                    <p className="text-[10px] uppercase tracking-widest text-muted-foreground">
                      {m.time} · <span className={(m.key === "pre" || m.key === "post") ? "text-primary" : ""}>{tag}</span>
                    </p>
                    <p className={`mt-0.5 truncate text-sm font-medium md:text-[15px] ${isDone ? "line-through opacity-60" : ""}`}>{m.name}</p>
                    <p className="mt-1 text-[11px] text-muted-foreground">P {m.protein}g · C {m.carbs}g · F {m.fat}g</p>
                  </div>
                  <span className="shrink-0 text-sm text-muted-foreground">{m.calories} kcal</span>
                </li>
              );
            })}
          </ul>
        </div>

        {/* Side panels */}
        <div className="space-y-6">
          {/* Water tracker */}
          <div className="glass rounded-3xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-widest text-muted-foreground">Water intake</p>
                <p className="mt-1 font-display text-2xl">{log.waterMl} <span className="text-sm text-muted-foreground">/ {WATER_GOAL} ml</span></p>
              </div>
              <Droplet className="h-6 w-6 text-primary" />
            </div>
            <div className="mt-4 grid grid-cols-8 gap-1.5">
              {Array.from({ length: 8 }).map((_, i) => {
                const filled = log.waterMl >= (i + 1) * 250;
                return (
                  <button key={i} onClick={() => addWater(date, filled ? -250 : 250)}
                    className={`h-12 rounded-md border transition-all ${filled ? "border-primary bg-primary/30" : "border-border bg-background/40 hover:border-primary/50"}`}
                    title="250 ml glass" />
                );
              })}
            </div>
            <div className="mt-3 flex items-center justify-between">
              <Button size="sm" variant="outline" className="rounded-full" onClick={() => addWater(date, -250)}>
                <Minus className="mr-1 h-3.5 w-3.5" /> 250 ml
              </Button>
              <p className="text-xs text-muted-foreground">Tap a glass to fill / unfill</p>
              <Button size="sm" className="rounded-full" onClick={() => addWater(date, 250)}>
                <Plus className="mr-1 h-3.5 w-3.5" /> 250 ml
              </Button>
            </div>
          </div>

          {/* Workout */}
          {data.workout && data.workout !== "none" && (
            <div className="glass rounded-3xl p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs uppercase tracking-widest text-muted-foreground">Today's workout</p>
                  <p className="mt-1 font-display text-2xl capitalize">{data.workout} session</p>
                </div>
                <Dumbbell className="h-6 w-6 text-primary" />
              </div>
              <p className="mt-2 text-sm text-muted-foreground">
                {data.workout === "gym" ? "Push / Pull / Legs split — 45–60 min" : "Bodyweight circuit — 25–30 min"}
              </p>
              <Button onClick={() => toggleWorkout(date)} variant={log.workoutDone ? "default" : "outline"} className="mt-4 w-full rounded-full">
                {log.workoutDone ? <><Check className="mr-1 h-4 w-4" /> Marked done</> : "Mark workout done"}
              </Button>
            </div>
          )}

          {/* Macros */}
          <div className="glass rounded-3xl p-6 text-center">
            <p className="text-xs uppercase tracking-widest text-muted-foreground">Today's macros</p>
            <div className="mt-3 flex justify-center"><MacroRing protein={calc.protein} carbs={calc.carbs} fat={calc.fat} calories={calc.calories} size={180} /></div>
            <div className="mt-4 grid grid-cols-3 gap-2 text-xs">
              {[["Protein", calc.protein, "var(--primary)"], ["Carbs", calc.carbs, "var(--chart-2)"], ["Fat", calc.fat, "var(--chart-3)"]].map(([l, v, c]) => (
                <div key={l as string} className="rounded-xl border border-border bg-background/40 p-2">
                  <span className="inline-block h-2 w-2 rounded-full" style={{ background: c as string }} />
                  <p className="mt-1 text-muted-foreground">{l as string}</p>
                  <p className="font-display text-base">{v as number}g</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Weekly weight */}
      <div className="mt-8 glass rounded-3xl p-6 md:p-7">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-widest text-muted-foreground">Weight progress</p>
            <h2 className="mt-1 font-display text-2xl">Last 8 weeks</h2>
          </div>
          <Button asChild size="sm" variant="outline" className="rounded-full">
            <Link to="/dashboard/progress">Open progress</Link>
          </Button>
        </div>
        <div className="h-56">
          <ResponsiveContainer width="100%" height="100%">
            <RLineChart data={weightLog}>
              <XAxis dataKey="date" tick={{ fill: "var(--muted-foreground)", fontSize: 10 }} />
              <YAxis tick={{ fill: "var(--muted-foreground)", fontSize: 10 }} domain={["auto", "auto"]} />
              <Tooltip contentStyle={{ background: "var(--popover)", color: "var(--popover-foreground)", border: "1px solid var(--border)", borderRadius: 12 }} />
              <Line type="monotone" dataKey="kg" stroke="var(--primary)" strokeWidth={2.5} dot={{ r: 3, fill: "var(--primary)" }} />
            </RLineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
