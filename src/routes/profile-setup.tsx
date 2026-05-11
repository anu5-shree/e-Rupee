import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { User, Phone, Loader2, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { RequireAuth } from "@/components/RequireAuth";

export const Route = createFileRoute("/profile-setup")({
  head: () => ({ meta: [{ title: "Set up profile — e₹ Connect" }] }),
  component: () => <RequireAuth><Setup /></RequireAuth>,
});

function Setup() {
  const { user, profile, refreshProfile } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (profile) {
      setName(profile.full_name ?? "");
      setPhone(profile.phone ?? "");
    }
  }, [profile]);

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setBusy(true);
    const { error } = await supabase
      .from("profiles")
      .update({ full_name: name, phone, updated_at: new Date().toISOString() })
      .eq("id", user.id);
    setBusy(false);
    if (error) { toast.error(error.message); return; }
    await refreshProfile();
    toast.success("Profile saved");
    navigate({ to: "/dashboard" });
  };

  return (
    <div className="min-h-screen aurora text-foreground">
      <div className="mx-auto max-w-md min-h-screen flex flex-col px-6 py-8">
        <div className="flex items-center gap-2 text-primary text-xs uppercase tracking-[0.25em] animate-fade-up">
          <Sparkles className="h-3.5 w-3.5" /> Step 2 of 2
        </div>
        <h1 className="mt-4 text-3xl font-bold tracking-tight animate-fade-up">Tell us about you</h1>
        <p className="mt-2 text-sm text-muted-foreground animate-fade-up">This is how others will find you on e₹ Connect.</p>

        <div className="mt-8 flex justify-center animate-fade-up">
          <div className="h-24 w-24 rounded-full gradient-primary grid place-items-center text-3xl font-black text-primary-foreground glow-primary">
            {(name || "U").charAt(0).toUpperCase()}
          </div>
        </div>

        <form onSubmit={save} className="mt-8 space-y-4 animate-fade-up">
          <Field icon={<User className="h-4 w-4" />} label="Full name">
            <input required value={name} onChange={(e) => setName(e.target.value)} placeholder="Rohan Kumar" className="flex-1 bg-transparent outline-none" />
          </Field>
          <Field icon={<Phone className="h-4 w-4" />} label="Mobile number">
            <span className="text-muted-foreground text-sm">+91</span>
            <input
              required
              inputMode="numeric"
              value={phone}
              onChange={(e) => setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))}
              placeholder="98765 43210"
              className="flex-1 bg-transparent outline-none tracking-wider"
            />
          </Field>

          <button type="submit" disabled={busy} className="w-full rounded-2xl gradient-primary text-primary-foreground font-semibold py-4 glow-primary disabled:opacity-60 flex items-center justify-center gap-2">
            {busy && <Loader2 className="h-4 w-4 animate-spin" />}
            Continue to wallet
          </button>
          <button type="button" onClick={() => navigate({ to: "/dashboard" })} className="w-full text-sm text-muted-foreground">
            Skip for now
          </button>
        </form>
      </div>
    </div>
  );
}

function Field({ icon, label, children }: { icon: React.ReactNode; label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-xs text-muted-foreground mb-2">{label}</label>
      <div className="flex items-center gap-3 glass rounded-2xl px-4 py-4 focus-within:ring-2 focus-within:ring-primary">
        <span className="text-primary">{icon}</span>
        {children}
      </div>
    </div>
  );
}
