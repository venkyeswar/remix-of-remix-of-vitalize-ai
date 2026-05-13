import { useEffect, useRef } from "react";
import { gsap } from "gsap";

interface Props {
  protein: number;
  carbs: number;
  fat: number;
  size?: number;
  calories?: number;
}

export function MacroRing({ protein, carbs, fat, size = 220, calories }: Props) {
  const total = protein * 4 + carbs * 4 + fat * 9 || 1;
  const arcs = [
    (protein * 4) / total,
    (carbs * 4) / total,
    (fat * 9) / total,
  ];

  const r = (size - 28) / 2;
  const circ = 2 * Math.PI * r;

  const refs = useRef<(SVGCircleElement | null)[]>([]);
  useEffect(() => {
    let offset = 0;
    arcs.forEach((pct, i) => {
      const el = refs.current[i];
      if (!el) return;
      const len = pct * circ;
      gsap.fromTo(
        el,
        { strokeDasharray: `0 ${circ}`, strokeDashoffset: -offset },
        { strokeDasharray: `${len} ${circ}`, strokeDashoffset: -offset, duration: 1.1, ease: "power2.out", delay: 0.1 + i * 0.1 }
      );
      offset += len;
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [protein, carbs, fat]);

  const colors = ["var(--primary)", "var(--chart-2)", "var(--chart-3)"];
  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="var(--border)" strokeWidth={14} />
        {[0, 1, 2].map((i) => (
          <circle
            key={i}
            ref={(el) => { refs.current[i] = el; }}
            cx={size / 2}
            cy={size / 2}
            r={r}
            fill="none"
            stroke={colors[i]}
            strokeWidth={14}
          />
        ))}
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="font-display text-3xl font-semibold">{calories ?? Math.round(total)}</span>
        <span className="text-xs uppercase tracking-widest text-muted-foreground">kcal / day</span>
      </div>
    </div>
  );
}