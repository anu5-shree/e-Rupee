import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Header } from "@/components/Header";
import { useState } from "react";
import { CheckCircle2, User, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { RequireAuth } from "@/components/RequireAuth";
import { toast } from "sonner";

export const Route = createFileRoute("/send")({
  head: () => ({ meta: [{ title: "Send Money — e₹ Connect" }] }),
  component: () => <RequireAuth><Send /></RequireAuth>,
});

function Send() {
  const { refreshProfile } = useAuth();
  const [phone, setPhone] = useState("");
  const [amount, setAmount] = useState("");
  const [note, setNote] = useState("");
  const [confirm, setConfirm] = useState(false);
  const [success, setSuccess] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  const valid = phone.length >= 10 && Number(amount) > 0;

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="mx-auto max-w-md min-h-screen">
        <Header title="Send Money" />
        <div className="px-5 space-y-5">
          <div>
            <label className="text-xs text-muted-foreground">Receiver mobile</label>
            <div className="mt-2 flex items-center gap-3 rounded-2xl bg-card border border-border px-4 py-4">
              <User className="h-5 w-5 text-muted-foreground" />
              <span className="text-muted-foreground">+91</span>
              <input
                inputMode="numeric"
                value={phone}
                onChange={(e) => setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))}
                placeholder="98765 43210"
                className="flex-1 bg-transparent outline-none tracking-wider"
              />
            </div>
          </div>

          <div className="rounded-3xl gradient-card border border-border p-6 text-center">
            <p className="text-xs uppercase text-muted-foreground tracking-widest">Amount</p>
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
            <input
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Add a note (optional)"
              className="mt-4 w-full bg-transparent text-center text-sm text-muted-foreground outline-none"
            />
          </div>

          <div className="grid grid-cols-4 gap-2">
            {[100, 500, 1000, 2000].map((v) => (
              <button
                key={v}
                onClick={() => setAmount(String(v))}
                className="rounded-xl bg-card border border-border py-2 text-sm"
              >
                ₹{v}
              </button>
            ))}
          </div>

          <button
            disabled={!valid}
            onClick={() => setConfirm(true)}
            className="w-full rounded-2xl gradient-primary text-primary-foreground font-semibold py-4 glow-primary disabled:opacity-50"
          >
            Send ₹{amount || "0"}
          </button>
        </div>
      </div>

      {confirm && !success && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm grid place-items-end sm:place-items-center">
          <div className="w-full max-w-md rounded-t-3xl sm:rounded-3xl bg-card border border-border p-6">
            <div className="mx-auto h-1.5 w-12 rounded-full bg-border mb-4 sm:hidden" />
            <h3 className="text-lg font-semibold">Confirm payment</h3>
            <div className="mt-4 space-y-3 text-sm">
              <Row k="To" v={`+91 ${phone}`} />
              <Row k="Amount" v={`₹${Number(amount).toLocaleString("en-IN")}`} />
              <Row k="Note" v={note || "—"} />
              <Row k="Fee" v="₹0.00" />
            </div>
            <div className="mt-6 grid grid-cols-2 gap-3">
              <button onClick={() => setConfirm(false)} disabled={submitting} className="rounded-2xl bg-secondary py-3 font-medium">Cancel</button>
              <button
                disabled={submitting}
                onClick={async () => {
                  setSubmitting(true);
                  const { data, error } = await supabase.rpc("transfer_erupee", {
                    _receiver_phone: phone,
                    _amount: Number(amount),
                    _note: note || undefined,
                  });
                  setSubmitting(false);
                  if (error) { toast.error(error.message); return; }
                  await refreshProfile();
                  if (data && typeof data === "object" && "receiver_found" in (data as any) && !(data as any).receiver_found) {
                    toast.message("Sent — receiver not yet on e₹ Connect; held in escrow.");
                  }
                  setSuccess(true);
                }}
                className="rounded-2xl gradient-primary text-primary-foreground py-3 font-semibold flex items-center justify-center gap-2"
              >
                {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
                {submitting ? "Processing" : "Confirm"}
              </button>
            </div>
          </div>
        </div>
      )}

      {success && (
        <div className="fixed inset-0 z-50 bg-background grid place-items-center px-6">
          <div className="text-center">
            <div className="mx-auto h-24 w-24 rounded-full bg-primary/15 grid place-items-center glow-primary">
              <CheckCircle2 className="h-14 w-14 text-primary" />
            </div>
            <h2 className="mt-6 text-2xl font-bold">Payment successful</h2>
            <p className="mt-2 text-muted-foreground">₹{Number(amount).toLocaleString("en-IN")} sent to +91 {phone}</p>
            <button
              onClick={() => navigate({ to: "/dashboard" })}
              className="mt-8 rounded-2xl gradient-primary text-primary-foreground font-semibold px-8 py-3 glow-primary"
            >
              Done
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function Row({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex justify-between gap-3">
      <span className="text-muted-foreground">{k}</span>
      <span className="font-medium text-right">{v}</span>
    </div>
  );
}
