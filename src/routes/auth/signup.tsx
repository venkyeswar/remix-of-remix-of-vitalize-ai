import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { AuthShell, FloatingInput } from "@/components/AuthShell";
import { Button } from "@/components/ui/button";
import { useUserStore } from "@/lib/store";

export const Route = createFileRoute("/auth/signup")({
  head: () => ({ meta: [{ title: "Sign up — NorthForm" }, { name: "description", content: "Build your first calibrated diet plan." }] }),
  component: Signup,
});

function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [pwd, setPwd] = useState("");
  const [err, setErr] = useState<Record<string, string>>({});
  const navigate = useNavigate();
  const { login, updateUser } = useUserStore();

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const next: Record<string, string> = {};
    if (name.length < 2) next.name = "Tell us your name";
    if (!email.includes("@")) next.email = "Enter a valid email";
    if (pwd.length < 6) next.pwd = "Use at least 6 characters";
    setErr(next);
    if (Object.keys(next).length) return;
    login(email);
    updateUser({ name });
    navigate({ to: "/onboarding" });
  };

  return (
    <AuthShell
      title="Build your first plan."
      subtitle="Two minutes. No credit card. No spam."
      footer={<>Already a member? <Link to="/auth/login" className="text-primary hover:underline">Log in</Link></>}
    >
      <form onSubmit={submit} className="space-y-4">
        <FloatingInput label="Full name" value={name} onChange={setName} error={err.name} />
        <FloatingInput label="Email" type="email" value={email} onChange={setEmail} error={err.email} />
        <FloatingInput label="Password" type="password" value={pwd} onChange={setPwd} error={err.pwd} />
        <Button type="submit" className="h-12 w-full rounded-xl text-base font-medium">Create account</Button>
      </form>
    </AuthShell>
  );
}