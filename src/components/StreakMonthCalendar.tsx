import { useMemo, useState } from "react";
import { DayPicker } from "react-day-picker";
import { ChevronLeft, ChevronRight, Flame } from "lucide-react";
import { useDietStore, useOnboardingStore } from "@/lib/store";
import { getWeeklyPlan } from "@/lib/static-data";
import { cn } from "@/lib/utils";

export function StreakMonthCalendar() {
  const { logs } = useDietStore();
  const { data } = useOnboardingStore();
  const week = useMemo(() => getWeeklyPlan(data.dietType, data.workout), [data.dietType, data.workout]);
  const totalMeals = week[0]?.meals.length ?? 5;
  const [month, setMonth] = useState<Date>(new Date());

  const { full, partial, light, streak } = useMemo(() => {
    const f: Date[] = [], p: Date[] = [], l: Date[] = [];
    Object.entries(logs).forEach(([k, log]) => {
      const done = Object.values(log.meals).filter(Boolean).length;
      const pct = done / totalMeals;
      const d = new Date(k + "T00:00:00");
      if (pct >= 1) f.push(d);
      else if (pct >= 0.5) p.push(d);
      else if (pct > 0) l.push(d);
    });
    // current streak (consecutive full days ending today or yesterday)
    let s = 0;
    const cursor = new Date();
    cursor.setHours(0, 0, 0, 0);
    while (true) {
      const k = cursor.toISOString().slice(0, 10);
      const log = logs[k];
      const done = log ? Object.values(log.meals).filter(Boolean).length : 0;
      if (done / totalMeals >= 1) {
        s++;
        cursor.setDate(cursor.getDate() - 1);
      } else break;
    }
    return { full: f, partial: p, light: l, streak: s };
  }, [logs, totalMeals]);

  const monthLabel = month.toLocaleDateString(undefined, { month: "long", year: "numeric" });

  return (
    <div className="mx-auto w-full max-w-[560px]">
      <header className="mb-5 flex items-center justify-center gap-5">
        <button
          onClick={() => { const d = new Date(month); d.setMonth(d.getMonth() - 1); setMonth(d); }}
          className="grid h-10 w-10 place-items-center rounded-full border border-border/60 hover:bg-accent hover:border-primary/50 transition-colors"
          aria-label="Previous month"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
        <div className="text-center min-w-[180px]">
          <p className="font-display text-xl">{monthLabel}</p>
          <p className="mt-1 inline-flex items-center gap-1 text-xs text-primary">
            <Flame className="h-3 w-3" /> {streak}-day streak
          </p>
        </div>
        <button
          onClick={() => { const d = new Date(month); d.setMonth(d.getMonth() + 1); setMonth(d); }}
          className="grid h-10 w-10 place-items-center rounded-full border border-border/60 hover:bg-accent hover:border-primary/50 transition-colors"
          aria-label="Next month"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </header>

      <DayPicker
        mode="single"
        month={month}
        onMonthChange={setMonth}
        showOutsideDays
        hideNavigation
        hideWeekdays={false}
        modifiers={{ full, partial, light }}
        modifiersClassNames={{
          full: "streak-full",
          partial: "streak-partial",
          light: "streak-light",
          today: "streak-today",
        }}
        classNames={{
          months: "w-full",
          month: "w-full",
          month_caption: "hidden",
          weekdays: "grid grid-cols-7 mb-3",
          weekday: "text-center text-[10px] font-medium uppercase tracking-widest text-muted-foreground",
          week: "grid grid-cols-7 gap-2 mb-2",
          day: "aspect-square",
          day_button: cn(
            "w-full h-full rounded-xl border border-border/40 bg-muted/30 text-sm font-medium",
            "hover:border-primary/40 transition-colors flex items-center justify-center"
          ),
          outside: "opacity-30",
        }}
      />

      <div className="mt-6 flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-xs text-muted-foreground">
        <span className="inline-flex items-center gap-1.5"><span className="h-3 w-3 rounded bg-muted/40 border border-border/40" /> None</span>
        <span className="inline-flex items-center gap-1.5"><span className="h-3 w-3 rounded bg-primary/30 border border-primary/40" /> Some meals</span>
        <span className="inline-flex items-center gap-1.5"><span className="h-3 w-3 rounded bg-primary/60 border border-primary/60" /> Most meals</span>
        <span className="inline-flex items-center gap-1.5"><span className="h-3 w-3 rounded bg-primary border border-primary" /> All meals</span>
      </div>
    </div>
  );
}
