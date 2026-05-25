"use client";

interface SubmitButtonProps {
  loading?: boolean;
  label?: string;
  loadingLabel?: string;
}

export default function SubmitButton({
  loading = false,
  label = "Submit",
  loadingLabel = "Saving...",
}: SubmitButtonProps) {
  return (
    <button type="submit" disabled={loading} className="btn-primary w-full">
      {loading ? loadingLabel : label}
    </button>
  );
}
