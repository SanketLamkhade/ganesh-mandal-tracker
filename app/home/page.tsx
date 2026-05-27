"use client";

import { useEffect, useState } from "react";
import PageShell from "@/components/PageShell";
import GanpatiLoader from "@/components/GanpatiLoader";
import StatCard, { NavCard } from "@/components/StatCard";
import { formatCurrency } from "@/components/EntryList";

export default function HomePage() {
  const [todayPavti, setTodayPavti] = useState(0);
  const [todayExpense, setTodayExpense] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchTodayStats() {
      const today = new Date().toISOString().split("T")[0];
      try {
        const res = await fetch(
          `/api/reports?from=${today}&to=${today}`,
        );
        if (res.ok) {
          const data = await res.json();
          setTodayPavti(data.summary.totalPavti);
          setTodayExpense(data.summary.totalExpense);
        }
      } catch {
        // silently fail for stats
      } finally {
        setLoading(false);
      }
    }

    fetchTodayStats();
  }, []);

  return (
    <PageShell>
      {loading ? (
        <div className="flex flex-1 items-center justify-center px-4 py-20">
          <GanpatiLoader size="lg" label="Loading..." />
        </div>
      ) : (
      <div className="animate-fade-in space-y-6 px-4 py-6">
        <div className="grid grid-cols-2 gap-3">
          <StatCard
            label="Today's Receipts"
            value={formatCurrency(todayPavti)}
            accent="saffron"
          />
          <StatCard
            label="Today's Expense"
            value={formatCurrency(todayExpense)}
            accent="maroon"
          />
        </div>

        <div className="space-y-4">
          <NavCard
            href="/pavti"
            title="Receipt"
            description="Record collection receipts"
            icon="🙏"
            color="saffron"
          />
          <NavCard
            href="/expense"
            title="Expense"
            description="Track mandal expenses"
            icon="💰"
            color="maroon"
          />
          <NavCard
            href="/scanner"
            title="Scanner"
            description="PhonePe QR for collections"
            icon="📱"
            color="green"
          />
        </div>
      </div>
      )}
    </PageShell>
  );
}
