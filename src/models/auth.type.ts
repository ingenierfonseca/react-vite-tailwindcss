
export const Role = {
  SuperAdmin: "SuperAdmin",
  Admin: "Admin",
  Doctor: "Doctor",
  Recepcionista: "Recepcionista",
} as const;

export type Role = (typeof Role)[keyof typeof Role];

export interface User {
  id: number;
  name: string;
  email?: string;
  roles: string[];
  permissions?: string[];
  staffId?: number | null;
}

export type { LoginCredentials, UserProfile } from "../features/auth/domain/auth.types";
export type {
  LoginApiResponse,
  UserProfileResponse,
} from "../features/auth/infrastructure/auth.dto";
