import { Link } from "@tanstack/react-router";
import { Leaf, Github, Twitter, Instagram } from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";

export function Footer() {
  return (
    <footer className="border-t border-border/60 bg-background">
      <div className="mx-auto grid max-w-7xl gap-10 px-6 py-16 md:grid-cols-4">
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <span className="grid h-8 w-8 place-items-center rounded-lg bg-primary text-primary-foreground">
              <Leaf className="h-4 w-4" />
            </span>
            <span className="font-display text-lg font-semibold">NorthForm</span>
          </div>
          <p className="max-w-xs text-sm text-muted-foreground">
            Calibrated nutrition for people who'd rather train than scroll calorie spreadsheets.
          </p>
          <ThemeToggle />
        </div>
        <div>
          <p className="mb-3 text-xs uppercase tracking-widest text-muted-foreground">Product</p>
          <ul className="space-y-2 text-sm">
            <li><Link to="/onboarding" className="hover:text-primary">Build my plan</Link></li>
            <li><Link to="/dashboard" className="hover:text-primary">Dashboard</Link></li>
            <li><a href="/#features" className="hover:text-primary">Features</a></li>
          </ul>
        </div>
        <div>
          <p className="mb-3 text-xs uppercase tracking-widest text-muted-foreground">Company</p>
          <ul className="space-y-2 text-sm">
            <li><a href="#" className="hover:text-primary">About</a></li>
            <li><a href="#" className="hover:text-primary">Science</a></li>
            <li><a href="#" className="hover:text-primary">Careers</a></li>
          </ul>
        </div>
        <div>
          <p className="mb-3 text-xs uppercase tracking-widest text-muted-foreground">Connect</p>
          <div className="flex gap-3">
            <a href="#" className="grid h-9 w-9 place-items-center rounded-full border border-border hover:border-primary hover:text-primary"><Twitter className="h-4 w-4" /></a>
            <a href="#" className="grid h-9 w-9 place-items-center rounded-full border border-border hover:border-primary hover:text-primary"><Instagram className="h-4 w-4" /></a>
            <a href="#" className="grid h-9 w-9 place-items-center rounded-full border border-border hover:border-primary hover:text-primary"><Github className="h-4 w-4" /></a>
          </div>
        </div>
      </div>
      <div className="border-t border-border/60 py-6 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} NorthForm Labs. Built with care, not hype.
      </div>
    </footer>
  );
}