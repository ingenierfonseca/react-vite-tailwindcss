import api from "@/api/api";
import { ENDPOINTS } from "../../api/endpoints";
import { createCatalogService } from "../baseCatalogService";
import type { Specialty } from "@/models/specialty.type";
import type { PaginatedResponse } from "@/models/paginatedResponse";

const baseService = createCatalogService<Specialty>(ENDPOINTS.SPECIALTY);

export const SpecialtyService = {
    ...baseService,
    get: async ({ page = 1, search = "", serviceId }: {
        page?: number; search?: string; serviceId?: number
    } = {}): Promise<PaginatedResponse<Specialty>> => {
        const params = new URLSearchParams();
        params.set("pageNumber", String(page));
        params.set("pageSize", "15");
        if (search) params.set("search", search);
        if (serviceId) params.set("serviceId", String(serviceId));
        const { data } = await api.get(`${ENDPOINTS.SPECIALTY}?${params.toString()}`);
        return data;
    },
};
