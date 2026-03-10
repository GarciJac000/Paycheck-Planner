"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { AlertCircle } from "lucide-react";

interface Allocation {
  id: string;
  allocatedAmount: number;
  category: string;
  orderPriority: number;
  bill?: { name: string };
}

export default function AllocationsPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [allocations, setAllocations] = useState<Allocation[]>([]);
  const [paystubs, setPaystubs] = useState<any[]>([]);
  const [selectedPaystub, setSelectedPaystub] = useState<string>("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!session) router.push("/auth/login");
  }, [session, router]);

  useEffect(() => {
    if (session) fetchPaystubs();
  }, [session]);

  const fetchPaystubs = async () => {
    try {
      const res = await fetch("/api/paystubs");
      const data = await res.json();
      setPaystubs(data);
      if (data.length > 0) setSelectedPaystub(data[0].id);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const generateAllocations = async () => {
    if (!selectedPaystub) return;
    setLoading(true);
    try {
      const res = await fetch("/api/allocations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ paystubId: selectedPaystub }),
      });
      if (res.ok) {
        const data = await res.json();
        const allocRes = await fetch(`/api/allocations?paystubId=${selectedPaystub}`);
        const allocs = await allocRes.json();
        setAllocations(allocs);
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const getColorByCategory = (category: string) => {
    switch (category) {
      case "fixed_bill":
        return "text-red-400";
      case "flexible_spending":
        return "text-amber-400";
      case "savings":
        return "text-emerald-400";
      default:
        return "text-blue-400";
    }
  };

  const getCategoryLabel = (category: string) => {
    return category.split("_").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");
  };

  if (!session) return null;

  return (
    <div className="min-h-screen bg-slate-950 p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Allocations</h1>

        <div className="card mb-6">
          <div className="flex gap-4 items-end">
            <div className="flex-1">
              <label className="block text-sm font-medium mb-2">Select Paycheck</label>
              <select
                value={selectedPaystub}
                onChange={(e) => setSelectedPaystub(e.target.value)}
                className="input w-full"
              >
                {paystubs.map((ps) => (
                  <option key={ps.id} value={ps.id}>
                    ${ps.netPay.toFixed(2)} - {new Date(ps.paystubDate).toLocaleDateString()}
                  </option>
                ))}
              </select>
            </div>
            <button
              onClick={generateAllocations}
              disabled={loading || !selectedPaystub}
              className="btn-primary"
            >
              {loading ? "Generating..." : "Generate Allocations"}
            </button>
          </div>
        </div>

        {allocations.length === 0 ? (
          <div className="card bg-slate-800/50 flex items-center gap-3">
            <AlertCircle className="text-amber-400" />
            <span className="text-slate-300">
              Select a paycheck and click "Generate Allocations" to see your smart allocation breakdown.
            </span>
          </div>
        ) : (
          <div className="space-y-4">
            {allocations.map((alloc) => (
              <div key={alloc.id} className="card bg-slate-800/50">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="font-semibold">
                      {alloc.bill?.name || getCategoryLabel(alloc.category)}
                    </div>
                    <div className="text-sm text-slate-400">
                      Priority #{alloc.orderPriority} • {getCategoryLabel(alloc.category)}
                    </div>
                  </div>
                  <div className={`text-2xl font-bold ${getColorByCategory(alloc.category)}`}>
                    ${alloc.allocatedAmount.toFixed(2)}
                  </div>
                </div>
              </div>
            ))}
            <div className="card bg-emerald-500/10 border-emerald-500/20">
              <div className="text-emerald-300">
                ✅ Allocation complete! Your paycheck is strategically allocated by due date.
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
