import { api, configureApiAuth, ENDPOINTS } from "@/core/api";
import { createAuthModule } from "@/features/auth/create-auth-module";
import { browserTokenStorage } from "@/features/auth/infrastructure/browser-token-storage";
import { createHttpAuthRepository } from "@/features/auth/infrastructure/http-auth.repository";

configureApiAuth({ tokenStorage: browserTokenStorage, endpoints: ENDPOINTS.AUTH });

/** Application-specific wiring for the reusable auth feature. */
export const authModule = createAuthModule(
  createHttpAuthRepository(api, ENDPOINTS.AUTH),
  browserTokenStorage,
);
