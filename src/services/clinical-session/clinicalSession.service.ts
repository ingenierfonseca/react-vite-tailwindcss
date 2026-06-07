import api from "@/api/api";
import { ENDPOINTS } from "../../api/endpoints";
import { createCatalogService, type GetParams } from "../baseCatalogService";
import type { ClinicalSession, ClinicalSessionShortInfo } from "./clinicalSession.type";
import type { PaginatedResponse } from "@/models/paginatedResponse";

const method = ENDPOINTS.CLINICALSESSION
const baseService = createCatalogService<ClinicalSession>(method);

export const ClinicalSessionService =  {
    ...baseService,

    getSessionHistory: async (customerId: number): Promise<ClinicalSession[]> => {
        const { data } = await api.get(`${method}history/${customerId}`);
        return data;
    },
    customerSessionsShortInfo: async (customerId: number, { page, search, size }: GetParams): Promise<PaginatedResponse<ClinicalSessionShortInfo>> => {
        console.log("fetching sessions with params: ", { page, search, size });
        const { data } = await api.get(`${method}customer/${customerId}/short-info`);
        return {
            data: data,
            currentPage: 1,
            totalPages: 1,
            pageSize: data.length,
            totalItems: data.length
        };
    },
};