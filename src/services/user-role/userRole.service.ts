import api from "../../api/api";
import { ENDPOINTS } from "../../api/endpoints";
import { createCatalogService } from "../baseCatalogService";
import type { UserRole } from "../../models/userRole.type";
import type { PaginatedResponse } from "../../models/paginatedResponse";

const baseService = createCatalogService<UserRole>(ENDPOINTS.USERROLE);

export const UserRoleService = {
  ...baseService,
  delete: async (userId: number, roleId: number): Promise<void> => {
    await api.delete(`${ENDPOINTS.USERROLE}${userId}/${roleId}`);
  },
  getByUserId: async (userId: number): Promise<UserRole[]> => {
    const { data } = await api.get(`${ENDPOINTS.USERROLE}by-user/${userId}`);
    if (Array.isArray(data)) return data;
    if ((data as PaginatedResponse<UserRole>).data) return (data as PaginatedResponse<UserRole>).data;
    return [];
  },
};
