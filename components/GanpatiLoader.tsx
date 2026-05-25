"use client";

import Image from "next/image";

const sizeMap = {
  sm: { outer: "h-16 w-16", inner: "h-12 w-12", ring: "border-[3px]" },
  md: { outer: "h-24 w-24", inner: "h-[4.5rem] w-[4.5rem]", ring: "border-4" },
  lg: { outer: "h-32 w-32", inner: "h-24 w-24", ring: "border-4" },
};

interface GanpatiLoaderProps {
  size?: keyof typeof sizeMap;
  label?: string;
  className?: string;
}

export default function GanpatiLoader({
  size = "md",
  label,
  className = "",
}: GanpatiLoaderProps) {
  const dimensions = sizeMap[size];

  return (
    <div className={`flex flex-col items-center justify-center gap-3 ${className}`}>
      <div
        className={`relative flex items-center justify-center ${dimensions.outer}`}
        role="status"
        aria-label={label || "Loading"}
      >
        <div
          className={`absolute inset-0 animate-spin rounded-full ${dimensions.ring} border-saffron/20 border-t-saffron border-r-gold`}
        />
        <div
          className={`relative ${dimensions.inner} overflow-hidden rounded-full border-2 border-gold shadow-md ring-2 ring-saffron/20`}
        >
          <Image
            src="/Ganpati_bg.png"
            alt="Ganpati"
            fill
            className="object-cover"
            priority
          />
        </div>
      </div>
      {label && (
        <p className="text-sm font-medium text-maroon/70">{label}</p>
      )}
    </div>
  );
}

interface LoadingOverlayProps {
  show: boolean;
  label?: string;
}

export function LoadingOverlay({ show, label = "Loading..." }: LoadingOverlayProps) {
  if (!show) return null;

  return (
    <div className="fixed inset-0 z-[90] flex items-center justify-center bg-maroon/25 backdrop-blur-[2px]">
      <div className="rounded-2xl border border-gold/30 bg-white/95 px-8 py-7 shadow-2xl">
        <GanpatiLoader size="lg" label={label} />
      </div>
    </div>
  );
}
