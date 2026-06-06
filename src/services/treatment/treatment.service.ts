import { ENDPOINTS } from "@/api/endpoints";
import api from "../../api/api";
import type { PaginatedResponse } from "../../models/paginatedResponse";
import type { Treatment } from "./treatment.type";
import { createCatalogService } from "../baseCatalogService";

const method = ENDPOINTS.TREATMENT;
const baseService = createCatalogService<Treatment>(method);

export const TreatmentService =  {
    ...baseService,

    getActive: async ({
        page,
        search
    }: { 
        page: number; search: string
     }): Promise<PaginatedResponse<Treatment>> => {
        const { data } = await api.get(`${method}active?pageNumber=${page}${search ? `&search=${search}` : ''}`);
        return data;
    }
};