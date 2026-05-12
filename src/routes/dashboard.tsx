import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import {
  Send, QrCode, Download, WifiOff, Eye, EyeOff, Bell, ArrowUpRight, ArrowDownLeft,
  LogOut, TrendingUp, BarChart3, Sparkles, Plus,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { RequireAuth } from "@/components/RequireAuth";
import { toast } from "sonner";

export const Route = createFileRoute("/dashboard")({
  head: () => ({ meta: [{ title: "Wallet — e₹ Connect" }] }),
  component: () => <RequireAuth><Dashboard /></RequireAuth>,
});

type Txn = { id: string; type: "send" | "receive"; counterparty: string; amount: number; note: string | null; created_at: string };

function Dashboard() {
  const { profile, user, signOut } = useAuth();
  const navigate = useNavigate();
  const [hidden, setHidden] = useState(false);
  const [txns, setTxns] = useState<Txn[]>([]);

  useEffect(() => {
    if (!user) return;
    supabase
      .from("transactions")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(8)
      .then(({ data }) => setTxns((data as Txn[]) ?? []));
  }, [user]);

  const handleSignOut = async () => {
    await signOut();
    toast.success("Signed out");
    navigate({ to: "/welcome" });
  };

  const firstName = (profile?.full_name ?? user?.email?.split("@")[0] ?? "User").split(" ")[0];
  const balance = profile?.wallet_balance ?? 0;

  // Mock analytics distribution
  const week = [42, 65, 38, 80, 52, 90, 60];
  const max = Math.max(...week);

  return (
    <AppShell>
      {/* Header */}
      <div className="px-5 pt-6 pb-2 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-full gradient-primary grid place-items-center font-black text-primary-foreground">
            {firstName.charAt(0).toUpperCase()}
          </div>
          <div>
            <p className="text-[11px] text-muted-foreground">Welcome back</p>
            <p className="font-semibold text-sm">{firstName}</p>
          </div>
        </div>
        <div className="flex gap-2">
          <button className="h-10 w-10 grid place-items-center rounded-xl glass">
            <Bell className="h-4 w-4" />
          </button>
          <button onClick={handleSignOut} className="h-10 w-10 grid place-items-center rounded-xl glass" aria-label="Sign out">
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Digital Rupee Card */}
      <div className="px-5 mt-4">
        <div className="relative rounded-3xl p-6 overflow-hidden glow-primary gradient-card border border-primary/20 animate-fade-up">
          <div className="absolute -top-16 -right-16 h-48 w-48 rounded-full bg-primary/30 blur-3xl" />
          <div className="absolute -bottom-20 -left-10 h-44 w-44 rounded-full bg-accent/20 blur-3xl" />

          <div className="relative flex items-center justify-between">
            <div>
              <p className="text-[10px] uppercase tracking-[0.25em] text-primary">Digital Rupee · CBDC</p>
              <p className="text-xs text-muted-foreground mt-1">Wallet ID · {profile?.wallet_id ?? "eR-••••••"}</p>
            </div>
            <div className="h-9 w-9 rounded-xl gradient-primary grid place-items-center font-black text-primary-foreground text-sm">e₹</div>
          </div>

          <div className="relative mt-8 flex items-end justify-between">
            <div>
              <p className="text-xs text-muted-foreground mb-1">Available balance</p>
              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-bold tracking-tight">
                  {hidden ? "₹ ••••••" : `₹ ${balance.toLocaleString("en-IN", { minimumFractionDigits: 2 })}`}
                </span>
                <button onClick={() => setHidden(!hidden)} className="text-muted-foreground p-1">
                  {hidden ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>
            <Link to="/load" className="rounded-xl glass px-3 py-2 text-xs flex items-center gap-1">
              <Plus className="h-3 w-3" /> Top up
            </Link>
          </div>

          <div className="relative mt-6 flex items-center justify-between text-[11px] text-muted-foreground">
            <span>VALID · LIFETIME</span>
            <span className="flex items-center gap-1"><Sparkles className="h-3 w-3 text-primary" /> Verified by RBI</span>
          </div>
        </div>
      </div>

      {/* Quick actions */}
      <div className="px-5 mt-5 grid grid-cols-4 gap-3 animate-fade-up">
        <Action to="/send" icon={<Send className="h-5 w-5" />} label="Send" />
        <Action to="/qr" icon={<Download className="h-5 w-5" />} label="Receive" />
        <Action to="/qr" icon={<QrCode className="h-5 w-5" />} label="Scan QR" />
        <Action to="/offline" icon={<WifiOff className="h-5 w-5" />} label="Offline" />
      </div>

      {/* QR + Analytics row */}
      <div className="px-5 mt-5 grid grid-cols-2 gap-3 animate-fade-up">
        <Link to="/qr" className="glass rounded-2xl p-4 flex flex-col gap-3">
          <div className="h-9 w-9 rounded-xl bg-primary/10 text-primary grid place-items-center"><QrCode className="h-4 w-4" /></div>
          <div>
            <p className="font-semibold text-sm">My QR</p>
            <p className="text-[11px] text-muted-foreground">Receive payments instantly</p>
          </div>
        </Link>
        <Link to="/analytics" className="glass rounded-2xl p-4 flex flex-col gap-3">
          <div className="h-9 w-9 rounded-xl bg-accent/10 text-accent grid place-items-center"><BarChart3 className="h-4 w-4" /></div>
          <div>
            <p className="font-semibold text-sm">Analytics</p>
            <p className="text-[11px] text-muted-foreground">Track your spending</p>
          </div>
        </Link>
      </div>

      {/* Mini analytics */}
      <div className="px-5 mt-5 animate-fade-up">
        <div className="glass rounded-2xl p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-xs text-muted-foreground">This week</p>
              <p className="font-semibold flex items-center gap-2">
                ₹ 12,480 <span className="text-[10px] text-success flex items-center gap-0.5"><TrendingUp className="h-3 w-3" /> +14%</span>
              </p>
            </div>
            <Link to="/analytics" className="text-xs text-primary">View all</Link>
          </div>
          <div className="flex items-end gap-2 h-24">
            {week.map((v, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-1">
                <div className="w-full rounded-md bg-gradient-to-t from-primary/80 to-accent" style={{ height: `${(v / max) * 100}%` }} />
                <span className="text-[10px] text-muted-foreground">{["M","T","W","T","F","S","S"][i]}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Transactions */}
      <div className="px-5 mt-6 mb-24 animate-fade-up">
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-semibold">Recent activity</h2>
          <span className="text-xs text-muted-foreground">{txns.length} items</span>
        </div>
        <div className="glass rounded-2xl divide-y divide-border/40">
          {txns.length === 0 && (
            <div className="p-6 text-center">
              <p className="text-sm text-muted-foreground">No transactions yet</p>
              <Link to="/send" className="inline-block mt-3 text-xs text-primary">Send your first payment →</Link>
            </div>
          )}
          {txns.map((t) => {
            const incoming = t.type === "receive";
            return (
              <div key={t.id} className="flex items-center gap-3 p-4">
                <div className={`h-10 w-10 rounded-xl grid place-items-center ${incoming ? "bg-success/15 text-success" : "bg-destructive/10 text-destructive"}`}>
                  {incoming ? <ArrowDownLeft className="h-4 w-4" /> : <ArrowUpRight className="h-4 w-4" />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{t.counterparty}</p>
                  <p className="text-[11px] text-muted-foreground truncate">{t.note ?? (incoming ? "Received" : "Sent")}</p>
                </div>
                <div className="text-right">
                  <p className={`text-sm font-semibold ${incoming ? "text-success" : ""}`}>
                    {incoming ? "+" : "−"} ₹ {Number(t.amount).toLocaleString("en-IN")}
                  </p>
                  <p className="text-[10px] text-muted-foreground">{new Date(t.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </AppShell>
  );
}

function Action({ to, icon, label }: { to: string; icon: React.ReactNode; label: string }) {
  return (
    <Link to={to} className="flex flex-col items-center gap-2">
      <div className="h-14 w-14 rounded-2xl glass grid place-items-center text-primary glow-soft">{icon}</div>
      <span className="text-[11px] text-muted-foreground">{label}</span>
    </Link>
  );
}
