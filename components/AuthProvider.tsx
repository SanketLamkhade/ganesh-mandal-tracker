"use client";

import { createContext, useContext, useEffect, useMemo } from "react";
import { SessionProvider } from "next-auth/react";
import type { Session } from "next-auth";
import {
  clearStoredAuth,
  setStoredAuth,
  toStoredAuthUser,
  type StoredAuthUser,
} from "@/lib/auth-storage";

const AuthContext = createContext<StoredAuthUser | null>(null);

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
  const user = useMemo(
    () => (session?.user ? toStoredAuthUser(session.user) : null),
    [session],
  );

  useEffect(() => {
    if (user) {
      setStoredAuth(user);
      return;
    }

    clearStoredAuth();
  }, [user]);

  return (
    <SessionProvider
      session={session}
      refetchInterval={0}
      refetchOnWindowFocus={false}
    >
      <AuthContext.Provider value={user}>{children}</AuthContext.Provider>
    </SessionProvider>
  );
}
