"use client";

interface SuccessModalProps {
  open: boolean;
  message: string;
  onClose: () => void;
}

export default function SuccessModal({
  open,
  message,
  onClose,
}: SuccessModalProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
      <button
        type="button"
        aria-label="Close dialog"
        className="absolute inset-0 bg-maroon/40 backdrop-blur-sm"
        onClick={onClose}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="success-modal-title"
        className="relative w-full max-w-sm animate-fade-in rounded-2xl border border-gold/40 bg-white p-6 text-center shadow-2xl"
      >
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-leaf-green/10 text-2xl">
          ✓
        </div>
        <h3
          id="success-modal-title"
          className="font-heading text-lg font-semibold text-maroon"
        >
          {message}
        </h3>
        <button type="button" onClick={onClose} className="btn-primary mt-6 w-full">
          OK
        </button>
      </div>
    </div>
  );
}
