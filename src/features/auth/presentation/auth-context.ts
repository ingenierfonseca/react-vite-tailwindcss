import { createContext } from "react";
import type { LoginCredentials, UserProfile } from "../domain/auth.types";

export interface AuthContextValue {
  user: UserProfile | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => Promise<void>;
  getAccessToken: () => string | null;
}

export const AuthContext = createContext<AuthContextValue | null>(null);
