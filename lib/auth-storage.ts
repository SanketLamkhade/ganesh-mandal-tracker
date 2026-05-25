const AUTH_STORAGE_KEY = "mandal-auth";

export interface StoredAuthUser {
  id: string;
  name: string | null;
  email: string | null;
}

export function getStoredAuth(): StoredAuthUser | null {
  if (typeof window === "undefined") return null;

  try {
    const raw = localStorage.getItem(AUTH_STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as StoredAuthUser;
  } catch {
    return null;
  }
}

export function setStoredAuth(user: StoredAuthUser) {
  if (typeof window === "undefined") return;
  localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
}

export function clearStoredAuth() {
  if (typeof window === "undefined") return;
  localStorage.removeItem(AUTH_STORAGE_KEY);
}

export function toStoredAuthUser(user: {
  id?: string;
  name?: string | null;
  email?: string | null;
}): StoredAuthUser | null {
  if (!user.id) return null;
  return {
    id: user.id,
    name: user.name ?? null,
    email: user.email ?? null,
  };
}
