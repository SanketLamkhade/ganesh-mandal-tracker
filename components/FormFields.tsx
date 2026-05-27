"use client";

interface FormFieldProps {
  label: string;
  id: string;
  children: React.ReactNode;
  required?: boolean;
}

export function FormField({
  label,
  id,
  children,
  required = true,
}: FormFieldProps) {
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-sm font-medium text-maroon">
        {label}
        {required && <span className="text-saffron"> *</span>}
      </label>
      {children}
    </div>
  );
}

export function TextInput({
  id,
  value,
  onChange,
  placeholder,
  type = "text",
  required = true,
  inputMode,
  maxLength,
}: {
  id: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: string;
  required?: boolean;
  inputMode?: React.HTMLAttributes<HTMLInputElement>["inputMode"];
  maxLength?: number;
}) {
  return (
    <input
      id={id}
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      required={required}
      inputMode={inputMode}
      maxLength={maxLength}
      className="input-field"
    />
  );
}

export function DateInput({
  id,
  value,
  onChange,
  required = true,
}: {
  id: string;
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
}) {
  return (
    <input
      id={id}
      type="date"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      required={required}
      className="input-field"
    />
  );
}

export function AmountInput({
  id,
  value,
  onChange,
  required = true,
}: {
  id: string;
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
}) {
  return (
    <div className="flex overflow-hidden rounded-xl border-[1.5px] border-[rgba(212,175,55,0.5)] bg-white transition-[border-color,box-shadow] focus-within:border-saffron focus-within:shadow-[0_0_0_3px_rgba(255,153,51,0.2)]">
      <span className="flex min-h-[44px] shrink-0 items-center border-r border-gold/30 bg-cream/60 px-3 text-sm font-semibold text-maroon/70">
        ₹
      </span>
      <input
        id={id}
        type="number"
        min="0.01"
        step="0.01"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="0.00"
        required={required}
        className="min-h-[44px] w-full flex-1 border-0 bg-transparent px-3 py-2.5 text-base text-maroon outline-none [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
      />
    </div>
  );
}

export function TextArea({
  id,
  value,
  onChange,
  placeholder,
  rows = 3,
  required = true,
}: {
  id: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  rows?: number;
  required?: boolean;
}) {
  return (
    <textarea
      id={id}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      required={required}
      rows={rows}
      className="input-field resize-none"
    />
  );
}
