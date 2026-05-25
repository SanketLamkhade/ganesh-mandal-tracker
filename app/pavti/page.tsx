"use client";

import { FormEvent, useEffect, useState } from "react";
import EntryList from "@/components/EntryList";
import FormCard from "@/components/FormCard";
import GanpatiLoader, { LoadingOverlay } from "@/components/GanpatiLoader";
import {
  AmountInput,
  DateInput,
  FormField,
  TextArea,
  TextInput,
} from "@/components/FormFields";
import PageShell from "@/components/PageShell";
import RadioGroup from "@/components/RadioGroup";
import SubmitButton from "@/components/SubmitButton";
import SuccessModal from "@/components/SuccessModal";

import { validatePavtiForm } from "@/lib/form-validation";

function todayString() {
  return new Date().toISOString().split("T")[0];
}

interface PavtiEntry {
  _id: string;
  status: string;
  date: string;
  recipientName: string;
  address: string;
  amount: number;
}

export default function PavtiPage() {
  const [status, setStatus] = useState("completed");
  const [date, setDate] = useState(todayString());
  const [recipientName, setRecipientName] = useState("");
  const [address, setAddress] = useState("");
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [error, setError] = useState("");
  const [entries, setEntries] = useState<PavtiEntry[]>([]);
  const [listLoading, setListLoading] = useState(true);

  async function fetchEntries() {
    setListLoading(true);
    try {
      const res = await fetch("/api/pavti?limit=10");
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
        const res = await fetch("/api/pavti?limit=10");
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
    setShowSuccess(false);

    const validationError = validatePavtiForm({
      status,
      date,
      recipientName,
      address,
      amount,
    });
    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/pavti", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status,
          date,
          recipientName: recipientName.trim(),
          address: address.trim(),
          amount,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Failed to save");
        return;
      }

      setShowSuccess(true);
      setStatus("completed");
      setDate(todayString());
      setRecipientName("");
      setAddress("");
      setAmount("");
      fetchEntries();
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <PageShell>
      <LoadingOverlay show={loading} label="Submitting receipt..." />

      <div className="px-4 py-6">
        <FormCard title="New Pavti Entry">
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
                {error}
              </div>
            )}

            <FormField label="Status" id="status">
              <RadioGroup
                name="status"
                value={status}
                onChange={setStatus}
                options={[
                  { value: "completed", label: "Completed" },
                  { value: "pending", label: "Pending" },
                ]}
              />
            </FormField>

            <FormField label="Date" id="date">
              <DateInput id="date" value={date} onChange={setDate} />
            </FormField>

            <FormField label="Recipient Name" id="recipientName">
              <TextInput
                id="recipientName"
                value={recipientName}
                onChange={setRecipientName}
                placeholder="Full name"
              />
            </FormField>

            <FormField label="Address" id="address">
              <TextArea
                id="address"
                value={address}
                onChange={setAddress}
                placeholder="Full address"
              />
            </FormField>

            <FormField label="Amount" id="amount">
              <AmountInput id="amount" value={amount} onChange={setAmount} />
            </FormField>

            <SubmitButton
              loading={loading}
              label="Submit Receipt"
              loadingLabel="Submitting..."
            />
          </form>
        </FormCard>

        <SuccessModal
          open={showSuccess}
          message="Submitted successfully"
          onClose={() => setShowSuccess(false)}
        />

        {listLoading ? (
          <div className="card-mandal mt-6 flex justify-center py-10">
            <GanpatiLoader size="md" label="Loading entries..." />
          </div>
        ) : (
          <EntryList
            title="Recent Collection Entries"
            entries={entries.map((e) => ({
              _id: e._id,
              date: e.date,
              amount: e.amount,
              label: e.recipientName,
              sublabel: e.address,
              badge: e.status,
              badgeColor: e.status === "completed" ? "green" : "orange",
            }))}
          />
        )}
      </div>
    </PageShell>
  );
}
