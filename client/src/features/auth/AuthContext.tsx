import { createContext, useCallback, useContext, useMemo, useState } from "react";
import type { ReactNode } from "react";
import { getStoredAuth, setStoredAuth, clearStoredAuth } from "../../lib/authStorage";
import type { StoredUser } from "../../lib/authStorage";
import * as authApi from "./authApi";

interface AuthContextValue {
  user: StoredUser | null;
  isAuthenticated: boolean;
  login: (username: string, password: string) => Promise<void>;
  signup: (username: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<StoredUser | null>(() => getStoredAuth()?.user ?? null);

  const login = useCallback(async (username: string, password: string) => {
    const result = await authApi.login({ username, password });
    setStoredAuth(result);
    setUser(result.user);
  }, []);

  const signup = useCallback(async (username: string, password: string) => {
    const result = await authApi.signup({ username, password });
    setStoredAuth(result);
    setUser(result.user);
  }, []);

  const logout = useCallback(async () => {
    const stored = getStoredAuth();
    if (stored?.refreshToken) {
      try {
        await authApi.logout(stored.refreshToken);
      } catch {
        // Even if the server call fails, clear local session state below.
      }
    }
    clearStoredAuth();
    setUser(null);
  }, []);

  const value = useMemo(
    () => ({ user, isAuthenticated: user !== null, login, signup, logout }),
    [user, login, signup, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return ctx;
}
