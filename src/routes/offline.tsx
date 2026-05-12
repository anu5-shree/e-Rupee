import { createFileRoute } from "@tanstack/react-router";
import { Header } from "@/components/Header";
import { WifiOff, Wifi, RefreshCw, Bluetooth, Check, Clock, Loader2 } from "lucide-react";
import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { RequireAuth } from "@/components/RequireAuth";
import { toast } from "sonner";

export const Route = createFileRoute("/offline")({
  head: () => ({ meta: [{ title: "Offline Mode — e₹ Connect" }] }),
  component: () => <RequireAuth><Offline /></RequireAuth>,
});

type LocalTxn = {
  id: string;
  receiver_phone: string;
  receiver_name: string;
  amount: number;
  note?: string;
  created_at: string;
  status: "pending" | "synced" | "failed";
};

const KEY = "erupee.offline.queue";
const loadQueue = (): LocalTxn[] => {
  if (typeof window === "undefined") return [];
  try { return JSON.parse(localStorage.getItem(KEY) || "[]"); } catch { return []; }
};
const saveQueue = (q: LocalTxn[]) => localStorage.setItem(KEY, JSON.stringify(q));

function Offline() {
  const { user, refreshProfile } = useAuth();
  const [online, setOnline] = useState<boolean>(typeof navigator !== "undefined" ? navigator.onLine : true);
  const [forceOffline, setForceOffline] = useState(false);
  const [queue, setQueue] = useState<LocalTxn[]>([]);
  const [syncing, setSyncing] = useState(false);
  const [pay, setPay] = useState({ name: "", phone: "", amount: "" });
  const [pairing, setPairing] = useState(false);

  const effectiveOffline = !online || forceOffline;

  useEffect(() => {
    setQueue(loadQueue());
    const on = () => setOnline(true);
    const off = () => setOnline(false);
    window.addEventListener("online", on);
    window.addEventListener("offline", off);
    return () => { window.removeEventListener("online", on); window.removeEventListener("offline", off); };
  }, []);

  const sync = useCallback(async () => {
    if (!user) return;
    const pending = queue.filter((q) => q.status === "pending");
    if (pending.length === 0) return;
    setSyncing(true);
    const next = [...queue];
    for (const t of pending) {
      const { error } = await supabase.rpc("transfer_erupee", {
        _receiver_phone: t.receiver_phone,
        _amount: t.amount,
        _note: t.note || `Offline · ${t.id}`,
      });
      const idx = next.findIndex((x) => x.id === t.id);
      if (idx >= 0) next[idx] = { ...next[idx], status: error ? "failed" : "synced" };
      if (!error) {
        await supabase.from("offline_transfers").insert({
          user_id: user.id,
          receiver_phone: t.receiver_phone,
          receiver_name: t.receiver_name,
          amount: t.amount,
          note: t.note,
          status: "synced",
          synced_at: new Date().toISOString(),
        });
      }
    }
    setQueue(next); saveQueue(next);
    await refreshProfile();
    setSyncing(false);
    toast.success("Offline transactions synced");
  }, [queue, user, refreshProfile]);

  // Auto-sync when back online
  useEffect(() => {
    if (online && !forceOffline && queue.some((q) => q.status === "pending")) {
      sync();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [online, forceOffline]);

  const simulatePay = () => {
    if (!pay.phone || !pay.amount) return toast.error("Enter receiver and amount");
    setPairing(true);
    setTimeout(() => {
      const txn: LocalTxn = {
        id: "OFF-" + Math.random().toString(36).slice(2, 8).toUpperCase(),
        receiver_phone: pay.phone,
        receiver_name: pay.name || `+91 ${pay.phone}`,
        amount: Number(pay.amount),
        note: "Bluetooth offline transfer",
        created_at: new Date().toISOString(),
        status: "pending",
      };
      const next = [txn, ...queue];
      setQueue(next); saveQueue(next);
      setPay({ name: "", phone: "", amount: "" });
      setPairing(false);
      toast.success(`Token signed offline · ${txn.id}`);
    }, 1600);
  };

  const pendingTotal = queue.filter((t) => t.status === "pending").reduce((s, t) => s + t.amount, 0);

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-md">
        <Header title="Offline Mode" />
        <div className="px-5 pb-12">
          <div className={`rounded-3xl border p-5 flex items-start gap-3 ${effectiveOffline ? "border-warning/40 bg-warning/10" : "border-success/40 bg-success/10"}`}>
            <div className={`h-10 w-10 rounded-xl grid place-items-center ${effectiveOffline ? "bg-warning/20 text-warning" : "bg-success/20 text-success"}`}>
              {effectiveOffline ? <WifiOff className="h-5 w-5" /> : <Wifi className="h-5 w-5" />}
            </div>
            <div className="flex-1">
              <p className={`font-semibold ${effectiveOffline ? "text-warning" : "text-success"}`}>
                {effectiveOffline ? "Offline mode active" : "You're online"}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                {effectiveOffline
                  ? "Pay nearby users via Bluetooth · NFC. Tokens sync automatically when back online."
                  : "Pending tokens will sync to the RBI ledger automatically."}
              </p>
              <button
                onClick={() => setForceOffline((v) => !v)}
                className="mt-3 text-[11px] text-primary underline"
              >
                {forceOffline ? "Disable simulated offline" : "Simulate offline"}
              </button>
            </div>
          </div>

          {/* Bluetooth pay card */}
          <div className="mt-5 rounded-3xl gradient-card border border-border p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-widest text-muted-foreground">Bluetooth Pay</p>
                <p className="text-[11px] text-muted-foreground mt-1">Limit ₹500 per token · RBI offline CBDC</p>
              </div>
              <div className={`h-10 w-10 rounded-xl grid place-items-center ${pairing ? "bg-primary/20 text-primary animate-pulse" : "bg-primary/10 text-primary"}`}>
                <Bluetooth className="h-5 w-5" />
              </div>
            </div>

            <div className="mt-4 space-y-2">
              <input
                value={pay.name}
                onChange={(e) => setPay({ ...pay, name: e.target.value })}
                placeholder="Receiver name (optional)"
                className="w-full rounded-xl bg-background/40 border border-border px-3 py-2.5 text-sm outline-none"
              />
              <div className="grid grid-cols-2 gap-2">
                <input
                  inputMode="numeric"
                  value={pay.phone}
                  onChange={(e) => setPay({ ...pay, phone: e.target.value.replace(/\D/g, "").slice(0, 10) })}
                  placeholder="Phone"
                  className="rounded-xl bg-background/40 border border-border px-3 py-2.5 text-sm outline-none"
                />
                <input
                  inputMode="decimal"
                  value={pay.amount}
                  onChange={(e) => setPay({ ...pay, amount: e.target.value.replace(/[^\d.]/g, "") })}
                  placeholder="Amount ₹"
                  className="rounded-xl bg-background/40 border border-border px-3 py-2.5 text-sm outline-none"
                />
              </div>
              <button
                onClick={simulatePay}
                disabled={pairing}
                className="w-full mt-2 h-12 rounded-2xl gradient-primary text-primary-foreground font-semibold flex items-center justify-center gap-2 glow-primary"
              >
                {pairing ? (<><Loader2 className="h-4 w-4 animate-spin" /> Pairing nearby device…</>) : (<><Bluetooth className="h-4 w-4" /> Sign & send token</>)}
              </button>
            </div>
          </div>

          <div className="mt-6 flex items-center justify-between">
            <h2 className="text-sm font-semibold">Offline token queue</h2>
            <button
              onClick={sync}
              disabled={syncing || effectiveOffline}
              className="text-xs flex items-center gap-1 text-primary disabled:opacity-40"
            >
              <RefreshCw className={`h-3.5 w-3.5 ${syncing ? "animate-spin" : ""}`} />
              {syncing ? "Syncing..." : "Sync now"}
            </button>
          </div>

          <ul className="mt-3 space-y-2">
            {queue.length === 0 && (
              <li className="text-xs text-center text-muted-foreground py-6 rounded-2xl border border-dashed border-border">
                No offline transactions yet
              </li>
            )}
            {queue.map((t) => (
              <li key={t.id} className="flex items-center gap-3 rounded-2xl bg-card border border-border p-3">
                <div className={`h-10 w-10 rounded-xl grid place-items-center ${
                  t.status === "pending" ? "bg-warning/20 text-warning" :
                  t.status === "synced" ? "bg-success/15 text-success" : "bg-destructive/15 text-destructive"
                }`}>
                  {t.status === "pending" ? <Clock className="h-5 w-5" /> : <Check className="h-5 w-5" />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{t.receiver_name}</p>
                  <p className="text-xs text-muted-foreground">#{t.id} · {new Date(t.created_at).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })} · {t.status}</p>
                </div>
                <span className="text-sm font-semibold">-₹{t.amount}</span>
              </li>
            ))}
          </ul>

          {pendingTotal > 0 && (
            <p className="mt-4 text-xs text-center text-muted-foreground">
              ₹{pendingTotal} pending sync · auto-sync when online
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
