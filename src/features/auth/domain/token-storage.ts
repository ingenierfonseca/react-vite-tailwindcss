import type { AuthTokens } from "./auth.types";

export interface TokenStorage {
  getAccessToken(): string | null;
  getRefreshToken(): string | null;
  saveTokens(tokens: AuthTokens): void;
  saveAccessToken(token: string): void;
  clear(): void;
}
