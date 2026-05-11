import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { Send, QrCode, Download, WifiOff, Eye, EyeOff, Bell, ArrowUpRight, ArrowDownLeft } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/dashboard")({
  head: () => ({ meta: [{ title: "Dashboard — e₹ Connect" }] }),
  component: Dashboard,
});

const txns = [
  { id: 1, name: "Aarav Sharma", note: "Lunch", amount: -240, time: "2m ago", in: false },
  { id: 2, name: "Salary — Acme Ltd", note: "March payout", amount: 84500, time: "1h ago", in: true },
  { id: 3, name: "Metro Card", note: "Top-up", amount: -500, time: "Yesterday", in: false },
  { id: 4, name: "Priya Verma", note: "Split dinner", amount: 620, time: "Yesterday", in: true },
  { id: 5, name: "BESCOM", note: "Electricity", amount: -1820, time: "2d ago", in: false },
];

function Dashboard() {
  const [hidden, setHidden] = useState(false);
  return (
    <AppShell>
      <div className="px-5 pt-6 pb-2 flex items-center justify-between">
        <div>
          <p className="text-xs text-muted-foreground">Welcome back</p>
          <p className="font-semibold">Rohan K.</p>
        </div>
        <button className="h-10 w-10 grid place-items-center rounded-xl bg-card border border-border">
          <Bell className="h-5 w-5" />
        </button>
      </div>

      <div className="px-5 mt-3">
        <div className="rounded-3xl gradient-card border border-border p-5 glow-soft relative overflow-hidden">
          <div className="absolute -top-10 -right-10 h-40 w-40 rounded-full bg-primary/20 blur-3xl" />
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase tracking-widest text-muted-foreground">e-Rupee Wallet</span>
            <button onClick={() => setHidden((h) => !h)} className="text-muted-foreground">
              {hidden ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
          <div className="mt-4 flex items-baseline gap-1">
            <span className="text-3xl font-light text-muted-foreground">₹</span>
            <span className="text-5xl font-bold tracking-tight">{hidden ? "•••••" : "1,24,580"}</span>
            <span className="text-xl text-muted-foreground">.50</span>
          </div>
          <div className="mt-4 flex items-center gap-2 text-xs">
            <span className="px-2 py-1 rounded-md bg-primary/15 text-primary font-medium">+ ₹2,140 today</span>
            <span className="text-muted-foreground">VPA: rohan@erupee</span>
          </div>
        </div>
      </div>

      <div className="px-5 mt-6 grid grid-cols-4 gap-3">
        {[
          { to: "/send", icon: Send, label: "Send" },
          { to: "/qr", icon: Download, label: "Receive" },
          { to: "/qr", icon: QrCode, label: "Scan" },
          { to: "/offline", icon: WifiOff, label: "Offline" },
        ].map((a) => (
          <Link key={a.label} to={a.to} className="flex flex-col items-center gap-2">
            <div className="h-14 w-14 rounded-2xl bg-card border border-border grid place-items-center text-primary">
              <a.icon className="h-6 w-6" />
            </div>
            <span className="text-xs">{a.label}</span>
          </Link>
        ))}
      </div>

      <div className="px-5 mt-8 flex items-center justify-between">
        <h2 className="text-sm font-semibold">Recent activity</h2>
        <Link to="/analytics" className="text-xs text-primary">View stats</Link>
      </div>

      <ul className="px-5 mt-3 space-y-2">
        {txns.map((t) => (
          <li key={t.id} className="flex items-center gap-3 rounded-2xl bg-card border border-border p-3">
            <div className={`h-10 w-10 rounded-xl grid place-items-center ${t.in ? "bg-primary/15 text-primary" : "bg-secondary text-muted-foreground"}`}>
              {t.in ? <ArrowDownLeft className="h-5 w-5" /> : <ArrowUpRight className="h-5 w-5" />}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{t.name}</p>
              <p className="text-xs text-muted-foreground truncate">{t.note} · {t.time}</p>
            </div>
            <span className={`text-sm font-semibold ${t.in ? "text-primary" : "text-foreground"}`}>
              {t.in ? "+" : "-"}₹{Math.abs(t.amount).toLocaleString("en-IN")}
            </span>
          </li>
        ))}
      </ul>
    </AppShell>
  );
}
