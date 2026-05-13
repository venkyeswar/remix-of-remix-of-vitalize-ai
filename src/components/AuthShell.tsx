import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Leaf } from "lucide-react";
import { motivationalQuotes } from "@/lib/static-data";

export function AuthShell({ title, subtitle, children, footer }: { title: string; subtitle: string; children: React.ReactNode; footer: React.ReactNode }) {
  const [idx, setIdx] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setIdx((i) => (i + 1) % motivationalQuotes.length), 5000);
    return () => clearInterval(id);
  }, []);
  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <div className="relative hidden flex-col justify-between overflow-hidden bg-card p-12 lg:flex">
        <div className="absolute inset-0 mesh-bg opacity-80" />
        <div className="absolute inset-0 grid-bg opacity-30" />
        <Link to="/" className="relative flex items-center gap-2">
          <span className="grid h-9 w-9 place-items-center rounded-lg bg-primary text-primary-foreground">
            <Leaf className="h-4 w-4" />
          </span>
          <span className="font-display text-xl font-semibold">NorthForm</span>
        </Link>
        <div className="relative">
          <p className="font-display text-3xl leading-tight text-foreground transition-opacity duration-700">
            "{motivationalQuotes[idx]}"
          </p>
          <p className="mt-4 text-sm text-muted-foreground">— NorthForm field notes</p>
        </div>
        <div className="relative flex gap-1.5">
          {motivationalQuotes.map((_, i) => (
            <span key={i} className={`h-1 w-8 rounded-full transition-colors ${i === idx ? "bg-primary" : "bg-border"}`} />
          ))}
        </div>
      </div>
      <div className="flex flex-col justify-center px-6 py-12 lg:px-16">
        <div className="mx-auto w-full max-w-sm">
          <h1 className="font-display text-3xl font-semibold tracking-tight">{title}</h1>
          <p className="mt-2 text-sm text-muted-foreground">{subtitle}</p>
          <div className="mt-8">{children}</div>
          <div className="mt-8 text-sm text-muted-foreground">{footer}</div>
        </div>
      </div>
    </div>
  );
}

export function FloatingInput({ label, type = "text", value, onChange, error }: { label: string; type?: string; value: string; onChange: (v: string) => void; error?: string }) {
  const [focused, setFocused] = useState(false);
  const [show, setShow] = useState(false);
  const isPassword = type === "password";
  const filled = value.length > 0;
  return (
    <div className="group relative">
      <input
        type={isPassword && show ? "text" : type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        className={`peer h-14 w-full rounded-xl border bg-card/40 px-4 pt-4 text-sm text-foreground outline-none transition-all ${error ? "border-destructive" : "border-border focus:border-primary"} ${error ? "animate-shake" : ""}`}
      />
      <label className={`pointer-events-none absolute left-4 transition-all ${focused || filled ? "top-1.5 text-[10px] uppercase tracking-widest text-primary" : "top-4 text-sm text-muted-foreground"}`}>
        {label}
      </label>
      {isPassword && (
        <button type="button" onClick={() => setShow((s) => !s)} className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-muted-foreground hover:text-primary">
          {show ? "Hide" : "Show"}
        </button>
      )}
      {error && <p className="mt-1.5 text-xs text-destructive">{error}</p>}
    </div>
  );
}