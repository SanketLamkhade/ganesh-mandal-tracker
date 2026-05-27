"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="flex min-h-full flex-1 flex-col items-center justify-center px-4 py-12 text-center">
      <h1 className="font-heading text-2xl font-bold text-maroon">
        Something went wrong
      </h1>
      <p className="mt-3 max-w-md text-sm text-maroon/70">
        We could not load this page. Please try again.
      </p>
      <div className="mt-6 flex gap-3">
        <button type="button" onClick={reset} className="btn-primary px-6">
          Try again
        </button>
        <Link href="/home" className="btn-secondary px-6">
          Go home
        </Link>
      </div>
    </main>
  );
}
