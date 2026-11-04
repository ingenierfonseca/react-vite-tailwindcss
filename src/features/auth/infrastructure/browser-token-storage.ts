import type { ApiTokenStorage } from "../../../core/api/auth-token-storage";
import type { AuthTokens } from "../domain/auth.types";
import type { TokenStorage } from "../domain/token-storage";

let csrfToken: string | null = null;

export const browserTokenStorage: TokenStorage & ApiTokenStorage = {
  // The API stores access and refresh tokens in HttpOnly cookies; JS only keeps the CSRF token in memory.
  getAccessToken: () => null,
  getRefreshToken: () => null,
  getCsrfToken: () => csrfToken,
  saveTokens: (tokens: AuthTokens) => { if (tokens.csrfToken) csrfToken = tokens.csrfToken; },
  saveAccessToken: () => undefined,
  saveCsrfToken: (token) => { csrfToken = token; },
  clear: () => { csrfToken = null; },
};
