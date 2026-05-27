"use client";

export default function GlobalError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body className="flex min-h-screen items-center justify-center bg-cream px-4">
        <main className="text-center">
          <h1 className="text-2xl font-bold text-maroon">Application error</h1>
          <p className="mt-3 text-sm text-maroon/70">
            Something unexpected happened. Please refresh and try again.
          </p>
          <button
            type="button"
            onClick={reset}
            className="mt-6 rounded-xl bg-saffron px-6 py-3 text-sm font-semibold text-white"
          >
            Try again
          </button>
        </main>
      </body>
    </html>
  );
}
