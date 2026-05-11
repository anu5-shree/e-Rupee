import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";

export const Route = createFileRoute("/nokia")({
  head: () => ({ meta: [{ title: "Feature Phone Mode — e₹ Connect" }] }),
  component: Nokia,
});

type View = "menu" | "send" | "balance" | "history" | "exit";

const menu = [
  { key: "1", label: "Send Money", view: "send" as View },
  { key: "2", label: "Check Balance", view: "balance" as View },
  { key: "3", label: "Transaction History", view: "history" as View },
  { key: "4", label: "Exit", view: "exit" as View },
];

function Nokia() {
  const [view, setView] = useState<View>("menu");
  const [sel, setSel] = useState(0);
  const navigate = useNavigate();

  const screen = (() => {
    switch (view) {
      case "menu":
        return (
          <div>
            <div className="border-b border-current/40 pb-1 mb-2 flex justify-between text-[10px]">
              <span>e-Rupee</span><span>•II 100%</span>
            </div>
            <div className="text-center font-bold mb-2">MAIN MENU</div>
            <ul className="space-y-1">
              {menu.map((m, i) => (
                <li key={m.key} className={`px-2 py-1 ${i === sel ? "bg-current/80 text-[var(--nokia-bg)]" : ""}`}>
                  {m.key}. {m.label}
                </li>
              ))}
            </ul>
          </div>
        );
      case "send":
        return (
          <div>
            <div className="text-center font-bold mb-2">SEND MONEY</div>
            <div className="text-[11px]">To: 98765*****</div>
            <div className="text-[11px]">Amt: Rs. 250</div>
            <div className="mt-3 text-center">[ OK to Confirm ]</div>
            <div className="mt-1 text-center text-[10px]">Press # to cancel</div>
          </div>
        );
      case "balance":
        return (
          <div className="text-center">
            <div className="font-bold mb-3">BALANCE</div>
            <div className="text-2xl font-bold">Rs. 1,24,580</div>
            <div className="mt-2 text-[10px]">As of 11 May 14:22</div>
          </div>
        );
      case "history":
        return (
          <div>
            <div className="text-center font-bold mb-2">HISTORY</div>
            <ul className="text-[11px] space-y-1">
              <li>- Aarav    -240</li>
              <li>+ Salary +84500</li>
              <li>- Metro   -500</li>
              <li>+ Priya   +620</li>
              <li>- BESCOM -1820</li>
            </ul>
          </div>
        );
      case "exit":
        return (
          <div className="text-center">
            <div className="font-bold mb-3">GOODBYE</div>
            <div className="text-[11px]">Returning to smart UI...</div>
          </div>
        );
    }
  })();

  const press = (k: string) => {
    if (view === "menu") {
      const found = menu.find((m) => m.key === k);
      if (found) {
        setView(found.view);
        if (found.view === "exit") setTimeout(() => navigate({ to: "/dashboard" }), 800);
      }
    } else if (k === "C" || k === "#") {
      setView("menu");
    }
  };

  const move = (dir: -1 | 1) => {
    if (view !== "menu") return;
    setSel((s) => (s + dir + menu.length) % menu.length);
  };

  const ok = () => {
    if (view === "menu") {
      const m = menu[sel];
      setView(m.view);
      if (m.view === "exit") setTimeout(() => navigate({ to: "/dashboard" }), 800);
    } else setView("menu");
  };

  return (
    <div className="min-h-screen bg-background grid place-items-center p-4 grid-bg">
      <div className="w-[300px] rounded-[36px] bg-zinc-900 border-4 border-zinc-700 p-4 shadow-2xl">
        <div className="text-center text-zinc-500 text-[10px] tracking-widest pb-2">NOKIA</div>
        <div className="nokia-screen rounded-md p-3 h-56 text-[12px] leading-tight font-mono">
          {screen}
        </div>

        <div className="mt-3 grid grid-cols-3 gap-2 text-zinc-200">
          <button onClick={() => press("C")} className="col-span-1 rounded-lg bg-zinc-800 py-2 text-xs">Back</button>
          <button onClick={ok} className="col-span-1 rounded-lg bg-primary text-primary-foreground py-2 text-xs font-bold">OK</button>
          <button onClick={() => press("#")} className="col-span-1 rounded-lg bg-zinc-800 py-2 text-xs">Menu</button>
        </div>

        <div className="mt-2 grid grid-cols-3 gap-2 text-zinc-200">
          <div />
          <button onClick={() => move(-1)} className="rounded-lg bg-zinc-800 py-2 text-xs">▲</button>
          <div />
          <div />
          <button onClick={() => move(1)} className="rounded-lg bg-zinc-800 py-2 text-xs">▼</button>
          <div />
        </div>

        <div className="mt-3 grid grid-cols-3 gap-2">
          {["1","2","3","4","5","6","7","8","9","*","0","#"].map((k) => (
            <button
              key={k}
              onClick={() => press(k)}
              className="rounded-lg bg-zinc-800 text-zinc-100 py-2.5 font-mono text-sm hover:bg-zinc-700"
            >
              {k}
            </button>
          ))}
        </div>
        <p className="mt-3 text-center text-[10px] text-zinc-500">Feature phone mode · USSD-style fallback</p>
      </div>
    </div>
  );
}
