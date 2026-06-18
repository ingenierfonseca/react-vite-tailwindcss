import api from "@/api/api";
import { ENDPOINTS } from "../../api/endpoints";
import { createCatalogService } from "../baseCatalogService";
import type { Doctor, DoctorInfoDTO } from "./doctor.type";
import type { PaginatedResponse } from "@/models/paginatedResponse";

const method = ENDPOINTS.DOCTOR
const baseService = createCatalogService<Doctor>(method);

export const DoctorService = {
    ...baseService,

    get: async ({ page = 1, search = "", specialtyId }: {
        page?: number; search?: string; specialtyId?: number
    } = {}): Promise<PaginatedResponse<DoctorInfoDTO>> => {
        const params = new URLSearchParams();
        params.set("pageNumber", String(page));
        params.set("pageSize", "15");
        if (search) params.set("search", search);
        if (specialtyId) params.set("specialtyId", String(specialtyId));
        const { data } = await api.get(`${method}?${params.toString()}`);
        return data;
    },
    find: async (id: number): Promise<Doctor> => {
        const { data } = await api.get(
            `${method}${id}`
        );
        return data;
    },
}