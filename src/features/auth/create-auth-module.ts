import type { AuthRepository } from "./domain/auth.repository";
import type { TokenStorage } from "./domain/token-storage";
import { createAuthUseCases } from "./application/create-auth-use-cases";

export function createAuthModule(
  repository: AuthRepository,
  tokenStorage: TokenStorage,
) {
  return createAuthUseCases(repository, tokenStorage);
}

export type AuthModule = ReturnType<typeof createAuthModule>;
