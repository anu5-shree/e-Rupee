import { createFileRoute } from "@tanstack/react-router";
import { Header } from "@/components/Header";
import { ScanLine, Share2, CheckCircle2 } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/qr")({
  head: () => ({ meta: [{ title: "QR Pay — e₹ Connect" }] }),
  component: QR,
});

function FakeQR() {
  // generate deterministic checker pattern
  const cells = Array.from({ length: 21 * 21 }, (_, i) => {
    const x = i % 21, y = Math.floor(i / 21);
    const corner = (x < 7 && y < 7) || (x > 13 && y < 7) || (x < 7 && y > 13);
    if (corner) {
      const lx = x % 7, ly = y % 7;
      const inner = lx >= 2 && lx <= 4 && ly >= 2 && ly <= 4;
      const ring = lx === 0 || lx === 6 || ly === 0 || ly === 6;
      return ring || inner ? 1 : 0;
    }
    return (x * 31 + y * 17 + x * y) % 3 === 0 ? 1 : 0;
  });
  return (
    <div className="grid grid-cols-[repeat(21,1fr)] gap-[2px] bg-white p-4 rounded-2xl w-64 h-64 mx-auto">
      {cells.map((c, i) => (
        <div key={i} className={c ? "bg-black" : "bg-white"} />
      ))}
    </div>
  );
}

function QR() {
  const [scanned, setScanned] = useState(false);
  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-md">
        <Header title="QR Payment" />
        <div className="px-5">
          {!scanned ? (
            <>
              <div className="rounded-3xl gradient-card border border-border p-6 text-center">
                <p className="text-xs uppercase tracking-widest text-muted-foreground">Your dynamic QR</p>
                <p className="mt-1 text-sm text-muted-foreground">Refreshes every 60 seconds</p>
                <div className="mt-5">
                  <FakeQR />
                </div>
                <p className="mt-4 font-semibold">rohan@erupee</p>
                <p className="text-xs text-muted-foreground">+91 98••• ••210</p>
              </div>

              <div className="mt-5 grid grid-cols-2 gap-3">
                <button className="rounded-2xl bg-card border border-border py-3 flex items-center justify-center gap-2">
                  <Share2 className="h-4 w-4" /> Share
                </button>
                <button
                  onClick={() => setScanned(true)}
                  className="rounded-2xl gradient-primary text-primary-foreground py-3 font-semibold flex items-center justify-center gap-2 glow-primary"
                >
                  <ScanLine className="h-4 w-4" /> Scan QR
                </button>
              </div>

              <div className="mt-6 rounded-2xl bg-card border border-border p-4 text-xs text-muted-foreground">
                Tip: ask the receiver to show their QR, then tap Scan to pay instantly.
              </div>
            </>
          ) : (
            <div className="grid place-items-center text-center pt-10">
              <div className="h-24 w-24 rounded-full bg-primary/15 grid place-items-center glow-primary">
                <CheckCircle2 className="h-14 w-14 text-primary" />
              </div>
              <h2 className="mt-6 text-2xl font-bold">Payment successful</h2>
              <p className="mt-2 text-muted-foreground">₹450 paid to Cafe Mocha</p>
              <p className="mt-1 text-xs text-muted-foreground">Txn ID: ER240511X92K</p>
              <button
                onClick={() => setScanned(false)}
                className="mt-8 rounded-2xl gradient-primary text-primary-foreground font-semibold px-8 py-3 glow-primary"
              >
                Done
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
