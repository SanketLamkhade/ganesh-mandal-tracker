"use client";

import { getSession, signIn } from "next-auth/react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { validateLoginForm } from "@/lib/form-validation";
import { setStoredAuth, toStoredAuthUser } from "@/lib/auth-storage";
import { MANDAL } from "@/lib/constants";

export default function LoginForm() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
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
      setError("Invalid username or password");
      return;
    }

    const session = await getSession();
    const storedUser = session?.user ? toStoredAuthUser(session.user) : null;
    if (storedUser) {
      setStoredAuth(storedUser);
    }

    router.push("/home");
    router.refresh();
  }

  return (
    <div className="w-full max-w-md animate-fade-in">
      <div className="mb-8 flex items-center gap-4">
        <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-full border-2 border-gold shadow-lg ring-2 ring-saffron/30">
          <Image
            src="/Ganpati_bg.png"
            alt="Ganpati"
            fill
            className="object-cover"
            priority
          />
        </div>
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
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
              className="input-field"
              placeholder="Enter password"
            />
          </div>
        </div>

        <button type="submit" disabled={loading} className="btn-primary mt-6 w-full">
          {loading ? "Signing in..." : "Sign In"}
        </button>
      </form>
    </div>
  );
}
