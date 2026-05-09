import type { PaginatedResponse } from "@/models/paginatedResponse";
import { ENDPOINTS } from "../../api/endpoints";
import { createCatalogService } from "../baseCatalogService";
import type { TreatmentPlan } from "./treatmentPlan.type";
import api from "@/api/api";

const method = ENDPOINTS.TREATMENTPLAN
const baseService = createCatalogService<TreatmentPlan>(method);

export const TreatmentPlanService =  {
    ...baseService,

    getActive: async ({
        page,
        search
    }: {
        page: number; search: string
     }): Promise<PaginatedResponse<TreatmentPlan>> => {
        const { data } = await api.get(`${method}active?pageNumber=${page}${search ? `&search=${search}` : ''}`);
        return data;
    }
}