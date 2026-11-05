import { api, ENDPOINTS } from "@/core/api";

export interface DepartmentCatalogItem {
  id: number;
  code: string;
  name: string;
  isAutonomousRegion: boolean;
}

export interface CityCatalogItem {
  id: number;
  departmentId: number;
  code: string;
  name: string;
  isDepartmentCapital: boolean;
  isPrincipalCity: boolean;
}

export const GeographyService = {
  async getDepartments(): Promise<DepartmentCatalogItem[]> {
    const { data } = await api.get<DepartmentCatalogItem[]>(ENDPOINTS.GEOGRAPHY.DEPARTMENTS);
    return data;
  },

  async getCities(departmentId: number): Promise<CityCatalogItem[]> {
    const { data } = await api.get<CityCatalogItem[]>(ENDPOINTS.GEOGRAPHY.CITIES_FOR_DEPARTMENT(departmentId));
    return data;
  },
};