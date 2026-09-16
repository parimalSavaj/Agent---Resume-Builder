import { apiClient } from "../../lib/apiClient";
import type { StoredAuth } from "../../lib/authStorage";

export interface Credentials {
  username: string;
  password: string;
}

export async function signup(credentials: Credentials): Promise<StoredAuth> {
  const { data } = await apiClient.post<{ data: StoredAuth }>("/auth/signup", credentials);
  return data.data;
}

export async function login(credentials: Credentials): Promise<StoredAuth> {
  const { data } = await apiClient.post<{ data: StoredAuth }>("/auth/login", credentials);
  return data.data;
}

export async function logout(refreshToken: string): Promise<void> {
  await apiClient.post("/auth/logout", { refreshToken });
}
