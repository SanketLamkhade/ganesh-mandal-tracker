"use client";

import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { FormEvent, useState } from "react";
import MandalAvatar from "@/components/MandalAvatar";
import { validateLoginForm } from "@/lib/form-validation";
import { MANDAL } from "@/lib/constants";

function getFriendlyAuthError(code: string | null) {
  if (!code) return "";
  if (code === "CredentialsSignin") {
    return "Invalid username or password.";
  }
  return "Unable to sign in right now. Please try again.";
}

export default function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(
    getFriendlyAuthError(searchParams.get("error")),
  );
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setError("");

    const validationError = validateLoginForm({ username, password });
    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);

    const result = await signIn("credentials", {
      username: username.trim(),
      password,
      redirect: false,
    });

    setLoading(false);

    if (result?.error) {
      if (result.status === 429) {
        setError("Too many login attempts. Please wait a few minutes.");
      } else {
        setError("Invalid username or password.");
      }
      return;
    }

    router.push("/home");
    router.refresh();
  }

  return (
    <div className="w-full max-w-md animate-fade-in">
      <div className="mb-8 flex items-center gap-4">
        <MandalAvatar size="md" priority />
        <div>
          <h1 className="font-heading text-2xl font-bold text-maroon sm:text-3xl">
            {MANDAL.name}
          </h1>
          <p className="text-sm text-maroon/70">Collection Tracker</p>
        </div>
      </div>

      <form
        onSubmit={handleSubmit}
        className="rounded-2xl border border-gold/40 bg-white/90 p-6 shadow-xl backdrop-blur-sm"
      >
        <h2 className="mb-6 text-center font-heading text-xl font-semibold text-maroon">
          Login
        </h2>

        {error && (
          <div className="mb-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        <div className="space-y-4">
          <div>
            <label htmlFor="username" className="mb-1.5 block text-sm font-medium text-maroon">
              Username <span className="text-saffron">*</span>
            </label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              autoComplete="username"
              className="input-field"
              placeholder="Enter username"
            />
          </div>

          <div>
            <label htmlFor="password" className="mb-1.5 block text-sm font-medium text-maroon">
              Password <span className="text-saffron">*</span>
            </label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
                className="input-field pr-12"
                placeholder="Enter password"
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-1 text-maroon/60 transition-colors hover:text-maroon"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-5 w-5" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 3l18 18M10.477 10.48A3 3 0 0 0 12 15a3 3 0 0 0 2.523-4.52M9.88 4.24A10.66 10.66 0 0 1 12 4c5 0 9.27 3.11 11 7.5a11.66 11.66 0 0 1-2.08 3.58M6.61 6.61A11.66 11.66 0 0 0 3 11.5C4.73 15.89 9 19 14 19c1.01 0 1.99-.13 2.93-.37" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-5 w-5" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.062 12.348a1 1 0 0 1 0-.696C3.73 7.11 7.96 4 12 4s8.27 3.11 10 7.348a1 1 0 0 1 0 .696C20.27 16.89 16.04 20 12 20s-8.27-3.11-10-7.652Z" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                )}
              </button>
            </div>
          </div>
        </div>

        <button type="submit" disabled={loading} className="btn-primary mt-6 w-full">
          {loading ? "Signing in..." : "Sign In"}
        </button>
      </form>
    </div>
  );
}
