import { Link } from "@tanstack/react-router";
import { Leaf } from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Button } from "@/components/ui/button";

export function Navbar() {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/60 bg-background/70 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        <Link to="/" className="flex items-center gap-2">
          <span className="grid h-8 w-8 place-items-center rounded-lg bg-primary text-primary-foreground">
            <Leaf className="h-4 w-4" />
          </span>
          <span className="font-display text-lg font-semibold tracking-tight">NorthForm</span>
        </Link>
        <nav className="hidden items-center gap-8 text-sm text-muted-foreground md:flex">
          <a href="/#how" className="hover:text-foreground">How it works</a>
          <a href="/#features" className="hover:text-foreground">Features</a>
          <a href="/#sample" className="hover:text-foreground">Sample plan</a>
          <Link to="/dashboard" className="hover:text-foreground">Dashboard</Link>
        </nav>
        <div className="flex items-center gap-3">
          <ThemeToggle />
          <Link to="/auth/login" className="hidden text-sm text-muted-foreground hover:text-foreground sm:inline">
            Log in
          </Link>
          <Button asChild size="sm" className="rounded-full font-medium">
            <Link to="/onboarding">Get my plan</Link>
          </Button>
        </div>
      </div>
    </header>
  );
}