"use client";

interface RadioGroupProps {
  name: string;
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string }[];
}

export default function RadioGroup({
  name,
  value,
  onChange,
  options,
}: RadioGroupProps) {
  return (
    <div className="flex gap-3">
      {options.map((option) => (
        <label
          key={option.value}
          className={`flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-xl border-2 px-4 py-3 text-sm font-medium transition-all ${
            value === option.value
              ? "border-saffron bg-saffron/10 text-maroon"
              : "border-gold/30 bg-white text-maroon/60 hover:border-gold/50"
          }`}
        >
          <input
            type="radio"
            name={name}
            value={option.value}
            checked={value === option.value}
            onChange={() => onChange(option.value)}
            className="sr-only"
          />
          {option.label}
        </label>
      ))}
    </div>
  );
}
