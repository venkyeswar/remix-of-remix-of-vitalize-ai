import { Link, useNavigate } from "@tanstack/react-router";
import { Leaf, LogOut } from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Button } from "@/components/ui/button";
import { useUserStore, useOnboardingStore } from "@/lib/store";

export function Navbar() {
  const { isLoggedIn, user, logout } = useUserStore();
  const isComplete = useOnboardingStore((s) => s.isComplete);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate({ to: "/" });
  };

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
          {isComplete ? (
            <>
              <Link to="/dashboard" className="hover:text-foreground">Dashboard</Link>
              <Link to="/results" className="hover:text-foreground">My plan</Link>
              <Link to="/dashboard/profile" className="hover:text-foreground">Profile</Link>
            </>
          ) : (
            <>
              <a href="/#how" className="hover:text-foreground">How it works</a>
              <a href="/#features" className="hover:text-foreground">Features</a>
              <a href="/#sample" className="hover:text-foreground">Sample plan</a>
            </>
          )}
        </nav>

        <div className="flex items-center gap-3">
          <ThemeToggle />
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
    </header>
  );
}
