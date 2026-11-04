/** Token persistence contract consumed by the shared HTTP client. */
export interface ApiTokenStorage {
  getAccessToken: () => string | null;
  getRefreshToken: () => string | null;
  getCsrfToken: () => string | null;
  saveAccessToken: (token: string) => void;
  saveCsrfToken: (token: string) => void;
  clear: () => void;
}

export const API_TOKEN_KEYS = {
  ACCESS: "token",
  REFRESH: "refreshToken",
} as const;

export const API_AUTH_EVENTS = {
  SESSION_EXPIRED: "app:auth-session-expired",
} as const;
