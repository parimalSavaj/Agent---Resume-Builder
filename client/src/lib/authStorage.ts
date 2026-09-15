export interface StoredUser {
  id: string;
  username: string;
}

export interface StoredAuth {
  accessToken: string;
  refreshToken: string;
  user: StoredUser;
}

const STORAGE_KEY = "resume_builder_auth";

export function getStoredAuth(): StoredAuth | null {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as StoredAuth;
  } catch {
    return null;
  }
}

export function setStoredAuth(auth: StoredAuth): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(auth));
}

export function clearStoredAuth(): void {
  localStorage.removeItem(STORAGE_KEY);
}
