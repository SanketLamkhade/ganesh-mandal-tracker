"use client";

import { useEffect, useState } from "react";
import EntryList, { formatCurrency } from "@/components/EntryList";
import { DateInput, FormField } from "@/components/FormFields";
import GanpatiLoader from "@/components/GanpatiLoader";
import PageShell from "@/components/PageShell";
import StatCard from "@/components/StatCard";

function monthStartString() {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth(), 1)
    .toISOString()
    .split("T")[0];
}

function todayString() {
  return new Date().toISOString().split("T")[0];
}

interface ReportSummary {
  totalPavti: number;
  totalExpense: number;
  netBalance: number;
  completedCount: number;
  completedAmount: number;
  pendingCount: number;
  pendingAmount: number;
}

interface PavtiEntry {
  _id: string;
  status: string;
  date: string;
  recipientName: string;
  address: string;
  phoneNumber?: string;
  amount: number;
}

interface ExpenseEntry {
  _id: string;
  date: string;
  description: string;
  amount: number;
  paidBy: string;
}

export default function ReportsPage() {
  const [from, setFrom] = useState(monthStartString());
  const [to, setTo] = useState(todayString());
  const [summary, setSummary] = useState<ReportSummary | null>(null);
  const [pavtis, setPavtis] = useState<PavtiEntry[]>([]);
  const [expenses, setExpenses] = useState<ExpenseEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function loadReports() {
      if (!cancelled) setLoading(true);
      setError("");
      try {
        const res = await fetch(`/api/reports?from=${from}&to=${to}`);
        if (!res.ok) {
          if (!cancelled) setError("Failed to load reports");
          return;
        }
        const data = await res.json();
        if (!cancelled) {
          setSummary(data.summary);
          setPavtis(data.pavtis);
          setExpenses(data.expenses);
        }
      } catch {
        if (!cancelled) setError("Something went wrong. Please try again.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    loadReports();
    return () => {
      cancelled = true;
    };
  }, [from, to]);

  return (
    <PageShell>
      <div className="animate-fade-in space-y-6 px-4 py-6">
        <div className="card-mandal p-5">
          <h2 className="mb-4 font-heading text-lg font-semibold text-maroon">
            Date Range
          </h2>
          <div className="grid grid-cols-2 gap-3">
            <FormField label="From" id="from">
              <DateInput id="from" value={from} onChange={setFrom} />
            </FormField>
            <FormField label="To" id="to">
              <DateInput id="to" value={to} onChange={setTo} />
            </FormField>
          </div>
        </div>

        {error && (
          <div className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        {loading ? (
          <div className="card-mandal flex justify-center py-12">
            <GanpatiLoader size="lg" label="Loading reports..." />
          </div>
        ) : summary ? (
          <>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              <StatCard
                label="Total Receipts"
                value={formatCurrency(summary.totalPavti)}
                accent="saffron"
              />
              <StatCard
                label="Total Expense"
                value={formatCurrency(summary.totalExpense)}
                accent="maroon"
              />
              <StatCard
                label="Net Balance"
                value={formatCurrency(summary.netBalance)}
                accent="green"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <StatCard
                label={`Completed (${summary.completedCount})`}
                value={formatCurrency(summary.completedAmount)}
                accent="green"
              />
              <StatCard
                label={`Pending (${summary.pendingCount})`}
                value={formatCurrency(summary.pendingAmount)}
                accent="saffron"
              />
            </div>

            <EntryList
              title="Receipts in Range"
              entries={pavtis.map((e) => ({
                _id: e._id,
                date: e.date,
                amount: e.amount,
                label: e.recipientName,
                sublabel: e.phoneNumber ? `${e.phoneNumber} · ${e.address}` : e.address,
                badge: e.status,
                badgeColor: e.status === "completed" ? "green" : "orange",
              }))}
              emptyMessage="No receipt entries in this range"
            />

            <EntryList
              title="Expenses in Range"
              entries={expenses.map((e) => ({
                _id: e._id,
                date: e.date,
                amount: e.amount,
                label: e.description,
                sublabel: `Paid by ${e.paidBy}`,
              }))}
              emptyMessage="No expense entries in this range"
            />
          </>
        ) : null}
      </div>
    </PageShell>
  );
}
