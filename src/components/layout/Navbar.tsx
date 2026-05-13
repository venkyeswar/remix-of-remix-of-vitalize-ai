import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import { Leaf, LogOut, Home, Salad, LineChart, User } from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Button } from "@/components/ui/button";
import { BookConsultation } from "@/components/BookConsultation";
import { useUserStore, useOnboardingStore } from "@/lib/store";

type DashNavItem = { to: string; label: string; icon: typeof Home; exact?: boolean };
const DASH_NAV: DashNavItem[] = [
  { to: "/dashboard", label: "Overview", icon: Home, exact: true },
  { to: "/dashboard/diet-plans", label: "Diet plans", icon: Salad },
  { to: "/dashboard/progress", label: "Progress", icon: LineChart },
  { to: "/dashboard/profile", label: "Profile", icon: User },
];

export function Navbar() {
  const { isLoggedIn, user, logout } = useUserStore();
  const isComplete = useOnboardingStore((s) => s.isComplete);
  const navigate = useNavigate();
  const path = useRouterState({ select: (r) => r.location.pathname });
  const inDashboard = path.startsWith("/dashboard");

  const handleLogout = () => {
    logout();
    navigate({ to: "/" });
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/60 bg-background/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-6">
        <Link to={isComplete ? "/dashboard" : "/"} className="flex items-center gap-2">
          <span className="grid h-8 w-8 place-items-center rounded-lg bg-primary text-primary-foreground">
            <Leaf className="h-4 w-4" />
          </span>
          <span className="font-display text-lg font-semibold tracking-tight">NorthForm</span>
        </Link>

        <nav className="hidden items-center gap-1 text-sm md:flex">
          {inDashboard ? (
            DASH_NAV.map((n) => {
              const active = n.exact ? path === n.to : path.startsWith(n.to);
              return (
                <Link
                  key={n.to}
                  to={n.to as string}
                  className={`flex items-center gap-2 rounded-full px-3.5 py-2 transition-colors ${
                    active ? "bg-primary/15 text-primary" : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  }`}
                >
                  <n.icon className="h-4 w-4" /> {n.label}
                </Link>
              );
            })
          ) : isComplete ? (
            <>
              <Link to="/dashboard" className="rounded-full px-3.5 py-2 text-muted-foreground hover:bg-muted hover:text-foreground">Dashboard</Link>
              <Link to="/results" className="rounded-full px-3.5 py-2 text-muted-foreground hover:bg-muted hover:text-foreground">My plan</Link>
              <Link to="/dashboard/profile" className="rounded-full px-3.5 py-2 text-muted-foreground hover:bg-muted hover:text-foreground">Profile</Link>
            </>
          ) : (
            <>
              <a href="/#how" className="rounded-full px-3.5 py-2 text-muted-foreground hover:bg-muted hover:text-foreground">How it works</a>
              <a href="/#features" className="rounded-full px-3.5 py-2 text-muted-foreground hover:bg-muted hover:text-foreground">Features</a>
              <a href="/#sample" className="rounded-full px-3.5 py-2 text-muted-foreground hover:bg-muted hover:text-foreground">Sample plan</a>
            </>
          )}
        </nav>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          <BookConsultation
            variant="outline"
            size="sm"
            className="hidden sm:inline-flex"
            label="Book consultation"
          />
          {isLoggedIn ? (
            <>
              <span className="hidden text-xs text-muted-foreground sm:inline">{user.name.split(" ")[0]}</span>
              <button
                onClick={handleLogout}
                className="grid h-9 w-9 place-items-center rounded-full border border-border text-muted-foreground transition-colors hover:border-primary hover:text-primary"
                aria-label="Log out"
              >
                <LogOut className="h-4 w-4" />
              </button>
            </>
          ) : (
            <>
              <Link to="/auth/login" className="hidden text-sm text-muted-foreground hover:text-foreground sm:inline">
                Log in
              </Link>
              <Button asChild size="sm" className="rounded-full font-medium">
                <Link to={isComplete ? "/dashboard" : "/onboarding"}>
                  {isComplete ? "Open dashboard" : "Get my plan"}
                </Link>
              </Button>
            </>
          )}
        </div>
      </div>

      {/* Mobile dashboard tabs */}
      {inDashboard && (
        <nav className="flex items-center gap-1 overflow-x-auto border-t border-border/60 px-4 py-2 md:hidden">
          {DASH_NAV.map((n) => {
            const active = n.exact ? path === n.to : path.startsWith(n.to);
            return (
              <Link
                key={n.to}
                to={n.to as string}
                className={`shrink-0 rounded-full px-3 py-1.5 text-xs font-medium ${
                  active ? "bg-primary/15 text-primary" : "text-muted-foreground"
                }`}
              >
                {n.label}
              </Link>
            );
          })}
        </nav>
      )}
    </header>
  );
}
