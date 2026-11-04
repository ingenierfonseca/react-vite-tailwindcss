import type { AuthTokens } from "./auth.types";

export interface TokenStorage {
  getAccessToken(): string | null;
  getRefreshToken(): string | null;
  getCsrfToken(): string | null;
  saveTokens(tokens: AuthTokens): void;
  saveAccessToken(token: string): void;
  saveCsrfToken(token: string): void;
  clear(): void;
}
