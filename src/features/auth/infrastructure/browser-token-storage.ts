import { API_TOKEN_KEYS, type ApiTokenStorage } from "../../../core/api/auth-token-storage";
import type { AuthTokens } from "../domain/auth.types";
import type { TokenStorage } from "../domain/token-storage";

export const browserTokenStorage: TokenStorage & ApiTokenStorage = {
  getAccessToken: () => localStorage.getItem(API_TOKEN_KEYS.ACCESS),
  getRefreshToken: () => localStorage.getItem(API_TOKEN_KEYS.REFRESH),
  saveTokens: ({ accessToken, refreshToken }: AuthTokens) => {
    localStorage.setItem(API_TOKEN_KEYS.ACCESS, accessToken);
    localStorage.setItem(API_TOKEN_KEYS.REFRESH, refreshToken);
  },
  saveAccessToken: (token) => localStorage.setItem(API_TOKEN_KEYS.ACCESS, token),
  clear: () => {
    localStorage.removeItem(API_TOKEN_KEYS.ACCESS);
    localStorage.removeItem(API_TOKEN_KEYS.REFRESH);
  },
};
