import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { API_AUTH_EVENTS } from "../../../core/api/auth-token-storage";
import type { AuthModule } from "../create-auth-module";
import type { LoginCredentials, UserProfile } from "../domain/auth.types";
import { AuthContext, type AuthContextValue } from "./auth-context";

export function AuthProvider({
  children,
  auth,
}: {
  children: ReactNode;
  auth: AuthModule;
}) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  const login = useCallback(async (credentials: LoginCredentials) => {
    const authenticatedUser = await auth.login(credentials);
    setUser(authenticatedUser);
  }, [auth]);

  const logout = useCallback(async () => {
    try {
      await auth.logout();
    } finally {
      setUser(null);
    }
  }, [auth]);

  useEffect(() => {
    let active = true;

    const restore = async () => {
      const restoredUser = await auth.restoreSession();
      if (active) {
        setUser(restoredUser);
        setLoading(false);
      }
    };

    const handleSessionExpired = () => setUser(null);
    window.addEventListener(API_AUTH_EVENTS.SESSION_EXPIRED, handleSessionExpired);
    void restore();

    return () => {
      active = false;
      window.removeEventListener(API_AUTH_EVENTS.SESSION_EXPIRED, handleSessionExpired);
    };
  }, [auth]);

  const value = useMemo<AuthContextValue>(() => ({
    user,
    isAuthenticated: Boolean(user),
    loading,
    login,
    logout,
    getAccessToken: auth.getAccessToken,
  }), [auth, loading, login, logout, user]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
