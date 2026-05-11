import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { ArrowRight, ShieldCheck, WifiOff, Zap } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

export const Route = createFileRoute("/welcome")({
  head: () => ({ meta: [{ title: "Welcome — e₹ Connect" }] }),
  component: Welcome,
});

function Welcome() {
  const { user } = useAuth();
  const navigate = useNavigate();
  useEffect(() => { if (user) navigate({ to: "/dashboard" }); }, [user, navigate]);

  return (
    <div className="min-h-screen aurora text-foreground">
      <div className="mx-auto max-w-md min-h-screen flex flex-col px-6 py-8">
        <div className="flex items-center gap-2 animate-fade-up">
          <div className="h-9 w-9 rounded-xl gradient-primary grid place-items-center font-black text-primary-foreground">e₹</div>
          <span className="font-semibold tracking-tight">e₹ Connect</span>
        </div>

        <div className="flex-1 flex flex-col justify-center py-10 animate-fade-up">
          <p className="text-xs uppercase tracking-[0.25em] text-primary mb-3">Reserve Bank of India · CBDC</p>
          <h1 className="text-4xl font-bold tracking-tight leading-tight">
            The new era of <span className="text-primary text-glow">money</span> is here.
          </h1>
          <p className="mt-4 text-muted-foreground">Send, receive and store the Digital Rupee with bank-grade security — even without internet.</p>

          <div className="mt-8 grid gap-3">
            <Feature icon={<ShieldCheck className="h-5 w-5" />} title="Sovereign-grade security" desc="Issued and backed by the RBI." />
            <Feature icon={<Zap className="h-5 w-5" />} title="Instant settlements" desc="Sub-second transfers, 24×7." />
            <Feature icon={<WifiOff className="h-5 w-5" />} title="Pays offline" desc="Works without an internet connection." />
          </div>
        </div>

        <div className="space-y-3 pb-2 animate-fade-up">
          <Link to="/signup" className="w-full rounded-2xl gradient-primary text-primary-foreground font-semibold py-4 glow-primary flex items-center justify-center gap-2">
            Get started <ArrowRight className="h-4 w-4" />
          </Link>
          <Link to="/login" className="w-full rounded-2xl glass py-4 flex items-center justify-center font-medium">
            I already have an account
          </Link>
        </div>
      </div>
    </div>
  );
}

function Feature({ icon, title, desc }: { icon: React.ReactNode; title: string; desc: string }) {
  return (
    <div className="glass rounded-2xl p-4 flex items-start gap-3">
      <div className="h-10 w-10 rounded-xl bg-primary/10 text-primary grid place-items-center">{icon}</div>
      <div>
        <p className="font-semibold text-sm">{title}</p>
        <p className="text-xs text-muted-foreground">{desc}</p>
      </div>
    </div>
  );
}
