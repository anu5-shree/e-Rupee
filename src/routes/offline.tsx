import { createFileRoute } from "@tanstack/react-router";
import { Header } from "@/components/Header";
import { WifiOff, RefreshCw, Bluetooth, Check, Clock } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/offline")({
  head: () => ({ meta: [{ title: "Offline Mode — e₹ Connect" }] }),
  component: Offline,
});

const initial = [
  { id: "T1", name: "Anjali (Vegetable cart)", amount: 80, time: "10:42 AM", status: "pending" as const },
  { id: "T2", name: "Auto — KA01 8821", amount: 120, time: "10:15 AM", status: "pending" as const },
  { id: "T3", name: "Chai stall", amount: 30, time: "Yesterday", status: "synced" as const },
];

function Offline() {
  const [txns, setTxns] = useState(initial);
  const [syncing, setSyncing] = useState(false);

  const sync = () => {
    setSyncing(true);
    setTimeout(() => {
      setTxns((t) => t.map((x) => ({ ...x, status: "synced" as const })));
      setSyncing(false);
    }, 1500);
  };

  const pendingTotal = txns.filter((t) => t.status === "pending").reduce((s, t) => s + t.amount, 0);

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-md">
        <Header title="Offline Mode" />
        <div className="px-5">
          <div className="rounded-3xl border border-warning/40 bg-warning/10 p-5 flex items-start gap-3">
            <div className="h-10 w-10 rounded-xl bg-warning/20 grid place-items-center">
              <WifiOff className="h-5 w-5 text-warning" />
            </div>
            <div className="flex-1">
              <p className="font-semibold text-warning">No Internet Connection</p>
              <p className="text-xs text-muted-foreground mt-1">
                You can still pay nearby users via Bluetooth & NFC. Transactions will sync automatically when you're back online.
              </p>
            </div>
          </div>

          <div className="mt-5 rounded-3xl gradient-card border border-border p-5">
            <p className="text-xs uppercase tracking-widest text-muted-foreground">Offline Pay (Bluetooth)</p>
            <div className="mt-3 flex items-center justify-between">
              <div>
                <p className="text-3xl font-bold">₹500</p>
                <p className="text-xs text-muted-foreground">Available offline limit</p>
              </div>
              <button className="h-12 px-4 rounded-2xl gradient-primary text-primary-foreground font-semibold flex items-center gap-2 glow-primary">
                <Bluetooth className="h-4 w-4" /> Pay
              </button>
            </div>
          </div>

          <div className="mt-6 flex items-center justify-between">
            <h2 className="text-sm font-semibold">Pending offline transactions</h2>
            <button
              onClick={sync}
              disabled={syncing}
              className="text-xs flex items-center gap-1 text-primary"
            >
              <RefreshCw className={`h-3.5 w-3.5 ${syncing ? "animate-spin" : ""}`} />
              {syncing ? "Syncing..." : "Sync now"}
            </button>
          </div>

          <ul className="mt-3 space-y-2">
            {txns.map((t) => (
              <li key={t.id} className="flex items-center gap-3 rounded-2xl bg-card border border-border p-3">
                <div className={`h-10 w-10 rounded-xl grid place-items-center ${t.status === "pending" ? "bg-warning/20 text-warning" : "bg-primary/15 text-primary"}`}>
                  {t.status === "pending" ? <Clock className="h-5 w-5" /> : <Check className="h-5 w-5" />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{t.name}</p>
                  <p className="text-xs text-muted-foreground">#{t.id} · {t.time}</p>
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
