import { createFileRoute, Outlet } from "@tanstack/react-router";
import { Navbar } from "@/components/layout/Navbar";

export const Route = createFileRoute("/dashboard")({
  beforeLoad: async () => {
    const { redirect } = await import("@tanstack/react-router");
    const { useUserStore, useOnboardingStore } = await import("@/lib/store");
    if (!useUserStore.getState().isLoggedIn) throw redirect({ to: "/auth/login" });
    if (!useOnboardingStore.getState().isComplete) throw redirect({ to: "/onboarding" });
  },
  component: DashboardLayout,
});

function DashboardLayout() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main>
        <Outlet />
      </main>
    </div>
  );
}
