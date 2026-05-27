"use client";

import { createContext, useContext, useMemo } from "react";
import { SessionProvider } from "next-auth/react";
import type { Session } from "next-auth";

interface AuthUser {
  id: string;
  name: string | null;
  email: string | null;
}

const AuthContext = createContext<AuthUser | null>(null);

export function useAuthUser() {
  return useContext(AuthContext);
}

export default function AuthProvider({
  children,
  session,
}: {
  children: React.ReactNode;
  session: Session | null;
}) {
  const user = useMemo<AuthUser | null>(() => {
    if (!session?.user?.id) return null;
    return {
      id: session.user.id,
      name: session.user.name ?? null,
      email: session.user.email ?? null,
    };
  }, [session]);

  return (
    <SessionProvider
      session={session}
      refetchInterval={5 * 60}
      refetchOnWindowFocus={true}
    >
      <AuthContext.Provider value={user}>{children}</AuthContext.Provider>
    </SessionProvider>
  );
}
