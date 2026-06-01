import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react";
import type { User, LoginCredentials, UserProfileResponse } from "../models/auth.type";
import { Role } from "../models/auth.type";
import { AuthService } from "../services/auth/auth.service";

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => Promise<void>;
  getAccessToken: () => string | null;
}

const AuthContext = createContext<AuthContextType | null>(null);

const TOKEN_KEY = "token";
const REFRESH_TOKEN_KEY = "refreshToken";

function decodeJwtPayload(token: string): Record<string, unknown> | null {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return null;
    const payload = parts[1];
    const decoded = atob(payload.replace(/-/g, "+").replace(/_/g, "/"));
    return JSON.parse(decoded) as Record<string, unknown>;
  } catch {
    return null;
  }
}

function isTokenExpired(token: string): boolean {
  const payload = decodeJwtPayload(token);
  if (!payload || !payload.exp) return true;
  const exp = Number(payload.exp) * 1000;
  return Date.now() >= exp - 30000;
}

function mapProfileToUser(profile: UserProfileResponse): User {
  return {
    id: profile.id,
    name: profile.username,
    email: profile.email,
    role: (profile.roles[0] as Role) || Role.Admin,
    permissions: profile.permissions,
    doctorId: profile.doctorId,
    customerId: profile.customerId,
  };
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const getAccessToken = useCallback(() => {
    return localStorage.getItem(TOKEN_KEY);
  }, []);

  const logout = useCallback(async () => {
    await AuthService.logout();
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
    setUser(null);
  }, []);

  const login = useCallback(async (credentials: LoginCredentials) => {
    const response = await AuthService.login(credentials);
    localStorage.setItem(TOKEN_KEY, response.token);
    localStorage.setItem(REFRESH_TOKEN_KEY, response.refreshToken);
    setUser({
      id: response.userId,
      name: response.username,
      role: (response.roles[0] as Role) || Role.Admin,
      permissions: response.permissions,
      doctorId: response.doctorId,
      customerId: response.customerId,
    });
  }, []);

  const tryRefresh = useCallback(async (): Promise<boolean> => {
    const storedRefresh = localStorage.getItem(REFRESH_TOKEN_KEY);
    if (!storedRefresh) return false;

    try {
      const result = await AuthService.refreshToken(storedRefresh);
      localStorage.setItem(TOKEN_KEY, result.token);
      return true;
    } catch {
      return false;
    }
  }, []);

  useEffect(() => {
    const init = async () => {
      const token = localStorage.getItem(TOKEN_KEY);
      if (!token) {
        setLoading(false);
        return;
      }

      if (isTokenExpired(token)) {
        const refreshed = await tryRefresh();
        if (!refreshed) {
          await logout();
          setLoading(false);
          return;
        }
      }

      try {
        const profile = await AuthService.getProfile();
        setUser(mapProfileToUser(profile));
      } catch {
        await logout();
      } finally {
        setLoading(false);
      }
    };

    init();
  }, [tryRefresh, logout]);

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    loading,
    login,
    logout,
    getAccessToken,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
