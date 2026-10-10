import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

type Transaction = {
  id: string;
  amount: number;
  type: string;
  counterparty: string;
  created_at: string;
};

export default function HistoryPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTransactions();
  }, []);

  async function fetchTransactions() {
    const {
      data,
      error,
    } = await supabase
      .from("transactions")
      .select("*")
      .order("created_at", { ascending: false });

    if (!error && data) {
      setTransactions(data);
    }

    setLoading(false);
  }

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <h1 className="text-3xl font-bold mb-6">
        Transaction History
      </h1>

      {loading ? (
        <p>Loading...</p>
      ) : transactions.length === 0 ? (
        <p>No transactions found</p>
      ) : (
        <div className="space-y-4">
          {transactions.map((tx) => (
            <div
              key={tx.id}
              className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4 flex justify-between items-center"
            >
              <div>
                <p className="font-semibold text-lg">
                  {tx.counterparty}
                </p>

                <p className="text-zinc-400 text-sm">
                  {new Date(tx.created_at).toLocaleString()}
                </p>
              </div>

              <div className="text-right">
                <p
                  className={`text-xl font-bold ${
                    tx.type === "credit"
                      ? "text-green-400"
                      : "text-red-400"
                  }`}
                >
                  {tx.type === "credit" ? "+" : "-"}₹
                  {tx.amount}
                </p>

                <p className="text-zinc-500 text-sm capitalize">
                  {tx.type}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}