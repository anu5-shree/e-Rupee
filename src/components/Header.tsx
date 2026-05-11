import { Link, useRouter } from "@tanstack/react-router";
import { ChevronLeft } from "lucide-react";

export function Header({ title, back = true }: { title: string; back?: boolean }) {
  const router = useRouter();
  return (
    <header className="flex items-center justify-between px-5 pt-6 pb-4">
      {back ? (
        <button
          onClick={() => router.history.back()}
          className="h-10 w-10 grid place-items-center rounded-xl bg-card border border-border"
          aria-label="Back"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
      ) : (
        <Link to="/dashboard" className="text-primary font-bold text-lg tracking-tight">e₹</Link>
      )}
      <h1 className="text-base font-semibold">{title}</h1>
      <div className="h-10 w-10" />
    </header>
  );
}
