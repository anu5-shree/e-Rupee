import { Link, useRouterState } from "@tanstack/react-router";
import { Home, Send, QrCode, WifiOff, BarChart3, Phone } from "lucide-react";
import type { ReactNode } from "react";

const tabs = [
  { to: "/dashboard", label: "Home", icon: Home },
  { to: "/send", label: "Send", icon: Send },
  { to: "/qr", label: "QR", icon: QrCode },
  { to: "/offline", label: "Offline", icon: WifiOff },
  { to: "/analytics", label: "Stats", icon: BarChart3 },
];

export function AppShell({ children }: { children: ReactNode }) {
  const path = useRouterState({ select: (s) => s.location.pathname });
  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="mx-auto max-w-md min-h-screen pb-24 relative">
        {children}
        <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md px-4 pb-4 z-50">
          <div className="flex items-center justify-between rounded-2xl border border-border bg-card/90 backdrop-blur-xl px-2 py-2 glow-soft">
            {tabs.map((t) => {
              const active = path === t.to;
              const Icon = t.icon;
              return (
                <Link
                  key={t.to}
                  to={t.to}
                  className={`flex flex-col items-center gap-0.5 px-3 py-2 rounded-xl text-[10px] font-medium transition-all ${
                    active ? "bg-primary text-primary-foreground glow-primary" : "text-muted-foreground"
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  {t.label}
                </Link>
              );
            })}
            <Link
              to="/nokia"
              className="flex flex-col items-center gap-0.5 px-3 py-2 rounded-xl text-[10px] font-medium text-muted-foreground"
            >
              <Phone className="h-5 w-5" />
              Nokia
            </Link>
          </div>
        </nav>
      </div>
    </div>
  );
}
