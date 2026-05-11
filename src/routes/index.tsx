import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "e₹ Connect — Digital Rupee Wallet" },
      { name: "description", content: "Premium CBDC-grade digital rupee wallet. Sign in to send, receive and pay." },
    ],
  }),
  component: Splash,
});

function Splash() {
  const navigate = useNavigate();
  const { user, loading } = useAuth();

  useEffect(() => {
    const t = setTimeout(() => {
      if (loading) return;
      navigate({ to: user ? "/dashboard" : "/welcome" });
    }, 1600);
    return () => clearTimeout(t);
  }, [loading, user, navigate]);

  return (
    <div className="min-h-screen aurora grid place-items-center px-6 overflow-hidden">
      <div className="flex flex-col items-center gap-6 animate-fade-up">
        <div className="relative">
          <div className="absolute inset-0 rounded-3xl gradient-primary blur-2xl opacity-60 animate-pulse-glow" />
          <div className="relative h-24 w-24 rounded-3xl gradient-primary grid place-items-center text-4xl font-black text-primary-foreground animate-float">
            e₹
          </div>
        </div>
        <div className="text-center">
          <h1 className="text-3xl font-bold tracking-tight">e₹ Connect</h1>
          <p className="mt-2 text-sm text-muted-foreground">RBI CBDC inspired · Digital Rupee</p>
        </div>
        <div className="mt-6 flex items-center gap-2">
          <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
          <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse [animation-delay:120ms]" />
          <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse [animation-delay:240ms]" />
        </div>
      </div>
    </div>
  );
}
