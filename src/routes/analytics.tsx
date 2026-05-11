import { createFileRoute } from "@tanstack/react-router";
import { Header } from "@/components/Header";
import { TrendingUp, TrendingDown, Wallet, Repeat } from "lucide-react";

export const Route = createFileRoute("/analytics")({
  head: () => ({ meta: [{ title: "Analytics — e₹ Connect" }] }),
  component: Analytics,
});

const week = [
  { d: "Mon", v: 420 },
  { d: "Tue", v: 1280 },
  { d: "Wed", v: 760 },
  { d: "Thu", v: 1820 },
  { d: "Fri", v: 980 },
  { d: "Sat", v: 2240 },
  { d: "Sun", v: 1540 },
];

const categories = [
  { name: "Food & Drinks", pct: 38, color: "bg-primary" },
  { name: "Transport", pct: 22, color: "bg-accent" },
  { name: "Shopping", pct: 18, color: "bg-warning" },
  { name: "Bills", pct: 14, color: "bg-success" },
  { name: "Other", pct: 8, color: "bg-muted-foreground" },
];

function Analytics() {
  const max = Math.max(...week.map((w) => w.v));
  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-md pb-10">
        <Header title="Analytics" />
        <div className="px-5 space-y-5">
          <div className="grid grid-cols-2 gap-3">
            <Stat icon={Wallet} label="Spent this week" value="₹9,040" delta="+12%" up />
            <Stat icon={TrendingDown} label="Saved" value="₹3,210" delta="-4%" />
            <Stat icon={Repeat} label="Transactions" value="48" delta="+8" up />
            <Stat icon={TrendingUp} label="Avg / day" value="₹1,291" delta="+5%" up />
          </div>

          <div className="rounded-3xl gradient-card border border-border p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-widest text-muted-foreground">Weekly spend</p>
                <p className="text-2xl font-bold mt-1">₹9,040</p>
              </div>
              <span className="text-xs px-2 py-1 rounded-md bg-primary/15 text-primary">+12%</span>
            </div>
            <div className="mt-6 flex items-end justify-between gap-2 h-40">
              {week.map((w) => (
                <div key={w.d} className="flex-1 flex flex-col items-center gap-2">
                  <div
                    className="w-full rounded-t-lg gradient-primary glow-soft"
                    style={{ height: `${(w.v / max) * 100}%` }}
                  />
                  <span className="text-[10px] text-muted-foreground">{w.d}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-3xl bg-card border border-border p-5">
            <p className="text-sm font-semibold">Where your money went</p>
            <div className="mt-4 h-3 w-full rounded-full bg-secondary overflow-hidden flex">
              {categories.map((c) => (
                <div key={c.name} className={c.color} style={{ width: `${c.pct}%` }} />
              ))}
            </div>
            <ul className="mt-4 space-y-2">
              {categories.map((c) => (
                <li key={c.name} className="flex items-center gap-3 text-sm">
                  <span className={`h-2.5 w-2.5 rounded-full ${c.color}`} />
                  <span className="flex-1">{c.name}</span>
                  <span className="text-muted-foreground">{c.pct}%</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

function Stat({ icon: Icon, label, value, delta, up }: { icon: any; label: string; value: string; delta: string; up?: boolean }) {
  return (
    <div className="rounded-2xl bg-card border border-border p-4">
      <div className="flex items-center justify-between">
        <Icon className="h-5 w-5 text-primary" />
        <span className={`text-[10px] px-1.5 py-0.5 rounded ${up ? "bg-primary/15 text-primary" : "bg-secondary text-muted-foreground"}`}>{delta}</span>
      </div>
      <p className="mt-3 text-xl font-bold">{value}</p>
      <p className="text-xs text-muted-foreground">{label}</p>
    </div>
  );
}
