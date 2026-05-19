import api from "@/api/api";
import { ENDPOINTS } from "../../api/endpoints";
import { createCatalogService } from "../baseCatalogService";
import type { RequestSessionPlanMaster, RequestStatusUpdate, SessionPlan } from "../treatment-plan/treatmentPlan.type";
import type { Result } from "@/models/result.type";

const method = ENDPOINTS.SESSIONPLAN
const baseService = createCatalogService<SessionPlan>(method);

export const SessionPlanService =  {
    ...baseService,

    post: async (requestSessionPlan: RequestSessionPlanMaster): Promise<Result<SessionPlan>> => {
        const { data } = await api.post(`${method}`, requestSessionPlan);
        return data;
    },
    put: async (id: number, request: RequestSessionPlanMaster): Promise<Result<SessionPlan>> => {
        const { data } = await api.put(`${method}${id}`, request);
        return data;
    },
    updateItemStatus: async (request: RequestStatusUpdate): Promise<Result<SessionPlan>> => {
        const { data } = await api.post(`${method}change-status`, request);
        return data;
    },
    getTreatmentHistory: async (customerId: number): Promise<SessionPlan[]> => {
        const { data } = await api.get(`${method}treatment-history/${customerId}`);
        return data;
    }
}