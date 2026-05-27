"use client";

import { useEffect, useState } from "react";
import { MANDAL } from "@/lib/constants";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

export default function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] =
    useState<BeforeInstallPromptEvent | null>(null);
  const [visible, setVisible] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    if (window.matchMedia("(display-mode: standalone)").matches) {
      return;
    }

    const dismissedKey = "mandal-install-dismissed";
    if (localStorage.getItem(dismissedKey) === "1") {
      return;
    }

    function handleBeforeInstall(event: Event) {
      event.preventDefault();
      setDeferredPrompt(event as BeforeInstallPromptEvent);
      setVisible(true);
    }

    window.addEventListener("beforeinstallprompt", handleBeforeInstall);

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstall);
    };
  }, []);

  async function handleInstall() {
    if (!deferredPrompt) return;

    await deferredPrompt.prompt();
    const choice = await deferredPrompt.userChoice;
    setDeferredPrompt(null);
    setVisible(false);

    if (choice.outcome === "dismissed") {
      localStorage.setItem("mandal-install-dismissed", "1");
      setDismissed(true);
    }
  }

  function handleDismiss() {
    setVisible(false);
    setDismissed(true);
    localStorage.setItem("mandal-install-dismissed", "1");
  }

  if (!visible || dismissed) {
    return null;
  }

  return (
    <div className="fixed inset-x-0 bottom-20 z-[60] px-4 sm:bottom-6">
      <div className="mx-auto flex max-w-md items-start gap-3 rounded-2xl border border-gold/40 bg-white p-4 shadow-2xl">
        <div className="flex-1">
          <p className="font-heading text-sm font-semibold text-maroon">
            Install {MANDAL.name}
          </p>
          <p className="mt-1 text-xs text-maroon/70">
            Add this app to your home screen for quick access.
          </p>
        </div>
        <div className="flex shrink-0 flex-col gap-2">
          <button
            type="button"
            onClick={handleInstall}
            className="rounded-lg bg-saffron px-3 py-1.5 text-xs font-semibold text-white"
          >
            Install
          </button>
          <button
            type="button"
            onClick={handleDismiss}
            className="rounded-lg px-3 py-1.5 text-xs text-maroon/60"
          >
            Not now
          </button>
        </div>
      </div>
    </div>
  );
}
