import { createFileRoute, Link } from "@tanstack/react-router";
import { useRef, useState } from "react";
import { User, Mail, Cake, Ruler, Scale, Activity, Salad, Wallet, Target, Dumbbell, Edit3, Save, AlertTriangle, Heart, Ban, Camera, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useUserStore, useOnboardingStore } from "@/lib/store";
import { toast } from "sonner";

export const Route = createFileRoute("/dashboard/profile")({
  head: () => ({ meta: [{ title: "Profile — NorthForm" }] }),
  component: ProfilePage,
});

function ProfilePage() {
  const { user, updateUser } = useUserStore();
  const { data, patch } = useOnboardingStore();
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ name: user.name, email: user.email });
  const fileRef = useRef<HTMLInputElement>(null);

  const initials = user.name.split(" ").map((p) => p[0]).join("").slice(0, 2).toUpperCase();
  const memberSince = "May 2026";

  const onPickPhoto = (file: File) => {
    if (file.size > 2 * 1024 * 1024) { toast.error("Image must be under 2 MB"); return; }
    const reader = new FileReader();
    reader.onload = () => {
      updateUser({ avatar: reader.result as string });
      toast.success("Profile photo updated");
    };
    reader.readAsDataURL(file);
  };

  const save = () => {
    updateUser({ name: form.name, email: form.email });
    setEditing(false);
  };

  const stats: { label: string; value: string; Icon: typeof User }[] = [
    { label: "Age", value: `${data.age ?? "—"} yrs`, Icon: Cake },
    { label: "Gender", value: data.gender ?? "—", Icon: User },
    { label: "Height", value: data.heightCm ? `${data.heightCm} cm` : "—", Icon: Ruler },
    { label: "Current weight", value: data.weightKg ? `${data.weightKg} kg` : "—", Icon: Scale },
    { label: "Target weight", value: data.targetWeightKg ? `${data.targetWeightKg} kg` : "—", Icon: Target },
    { label: "Activity", value: data.activity ?? "—", Icon: Activity },
    { label: "Diet type", value: data.dietType ?? "—", Icon: Salad },
    { label: "Workout", value: data.workout ?? "—", Icon: Dumbbell },
    { label: "Budget", value: data.budget ?? "—", Icon: Wallet },
    { label: "Goal", value: data.goal ?? "—", Icon: Target },
  ];

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 md:px-6 md:py-10">
      <header className="mb-8">
        <p className="text-xs uppercase tracking-widest text-muted-foreground">Profile</p>
        <h1 className="mt-2 font-display text-3xl font-semibold tracking-tight md:text-4xl">Your account</h1>
      </header>

      {/* Identity */}
      <section className="glass rounded-3xl p-6 md:p-8">
        <div className="flex flex-wrap items-center gap-6">
          <div className="group relative">
            <span className="grid h-24 w-24 place-items-center overflow-hidden rounded-3xl bg-primary text-2xl font-semibold text-primary-foreground shadow-lg ring-2 ring-primary/30">
              {user.avatar ? (
                <img src={user.avatar} alt={user.name} className="h-full w-full object-cover" />
              ) : (
                initials
              )}
            </span>
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              className="absolute -bottom-1 -right-1 grid h-9 w-9 place-items-center rounded-full border-2 border-background bg-primary text-primary-foreground shadow-md transition-transform hover:scale-110"
              title="Change photo"
            >
              <Camera className="h-4 w-4" />
            </button>
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => { const f = e.target.files?.[0]; if (f) onPickPhoto(f); e.target.value = ""; }}
            />
            {user.avatar && (
              <button
                type="button"
                onClick={() => { updateUser({ avatar: null }); toast.success("Photo removed"); }}
                className="absolute -top-1 -right-1 grid h-7 w-7 place-items-center rounded-full border-2 border-background bg-destructive text-destructive-foreground shadow-md"
                title="Remove photo"
              >
                <Trash2 className="h-3 w-3" />
              </button>
            )}
          </div>
          <div className="flex-1">
            {editing ? (
              <div className="grid gap-3 sm:grid-cols-2">
                <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="h-11 rounded-xl border border-border bg-background/40 px-4 text-sm outline-none focus:border-primary" placeholder="Name" />
                <input value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="h-11 rounded-xl border border-border bg-background/40 px-4 text-sm outline-none focus:border-primary" placeholder="Email" />
              </div>
            ) : (
              <>
                <h2 className="font-display text-2xl">{user.name}</h2>
                <p className="mt-1 flex items-center gap-2 text-sm text-muted-foreground"><Mail className="h-3.5 w-3.5" /> {user.email}</p>
                <p className="mt-1 text-xs text-muted-foreground">Member since {memberSince}</p>
              </>
            )}
          </div>
          {editing ? (
            <Button onClick={save} className="rounded-full"><Save className="mr-1 h-4 w-4" /> Save</Button>
          ) : (
            <Button variant="outline" onClick={() => setEditing(true)} className="rounded-full"><Edit3 className="mr-1 h-4 w-4" /> Edit</Button>
          )}
        </div>
      </section>

      {/* Health snapshot */}
      <section className="mt-6 glass rounded-3xl p-6 md:p-8">
        <header className="mb-5 flex items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-widest text-muted-foreground">Health snapshot</p>
            <h2 className="mt-1 font-display text-xl">Plan parameters</h2>
          </div>
          <Button asChild variant="outline" size="sm" className="rounded-full">
            <Link to="/onboarding">Re-take quiz</Link>
          </Button>
        </header>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {stats.map((s) => (
            <div key={s.label} className="flex items-start gap-3 rounded-2xl border border-border/60 bg-background/40 p-4">
              <span className="grid h-9 w-9 place-items-center rounded-xl bg-primary/15 text-primary"><s.Icon className="h-4 w-4" /></span>
              <div>
                <p className="text-xs uppercase tracking-widest text-muted-foreground">{s.label}</p>
                <p className="mt-1 font-medium capitalize">{s.value}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Food preferences */}
      <section className="mt-6 grid gap-6 md:grid-cols-3">
        <div className="glass rounded-3xl p-6">
          <header className="mb-3 flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 text-primary" />
            <p className="text-xs uppercase tracking-widest text-muted-foreground">Allergies</p>
          </header>
          <div className="flex flex-wrap gap-2">
            {data.allergies.length === 0 && <p className="text-sm text-muted-foreground">None reported</p>}
            {data.allergies.map((a) => <span key={a} className="rounded-full border border-destructive/40 bg-destructive/10 px-3 py-1 text-xs text-destructive">{a}</span>)}
          </div>
        </div>
        <div className="glass rounded-3xl p-6">
          <header className="mb-3 flex items-center gap-2">
            <Heart className="h-4 w-4 text-primary" />
            <p className="text-xs uppercase tracking-widest text-muted-foreground">Loved foods</p>
          </header>
          <div className="flex flex-wrap gap-2">
            {data.preferred.length === 0 && <p className="text-sm text-muted-foreground">No preferences set</p>}
            {data.preferred.map((a) => <span key={a} className="rounded-full bg-primary/15 px-3 py-1 text-xs text-primary">{a}</span>)}
          </div>
        </div>
        <div className="glass rounded-3xl p-6">
          <header className="mb-3 flex items-center gap-2">
            <Ban className="h-4 w-4 text-primary" />
            <p className="text-xs uppercase tracking-widest text-muted-foreground">Disliked</p>
          </header>
          <div className="flex flex-wrap gap-2">
            {data.disliked.length === 0 && <p className="text-sm text-muted-foreground">No dislikes set</p>}
            {data.disliked.map((a) => <span key={a} className="rounded-full border border-border bg-muted px-3 py-1 text-xs text-muted-foreground">{a}</span>)}
          </div>
        </div>
      </section>

      {/* Danger zone */}
      <section className="mt-6 rounded-3xl border border-border/60 p-6">
        <p className="text-xs uppercase tracking-widest text-muted-foreground">Account</p>
        <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
          <p className="text-sm text-muted-foreground">Reset your plan to start fresh with new answers.</p>
          <Button asChild variant="outline" className="rounded-full"><Link to="/onboarding">Restart onboarding</Link></Button>
        </div>
      </section>
    </div>
  );
}
