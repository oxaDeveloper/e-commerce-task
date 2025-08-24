import { JWT_STORAGE_KEY } from "./constants";

const isBrowser = typeof window !== "undefined";

export function getToken(): string | null {
  if (!isBrowser) return null;
  try {
    return localStorage.getItem(JWT_STORAGE_KEY);
  } catch {
    return null;
  }
}

export function setToken(token: string): void {
  if (!isBrowser) return;
  try {
    localStorage.setItem(JWT_STORAGE_KEY, token);
  } catch {}
}

export function clearToken(): void {
  if (!isBrowser) return;
  try {
    localStorage.removeItem(JWT_STORAGE_KEY);
  } catch {}
}

const LAST_EMAIL_KEY = "lastKnownEmail";
const LAST_ROLE_KEY = "lastKnownRole";

export function setLastKnownEmail(email: string): void {
  if (isBrowser) {
    localStorage.setItem(LAST_EMAIL_KEY, email);
  }
}

export function getLastKnownEmail(): string | null {
  if (isBrowser) {
    return localStorage.getItem(LAST_EMAIL_KEY);
  }
  return null;
}

export function clearLastKnownEmail(): void {
  if (isBrowser) {
    localStorage.removeItem(LAST_EMAIL_KEY);
  }
}

export function setLastKnownRole(role: string): void {
  if (isBrowser) {
    localStorage.setItem(LAST_ROLE_KEY, role);
  }
}

export function getLastKnownRole(): string | null {
  if (isBrowser) {
    return localStorage.getItem(LAST_ROLE_KEY);
  }
  return null;
}

export function clearLastKnownRole(): void {
  if (isBrowser) {
    localStorage.removeItem(LAST_ROLE_KEY);
  }
}
