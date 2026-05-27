"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

const SPLASH_DURATION_MS = 2000;

function isStandalonePwa() {
  if (typeof window === "undefined") return false;
  return (
    window.matchMedia("(display-mode: standalone)").matches ||
    (window.navigator as Navigator & { standalone?: boolean }).standalone ===
      true
  );
}

export default function SplashScreen() {
  const [showInAppSplash, setShowInAppSplash] = useState<boolean | null>(null);

  useEffect(() => {
    const standalone = isStandalonePwa();

    if (standalone) {
      window.location.replace("/login");
      return;
    }

    setShowInAppSplash(true);

    const timer = window.setTimeout(() => {
      setShowInAppSplash(false);
      window.location.replace("/login");
    }, SPLASH_DURATION_MS);

    return () => window.clearTimeout(timer);
  }, []);

  if (showInAppSplash !== true) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-[9999] overflow-hidden bg-[#5C1515]">
      <Image
        src="/Ganpati_Splash_screen.png"
        alt="Navyug Mitra Mandal"
        fill
        priority
        sizes="100vw"
        className="object-cover object-center"
      />
    </div>
  );
}
