import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Mail, Lock, User, Eye, EyeOff, ArrowLeft, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";

export const Route = createFileRoute("/signup")({
  head: () => ({ meta: [{ title: "Create account — e₹ Connect" }] }),
  component: SignupPage,
});

function SignupPage() {
  const { signUp } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [busy, setBusy] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 6) { toast.error("Password must be at least 6 characters"); return; }
    setBusy(true);
    const { error } = await signUp(email, password, name);
    setBusy(false);
    if (error) {
      toast.error(error.includes("registered") ? "This email is already registered" : error);
      return;
    }
    toast.success("Account created! Let's set up your profile.");
    navigate({ to: "/profile-setup" });
  };

  return (
    <div className="min-h-screen aurora text-foreground">
      <div className="mx-auto max-w-md min-h-screen flex flex-col px-6 py-6">
        <Link to="/welcome" className="h-10 w-10 grid place-items-center rounded-xl glass">
          <ArrowLeft className="h-4 w-4" />
        </Link>

        <div className="mt-10 animate-fade-up">
          <h1 className="text-3xl font-bold tracking-tight">Create your <span className="text-primary text-glow">e₹</span> wallet</h1>
          <p className="mt-2 text-muted-foreground text-sm">Join the future of digital currency</p>
        </div>

        <form onSubmit={submit} className="mt-8 space-y-4 animate-fade-up">
          <Field icon={<User className="h-4 w-4" />} label="Full name">
            <input required value={name} onChange={(e) => setName(e.target.value)} placeholder="Rohan Kumar" className="flex-1 bg-transparent outline-none" />
          </Field>
          <Field icon={<Mail className="h-4 w-4" />} label="Email">
            <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" className="flex-1 bg-transparent outline-none" />
          </Field>
          <Field icon={<Lock className="h-4 w-4" />} label="Password">
            <input type={show ? "text" : "password"} required value={password} onChange={(e) => setPassword(e.target.value)} placeholder="At least 6 characters" className="flex-1 bg-transparent outline-none" />
            <button type="button" onClick={() => setShow(!show)} className="text-muted-foreground">
              {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </Field>

          <button type="submit" disabled={busy} className="w-full rounded-2xl gradient-primary text-primary-foreground font-semibold py-4 glow-primary disabled:opacity-60 flex items-center justify-center gap-2">
            {busy && <Loader2 className="h-4 w-4 animate-spin" />}
            Create Account
          </button>
          <p className="text-[11px] text-muted-foreground text-center">By continuing you agree to our Terms & Privacy Policy.</p>
        </form>

        <p className="mt-auto text-center text-sm text-muted-foreground">
          Already a member?{" "}
          <Link to="/login" className="text-primary font-semibold">Sign in</Link>
        </p>
      </div>
    </div>
  );
}

function Field({ icon, label, children }: { icon: React.ReactNode; label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-xs text-muted-foreground mb-2">{label}</label>
      <div className="flex items-center gap-3 glass rounded-2xl px-4 py-4 focus-within:ring-2 focus-within:ring-primary">
        <span className="text-primary">{icon}</span>
        {children}
      </div>
    </div>
  );
}
