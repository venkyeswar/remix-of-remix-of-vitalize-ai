import { useMemo } from "react";
import { useDietStore } from "@/lib/store";
import { getWeeklyPlan } from "@/lib/static-data";
import { useOnboardingStore } from "@/lib/store";

interface Props {
  days?: number;
}

export function StreakCalendar({ days = 35 }: Props) {
  const { logs } = useDietStore();
  const { data } = useOnboardingStore();
  const week = useMemo(() => getWeeklyPlan(data.dietType, data.workout), [data.dietType, data.workout]);
  const totalMeals = week[0]?.meals.length ?? 5;

  const cells = useMemo(() => {
    const out: { date: string; pct: number; label: string; dow: number }[] = [];
    const today = new Date();
    // align to Monday-start: figure days since last Monday
    const dow = today.getDay() === 0 ? 6 : today.getDay() - 1;
    // start from (days-1) ago, but pad to start on Monday for clean grid
    const totalCells = days + dow + (7 - ((days + dow) % 7)) % 7;
    for (let i = totalCells - 1; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(today.getDate() - i + (totalCells - days));
      const k = d.toISOString().slice(0, 10);
      const log = logs[k];
      const done = log ? Object.values(log.meals).filter(Boolean).length : 0;
      const pct = Math.min(1, done / totalMeals);
      out.push({
        date: k,
        pct,
        label: d.toLocaleDateString(undefined, { weekday: "short", month: "short", day: "numeric" }),
        dow: d.getDay() === 0 ? 6 : d.getDay() - 1,
      });
    }
    return out;
  }, [logs, totalMeals, days]);

  const dayLabels = ["M", "T", "W", "T", "F", "S", "S"];

  return (
    <div>
      <div className="grid grid-cols-7 gap-1.5">
        {dayLabels.map((l, i) => (
          <span key={i} className="text-center text-[10px] font-medium uppercase tracking-widest text-muted-foreground">{l}</span>
        ))}
        {cells.map((c) => {
          const intensity =
            c.pct === 0 ? "bg-muted/40 border-border/40"
              : c.pct < 0.34 ? "bg-primary/20 border-primary/30"
              : c.pct < 0.67 ? "bg-primary/45 border-primary/50"
              : c.pct < 1 ? "bg-primary/70 border-primary/70"
              : "bg-primary border-primary shadow-[0_0_0_2px_color-mix(in_oklab,var(--primary)_25%,transparent)]";
          const isToday = c.date === new Date().toISOString().slice(0, 10);
          return (
            <div
              key={c.date}
              title={`${c.label} — ${Math.round(c.pct * 100)}% complete`}
              className={`aspect-square rounded-md border transition-transform hover:scale-110 ${intensity} ${isToday ? "ring-2 ring-primary/60 ring-offset-2 ring-offset-background" : ""}`}
            />
          );
        })}
      </div>
      <div className="mt-4 flex items-center justify-between text-xs text-muted-foreground">
        <span>Less</span>
        <div className="flex items-center gap-1">
          <span className="h-3 w-3 rounded-sm bg-muted/40 border border-border/40" />
          <span className="h-3 w-3 rounded-sm bg-primary/20 border border-primary/30" />
          <span className="h-3 w-3 rounded-sm bg-primary/45 border border-primary/50" />
          <span className="h-3 w-3 rounded-sm bg-primary/70 border border-primary/70" />
          <span className="h-3 w-3 rounded-sm bg-primary border border-primary" />
        </div>
        <span>More</span>
      </div>
    </div>
  );
}
