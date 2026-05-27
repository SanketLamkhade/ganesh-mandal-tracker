"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

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
