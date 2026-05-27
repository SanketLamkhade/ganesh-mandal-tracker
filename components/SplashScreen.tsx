"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { MANDAL } from "@/lib/constants";

const SPLASH_DURATION_MS = 2000;

export default function SplashScreen() {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
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

      <div className="relative z-10 flex w-full max-w-sm animate-splash flex-col items-center text-center">
        <div className="mb-8 flex h-44 w-44 items-center justify-center rounded-full border-4 border-gold bg-[#4a1250] p-3 shadow-2xl ring-4 ring-saffron/30 sm:h-52 sm:w-52 sm:p-4">
          <div className="relative h-full w-full overflow-hidden rounded-full">
            <Image
              src="/Ganpati_bg.png"
              alt="Shree Ganesh"
              fill
              className="object-contain"
              priority
            />
          </div>
        </div>

        <h1 className="font-heading text-2xl font-bold text-white sm:text-3xl">
          {MANDAL.name}
        </h1>
      </div>
    </div>
  );
}
