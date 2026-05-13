import { Moon, Sun } from "lucide-react";
import { useThemeStore } from "@/lib/store";

export function ThemeToggle({ className = "" }: { className?: string }) {
  const { isDark, toggle } = useThemeStore();
  return (
    <button
      onClick={toggle}
      aria-label="Toggle theme"
      className={`relative inline-flex h-9 w-16 items-center rounded-full border border-border bg-secondary/60 transition-colors ${className}`}
    >
      <span
        className="absolute top-1 left-1 inline-flex h-7 w-7 items-center justify-center rounded-full bg-primary text-primary-foreground transition-transform duration-300"
        style={{ transform: isDark ? "translateX(28px)" : "translateX(0)" }}
      >
        {isDark ? <Moon className="h-3.5 w-3.5" /> : <Sun className="h-3.5 w-3.5" />}
      </span>
    </button>
  );
}