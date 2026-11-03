import type { AuthRepository } from "../domain/auth.repository";
import type { LoginCredentials } from "../domain/auth.types";
import type { TokenStorage } from "../domain/token-storage";

export function createAuthUseCases(
  repository: AuthRepository,
  tokenStorage: TokenStorage,
) {
  return {
    async login(credentials: LoginCredentials) {
      const tokens = await repository.login(credentials);
      tokenStorage.saveTokens(tokens);

      try {
        return await repository.getCurrentUser();
      } catch (error) {
        tokenStorage.clear();
        throw error;
      }
    },

    async restoreSession() {
      if (!tokenStorage.getAccessToken()) return null;

      try {
        return await repository.getCurrentUser();
      } catch {
        tokenStorage.clear();
        return null;
      }
    },

    async logout() {
      try {
        await repository.logout();
      } finally {
        tokenStorage.clear();
      }
    },

    getAccessToken() {
      return tokenStorage.getAccessToken();
    },
  };
}

export type AuthUseCases = ReturnType<typeof createAuthUseCases>;
