import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo } from "react";
import { Plus, Check, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useOnboardingStore, useDietStore } from "@/lib/store";
import { getWeeklyPlan, todayName, DAY_NAMES } from "@/lib/static-data";

export const Route = createFileRoute("/dashboard/diet-plans")({
  head: () => ({ meta: [{ title: "Weekly diet — NorthForm" }] }),
  component: DietPlansPage,
});

const dateForDay = (dayName: string) => {
  const idx = DAY_NAMES.indexOf(dayName);
  const today = new Date();
  const jsDay = today.getDay();
  const todayIdx = jsDay === 0 ? 6 : jsDay - 1;
  const d = new Date(today);
  d.setDate(today.getDate() + (idx - todayIdx));
  return d.toISOString().slice(0, 10);
};

function DietPlansPage() {
  const data = useOnboardingStore((s) => s.data);
  const { logs, toggleMeal } = useDietStore();
  const week = useMemo(() => getWeeklyPlan(data.dietType, data.workout), [data.dietType, data.workout]);

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 md:px-6 md:py-10">
      <header className="mb-8 flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-widest text-muted-foreground">Your week</p>
          <h1 className="mt-2 font-display text-3xl font-semibold tracking-tight md:text-4xl">7-day diet plan</h1>
          <p className="mt-2 text-sm text-muted-foreground capitalize">
            {data.dietType ?? "vegetarian"} · {data.workout ?? "no"} workout · {data.budget ?? "moderate"} budget
          </p>
        </div>
        <Button asChild className="rounded-full"><Link to="/onboarding"><Plus className="mr-1 h-4 w-4" /> Re-generate</Link></Button>
      </header>

      <div className="space-y-5">
        {week.map((day) => {
          const date = dateForDay(day.day);
          const dayLog = logs[date] ?? { meals: {} };
          const doneCount = day.meals.filter((m) => dayLog.meals[m.key]).length;
          const isToday = day.day === todayName();
          return (
            <section key={day.day} className={`glass rounded-3xl p-5 md:p-7 ${isToday ? "ring-2 ring-primary/40" : ""}`}>
              <header className="mb-4 flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-3">
                  <span className="grid h-10 w-10 place-items-center rounded-2xl bg-primary/15 text-sm font-semibold text-primary">
                    {day.day.slice(0, 2).toUpperCase()}
                  </span>
                  <div>
                    <h2 className="font-display text-xl">{day.day} {isToday && <span className="ml-1 text-xs font-normal text-primary">· today</span>}</h2>
                    <p className="text-xs text-muted-foreground">{day.totalCalories} kcal · {day.meals.length} meals</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground">{doneCount}/{day.meals.length} done</span>
                  <div className="h-1.5 w-24 overflow-hidden rounded-full bg-border">
                    <div className="h-full bg-primary" style={{ width: `${(doneCount / day.meals.length) * 100}%` }} />
                  </div>
                </div>
              </header>

              <div className="grid gap-2 md:grid-cols-2">
                {day.meals.map((m) => {
                  const isDone = !!dayLog.meals[m.key];
                  const isWorkout = m.key === "pre" || m.key === "post";
                  return (
                    <button key={m.key} onClick={() => toggleMeal(date, m.key)}
                      className={`group flex items-start gap-3 rounded-2xl border p-3 text-left transition-all ${isDone ? "border-primary/60 bg-primary/5" : "border-border/60 bg-background/40 hover:border-primary/50"}`}>
                      <span className={`mt-0.5 grid h-7 w-7 shrink-0 place-items-center rounded-full border ${isDone ? "border-primary bg-primary text-primary-foreground" : "border-border"}`}>
                        {isDone && <Check className="h-3.5 w-3.5" />}
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="text-[10px] uppercase tracking-widest text-muted-foreground">
                          {m.time} · {isWorkout ? <span className="text-primary inline-flex items-center gap-1"><Sparkles className="h-3 w-3" />{m.key === "pre" ? "Pre-workout" : "Post-workout"}</span> : m.key.replace("_", " ")}
                        </p>
                        <p className={`mt-0.5 text-sm font-medium ${isDone ? "line-through opacity-60" : ""}`}>{m.name}</p>
                        <p className="mt-1 text-[11px] text-muted-foreground">{m.calories} kcal · P {m.protein}g · C {m.carbs}g · F {m.fat}g</p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}
