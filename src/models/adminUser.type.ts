export interface AdminUser {
  id: number;
  username: string;
  email: string;
  roles: string[];
  permissions: string[];
  isActive: boolean;
}
