import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Mail, Lock, Eye, EyeOff, ArrowLeft, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";

export const Route = createFileRoute("/login")({
  head: () => ({ meta: [{ title: "Login — e₹ Connect" }] }),
  component: LoginPage,
});

function LoginPage() {
  const { signIn, user } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [busy, setBusy] = useState(false);

  useEffect(() => { if (user) navigate({ to: "/dashboard" }); }, [user, navigate]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    const { error } = await signIn(email, password);
    setBusy(false);
    if (error) {
      toast.error(error === "Invalid login credentials" ? "Wrong email or password" : error);
      return;
    }
    toast.success("Welcome back!");
    navigate({ to: "/dashboard" });
  };

  return (
    <div className="min-h-screen aurora text-foreground">
      <div className="mx-auto max-w-md min-h-screen flex flex-col px-6 py-6">
        <Link to="/welcome" className="h-10 w-10 grid place-items-center rounded-xl glass">
          <ArrowLeft className="h-4 w-4" />
        </Link>

        <div className="mt-10 animate-fade-up">
          <h1 className="text-3xl font-bold tracking-tight">Welcome back</h1>
          <p className="mt-2 text-muted-foreground text-sm">Sign in to your e₹ wallet</p>
        </div>

        <form onSubmit={submit} className="mt-8 space-y-4 animate-fade-up">
          <Field icon={<Mail className="h-4 w-4" />} label="Email">
            <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" className="flex-1 bg-transparent outline-none" />
          </Field>
          <Field icon={<Lock className="h-4 w-4" />} label="Password">
            <input type={show ? "text" : "password"} required value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" className="flex-1 bg-transparent outline-none" />
            <button type="button" onClick={() => setShow(!show)} className="text-muted-foreground">
              {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </Field>

          <button type="submit" disabled={busy} className="w-full rounded-2xl gradient-primary text-primary-foreground font-semibold py-4 glow-primary disabled:opacity-60 flex items-center justify-center gap-2 transition">
            {busy && <Loader2 className="h-4 w-4 animate-spin" />}
            Sign In
          </button>
        </form>

        <p className="mt-auto text-center text-sm text-muted-foreground">
          New to e₹ Connect?{" "}
          <Link to="/signup" className="text-primary font-semibold">Create an account</Link>
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
