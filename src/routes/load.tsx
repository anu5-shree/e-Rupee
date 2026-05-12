import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Header } from "@/components/Header";
import { useState } from "react";
import { CheckCircle2, Loader2, Landmark } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { RequireAuth } from "@/components/RequireAuth";
import { toast } from "sonner";

export const Route = createFileRoute("/load")({
  head: () => ({ meta: [{ title: "Load e₹ — e₹ Connect" }] }),
  component: () => <RequireAuth><Load /></RequireAuth>,
});

function Load() {
  const { profile, refreshProfile } = useAuth();
  const [amount, setAmount] = useState("");
  const [source, setSource] = useState("SBI · ••••2341");
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const valid = Number(amount) > 0;

  const submit = async () => {
    setSubmitting(true);
    const { error } = await supabase.rpc("load_erupee", { _amount: Number(amount), _source: source });
    setSubmitting(false);
    if (error) return toast.error(error.message);
    await refreshProfile();
    setSuccess(true);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-md">
        <Header title="Load e₹" />
        <div className="px-5 space-y-5">
          <div className="rounded-3xl gradient-card border border-primary/20 p-6 glow-primary">
            <p className="text-[10px] uppercase tracking-[0.25em] text-primary">Current Balance</p>
            <p className="mt-2 text-3xl font-bold">₹ {Number(profile?.wallet_balance ?? 0).toLocaleString("en-IN", { minimumFractionDigits: 2 })}</p>
          </div>

          <div className="rounded-3xl bg-card border border-border p-6 text-center">
            <p className="text-xs uppercase text-muted-foreground tracking-widest">Top up amount</p>
            <div className="mt-3 flex items-center justify-center gap-1">
              <span className="text-3xl text-muted-foreground">₹</span>
              <input
                inputMode="decimal"
                value={amount}
                onChange={(e) => setAmount(e.target.value.replace(/[^\d.]/g, ""))}
                placeholder="0"
                className="w-40 bg-transparent text-5xl font-bold text-center outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-4 gap-2">
            {[500, 1000, 2000, 5000].map((v) => (
              <button key={v} onClick={() => setAmount(String(v))}
                className="rounded-xl bg-card border border-border py-2 text-sm">₹{v}</button>
            ))}
          </div>

          <div>
            <label className="text-xs text-muted-foreground">Funding source</label>
            <div className="mt-2 flex items-center gap-3 rounded-2xl bg-card border border-border px-4 py-4">
              <Landmark className="h-5 w-5 text-primary" />
              <select value={source} onChange={(e) => setSource(e.target.value)} className="flex-1 bg-transparent outline-none">
                <option>SBI · ••••2341</option>
                <option>HDFC · ••••8821</option>
                <option>UPI · self@okicici</option>
              </select>
            </div>
          </div>

          <button
            disabled={!valid || submitting}
            onClick={submit}
            className="w-full rounded-2xl gradient-primary text-primary-foreground font-semibold py-4 glow-primary disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
            Load ₹{amount || "0"}
          </button>
        </div>
      </div>

      {success && (
        <div className="fixed inset-0 z-50 bg-background grid place-items-center px-6">
          <div className="text-center">
            <div className="mx-auto h-24 w-24 rounded-full bg-primary/15 grid place-items-center glow-primary">
              <CheckCircle2 className="h-14 w-14 text-primary" />
            </div>
            <h2 className="mt-6 text-2xl font-bold">e₹ loaded</h2>
            <p className="mt-2 text-muted-foreground">₹{Number(amount).toLocaleString("en-IN")} added from {source}</p>
            <button onClick={() => navigate({ to: "/dashboard" })}
              className="mt-8 rounded-2xl gradient-primary text-primary-foreground font-semibold px-8 py-3 glow-primary">
              Done
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
