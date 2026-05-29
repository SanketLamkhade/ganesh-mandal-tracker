"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { MANDAL } from "@/lib/constants";

const SPLASH_DURATION_MS = 2000;

function isStandalonePwa() {
  return (
    window.matchMedia("(display-mode: standalone)").matches ||
    (window.navigator as Navigator & { standalone?: boolean }).standalone ===
      true
  );
}

export default function SplashScreen() {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    if (isStandalonePwa()) {
      window.location.replace("/login");
      return;
    }

    const timer = window.setTimeout(() => {
      setVisible(false);
      window.location.replace("/login");
    }, SPLASH_DURATION_MS);

    return () => window.clearTimeout(timer);
  }, []);

  if (!visible) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center overflow-hidden px-6 pb-[max(1.5rem,env(safe-area-inset-bottom))] pt-[max(1.5rem,env(safe-area-inset-top))]">
      <div className="absolute inset-0 bg-gradient-to-b from-maroon via-[#5C1515] to-maroon" />

      <div className="absolute inset-0 opacity-20">
        <div className="absolute left-1/4 top-1/4 h-64 w-64 rounded-full border-2 border-gold" />
        <div className="absolute bottom-1/4 right-1/4 h-48 w-48 rounded-full border border-gold/60" />
      </div>

      <div className="relative z-10 flex animate-splash flex-col items-center text-center">
        <div className="relative h-48 w-48 shrink-0 sm:h-56 sm:w-56">
          <Image
            src="/icons/icon-512.png"
            alt="Ganpati"
            fill
            className="object-contain"
            priority
            sizes="(max-width: 640px) 192px, 224px"
          />
        </div>
        <h1 className="mt-8 font-heading text-2xl font-bold tracking-wide text-white sm:text-3xl">
          {MANDAL.name}
        </h1>
      </div>
    </div>
  );
}
