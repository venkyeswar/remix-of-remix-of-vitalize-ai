import { createFileRoute, Link, Outlet, useRouterState } from "@tanstack/react-router";
import { Home, Salad, LineChart, User, Leaf, LogOut } from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";
import { useUserStore } from "@/lib/store";

export const Route = createFileRoute("/dashboard")({
  component: DashboardLayout,
});

const NAV: { to: string; label: string; icon: typeof Home; exact?: boolean }[] = [
  { to: "/dashboard", label: "Overview", icon: Home, exact: true },
  { to: "/dashboard/diet-plans", label: "Diet plans", icon: Salad },
  { to: "/dashboard/progress", label: "Progress", icon: LineChart },
  { to: "/dashboard/profile", label: "Profile", icon: User },
];

function DashboardLayout() {
  const user = useUserStore((s) => s.user);
  const path = useRouterState({ select: (r) => r.location.pathname });
  return (
    <div className="flex min-h-screen bg-background">
      <aside className="sticky top-0 hidden h-screen w-64 shrink-0 flex-col border-r border-border/60 bg-sidebar p-5 md:flex">
        <Link to="/" className="mb-10 flex items-center gap-2">
          <span className="grid h-8 w-8 place-items-center rounded-lg bg-primary text-primary-foreground"><Leaf className="h-4 w-4" /></span>
          <span className="font-display text-lg font-semibold">NorthForm</span>
        </Link>
        <nav className="flex flex-1 flex-col gap-1">
          {NAV.map((n) => {
            const active = n.exact ? path === n.to : path.startsWith(n.to);
            return (
              <Link key={n.to} to={n.to as string} className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-colors ${active ? "bg-primary/15 text-primary" : "text-muted-foreground hover:bg-muted hover:text-foreground"}`}>
                <n.icon className="h-4 w-4" /> {n.label}
              </Link>
            );
          })}
        </nav>
        <div className="mt-6 rounded-2xl border border-border/60 bg-card/40 p-3">
          <div className="flex items-center gap-3">
            <span className="grid h-9 w-9 place-items-center rounded-full bg-primary/20 text-sm font-semibold text-primary">
              {user.name.split(" ").map((p) => p[0]).join("").slice(0, 2)}
            </span>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium">{user.name}</p>
              <p className="truncate text-xs text-muted-foreground">{user.email}</p>
            </div>
          </div>
          <div className="mt-3 flex items-center justify-between">
            <ThemeToggle />
            <Link to="/" className="text-xs text-muted-foreground hover:text-primary"><LogOut className="h-4 w-4" /></Link>
          </div>
        </div>
      </aside>
      <main className="flex-1 pb-24 md:pb-0">
        <Outlet />
      </main>
      <nav className="fixed inset-x-0 bottom-0 z-40 flex justify-around border-t border-border/60 bg-background/90 py-3 backdrop-blur md:hidden">
        {NAV.map((n) => {
          const active = n.exact ? path === n.to : path.startsWith(n.to);
          return (
            <Link key={n.to} to={n.to as string} className={`flex flex-col items-center gap-1 text-[10px] ${active ? "text-primary" : "text-muted-foreground"}`}>
              <n.icon className="h-5 w-5" />{n.label}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}