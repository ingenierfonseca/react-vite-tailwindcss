import type { AuthRepository } from "../domain/auth.repository";
import type { LoginCredentials } from "../domain/auth.types";
import type { TokenStorage } from "../domain/token-storage";

export function createAuthUseCases(
  repository: AuthRepository,
  tokenStorage: TokenStorage,
) {
  return {
    async login(credentials: LoginCredentials) {
      const data = await repository.login(credentials);
      tokenStorage.saveTokens(data);
      if (data.csrfToken) tokenStorage.saveCsrfToken(data.csrfToken);

      return  {
        id: data.userId,
        userName: data.userName,
        email: data.email,
        roles: data.roles,
        permissions: data.permissions,
        staffId: data.staffId,
        firstName: data.firstName,
        lastName: data.lastName,
        staffTypeName: data.staffTypeName,
        avatar: data.avatar
      }
    },

    async restoreSession() {
      try {
        const csrfToken = await repository.getCsrfToken();
        tokenStorage.saveCsrfToken(csrfToken);
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
