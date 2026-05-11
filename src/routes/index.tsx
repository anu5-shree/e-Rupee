import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Shield, Smartphone } from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "e₹ Connect — Login" },
      { name: "description", content: "Secure digital rupee wallet. Login with your phone." },
    ],
  }),
  component: Login,
});

function Login() {
  const navigate = useNavigate();
  const [step, setStep] = useState<"phone" | "otp">("phone");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState(["", "", "", ""]);

  return (
    <div className="min-h-screen bg-background text-foreground grid-bg">
      <div className="mx-auto max-w-md min-h-screen flex flex-col px-6 py-10">
        <div className="flex items-center gap-2">
          <div className="h-10 w-10 rounded-xl gradient-primary grid place-items-center font-black text-primary-foreground">e₹</div>
          <span className="font-semibold tracking-tight">e₹ Connect</span>
        </div>

        <div className="mt-16 mb-10">
          <h1 className="text-4xl font-bold tracking-tight">
            The future of <span className="text-primary text-glow">digital rupee</span>.
          </h1>
          <p className="mt-3 text-muted-foreground">Send, receive and pay — even without internet.</p>
        </div>

        {step === "phone" ? (
          <form
            onSubmit={(e) => { e.preventDefault(); if (phone.length >= 10) setStep("otp"); }}
            className="space-y-4"
          >
            <label className="block text-sm text-muted-foreground">Mobile number</label>
            <div className="flex items-center gap-2 rounded-2xl bg-card border border-border px-4 py-4 focus-within:ring-2 focus-within:ring-primary">
              <span className="text-muted-foreground">+91</span>
              <input
                value={phone}
                onChange={(e) => setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))}
                inputMode="numeric"
                placeholder="98765 43210"
                className="flex-1 bg-transparent outline-none text-lg tracking-wider"
              />
            </div>
            <button
              type="submit"
              disabled={phone.length < 10}
              className="w-full rounded-2xl gradient-primary text-primary-foreground font-semibold py-4 glow-primary disabled:opacity-50 transition"
            >
              Continue
            </button>
          </form>
        ) : (
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">Enter the 4-digit code sent to +91 {phone}</p>
            <div className="flex gap-3 justify-between">
              {otp.map((v, i) => (
                <input
                  key={i}
                  value={v}
                  onChange={(e) => {
                    const val = e.target.value.replace(/\D/g, "").slice(-1);
                    const next = [...otp]; next[i] = val; setOtp(next);
                    const el = document.getElementById(`otp-${i + 1}`);
                    if (val && el) (el as HTMLInputElement).focus();
                  }}
                  id={`otp-${i}`}
                  inputMode="numeric"
                  className="w-16 h-16 text-center text-2xl font-bold rounded-2xl bg-card border border-border focus:border-primary focus:outline-none"
                />
              ))}
            </div>
            <button
              onClick={() => navigate({ to: "/dashboard" })}
              disabled={otp.some((d) => !d)}
              className="w-full rounded-2xl gradient-primary text-primary-foreground font-semibold py-4 glow-primary disabled:opacity-50"
            >
              Verify & Continue
            </button>
            <button onClick={() => setStep("phone")} className="w-full text-sm text-muted-foreground">
              Change number
            </button>
          </div>
        )}

        <div className="mt-auto pt-10 grid grid-cols-2 gap-3 text-xs text-muted-foreground">
          <div className="flex items-center gap-2 rounded-xl bg-card/50 border border-border p-3">
            <Shield className="h-4 w-4 text-primary" /> RBI grade security
          </div>
          <div className="flex items-center gap-2 rounded-xl bg-card/50 border border-border p-3">
            <Smartphone className="h-4 w-4 text-primary" /> Works offline
          </div>
        </div>
      </div>
    </div>
  );
}
