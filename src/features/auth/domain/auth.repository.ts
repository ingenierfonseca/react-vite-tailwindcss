import type { AuthTokens, LoginCredentials, UserProfile } from "./auth.types";

/** Port implemented by whichever authentication backend the app uses. */
export interface AuthRepository {
  login(credentials: LoginCredentials): Promise<AuthTokens>;
  getCsrfToken(): Promise<string>;
  getCurrentUser(): Promise<UserProfile>;
  logout(): Promise<void>;
}
