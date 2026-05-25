"use client";

import { FormEvent, useEffect, useState } from "react";
import EntryList from "@/components/EntryList";
import FormCard from "@/components/FormCard";
import GanpatiLoader, { LoadingOverlay } from "@/components/GanpatiLoader";
import {
  AmountInput,
  DateInput,
  FormField,
  TextInput,
} from "@/components/FormFields";
import PageShell from "@/components/PageShell";
import SubmitButton from "@/components/SubmitButton";

import { validateExpenseForm } from "@/lib/form-validation";

function todayString() {
  return new Date().toISOString().split("T")[0];
}

interface ExpenseEntry {
  _id: string;
  date: string;
  description: string;
  amount: number;
  paidBy: string;
}

export default function ExpensePage() {
  const [date, setDate] = useState(todayString());
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [paidBy, setPaidBy] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [entries, setEntries] = useState<ExpenseEntry[]>([]);
  const [listLoading, setListLoading] = useState(true);

  async function fetchEntries() {
    setListLoading(true);
    try {
      const res = await fetch("/api/expense?limit=10");
      if (res.ok) {
        const data = await res.json();
        setEntries(data.entries);
      }
    } finally {
      setListLoading(false);
    }
  }

  useEffect(() => {
    let cancelled = false;

    async function loadEntries() {
      try {
        const res = await fetch("/api/expense?limit=10");
        if (res.ok && !cancelled) {
          const data = await res.json();
          setEntries(data.entries);
        }
      } finally {
        if (!cancelled) setListLoading(false);
      }
    }

    loadEntries();
    return () => {
      cancelled = true;
    };
  }, []);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setError("");
    setMessage("");

    const validationError = validateExpenseForm({
      date,
      description,
      amount,
      paidBy,
    });
    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/expense", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          date,
          description: description.trim(),
          amount,
          paidBy: paidBy.trim(),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Failed to save");
        return;
      }

      setMessage("Expense saved successfully!");
      setDate(todayString());
      setDescription("");
      setAmount("");
      setPaidBy("");
      fetchEntries();
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <PageShell>
      <LoadingOverlay show={loading} label="Saving expense..." />

      <div className="px-4 py-6">
        <FormCard title="New Expense Entry">
          <form onSubmit={handleSubmit} className="space-y-4">
            {message && (
              <div className="rounded-lg bg-leaf-green/10 px-4 py-3 text-sm text-leaf-green">
                {message}
              </div>
            )}
            {error && (
              <div className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
                {error}
              </div>
            )}

            <FormField label="Date" id="date">
              <DateInput id="date" value={date} onChange={setDate} />
            </FormField>

            <FormField label="Description" id="description">
              <TextInput
                id="description"
                value={description}
                onChange={setDescription}
                placeholder="What was this expense for?"
              />
            </FormField>

            <FormField label="Amount" id="amount">
              <AmountInput id="amount" value={amount} onChange={setAmount} />
            </FormField>

            <FormField label="Paid By" id="paidBy">
              <TextInput
                id="paidBy"
                value={paidBy}
                onChange={setPaidBy}
                placeholder="Name of payer"
              />
            </FormField>

            <SubmitButton loading={loading} label="Save Expense" />
          </form>
        </FormCard>

        {listLoading ? (
          <div className="card-mandal mt-6 flex justify-center py-10">
            <GanpatiLoader size="md" label="Loading entries..." />
          </div>
        ) : (
          <EntryList
            title="Recent Expense Entries"
            entries={entries.map((e) => ({
              _id: e._id,
              date: e.date,
              amount: e.amount,
              label: e.description,
              sublabel: `Paid by ${e.paidBy}`,
            }))}
          />
        )}
      </div>
    </PageShell>
  );
}
