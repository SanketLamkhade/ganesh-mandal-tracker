"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { MANDAL } from "@/lib/constants";

export default function SplashScreen() {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.push("/login");
    }, 2500);

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <main
      className="relative flex min-h-full flex-1 cursor-pointer flex-col items-center justify-center overflow-hidden"
      onClick={() => router.push("/login")}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === "Enter" && router.push("/login")}
    >
      <div className="absolute inset-0 bg-gradient-to-b from-maroon via-[#5C1515] to-maroon" />

      <div className="absolute inset-0 opacity-20">
        <div className="absolute left-1/4 top-1/4 h-64 w-64 rounded-full border-2 border-gold" />
        <div className="absolute bottom-1/4 right-1/4 h-48 w-48 rounded-full border border-gold/60" />
      </div>

      <div className="relative z-10 flex animate-splash flex-col items-center px-6 text-center">
        <div className="relative mb-8 h-48 w-48 overflow-hidden rounded-full border-4 border-gold shadow-2xl ring-4 ring-saffron/30 sm:h-56 sm:w-56">
          <Image
            src="/Ganpati.png"
            alt="Shree Ganesh"
            fill
            className="object-cover"
            priority
          />
        </div>

        <h1 className="font-heading text-2xl font-bold text-white sm:text-3xl">
          {MANDAL.name}
        </h1>
        <p className="mt-2 text-sm text-white/70">Collection Tracker</p>
        <p className="mt-8 animate-pulse text-xs text-gold">Tap to continue...</p>
      </div>
    </main>
  );
}
