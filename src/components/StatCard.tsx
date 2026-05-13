import type { LucideIcon } from "lucide-react";
import { AnimatedNumber } from "./AnimatedNumber";

interface Props {
  label: string;
  value: number;
  suffix?: string;
  icon?: LucideIcon;
  hint?: string;
}

export function StatCard({ label, value, suffix, icon: Icon, hint }: Props) {
  return (
    <div className="lift glass rounded-2xl p-5">
      <div className="flex items-center justify-between">
        <span className="text-xs uppercase tracking-widest text-muted-foreground">{label}</span>
        {Icon && <Icon className="h-4 w-4 text-primary" />}
      </div>
      <div className="mt-3 font-display text-3xl font-semibold tracking-tight">
        <AnimatedNumber value={value} />
        {suffix && <span className="ml-1 text-base text-muted-foreground">{suffix}</span>}
      </div>
      {hint && <p className="mt-1 text-xs capitalize text-muted-foreground">{hint}</p>}
    </div>
  );
}