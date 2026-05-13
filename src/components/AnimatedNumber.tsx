import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";

export function AnimatedNumber({ value, duration = 1.2, suffix = "" }: { value: number; duration?: number; suffix?: string }) {
  const [display, setDisplay] = useState(0);
  const ref = useRef({ v: 0 });
  useEffect(() => {
    const obj = ref.current;
    const tween = gsap.to(obj, {
      v: value,
      duration,
      ease: "power2.out",
      onUpdate: () => setDisplay(Math.round(obj.v)),
    });
    return () => { tween.kill(); };
  }, [value, duration]);
  return <span>{display.toLocaleString()}{suffix}</span>;
}