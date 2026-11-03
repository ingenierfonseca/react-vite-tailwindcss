export interface LoginApiResponse {
  token: string;
  refreshToken: string;
  username: string;
  roles: string[];
  permissions: string[];
  userId: number;
  staffId: number | null;
}

export interface UserProfileResponse {
  id: number;
  username: string;
  email: string;
  roles: string[];
  permissions: string[];
  isActive: boolean;
  staffId: number | null;
  firstName: string;
  lastName: string;
  avatar?: string;
  staffTypeName?: string;
}

export const mockLoginApiResponse: LoginApiResponse = {
  token: "mock-access-token",
  refreshToken: "mock-refresh-token",
  username: "ana.garcia",
  roles: ["SuperAdmin"],
  permissions: ["Patient.Read", "Appointment.Read"],
  userId: 101,
  staffId: 42,
};

export const mockUserProfileResponse: UserProfileResponse = {
  id: 101,
  username: "ana.garcia",
  email: "ana.garcia@example.com",
  roles: ["SuperAdmin"],
  permissions: ["Patient.Read", "Appointment.Read"],
  isActive: true,
  staffId: 42,
  firstName: "Ana",
  lastName: "García",
  avatar: "ana-garcia.png",
  staffTypeName: "Odontóloga",
};