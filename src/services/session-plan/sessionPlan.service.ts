import api from "@/api/api";
import { ENDPOINTS } from "../../api/endpoints";
import { createCatalogService } from "../baseCatalogService";
import type { RequestSessionPlanMaster, SessionPlan } from "../treatment-plan/treatmentPlan.type";
import type { Result } from "@/models/result.type";

const method = ENDPOINTS.SESSIONPLAN
const baseService = createCatalogService<SessionPlan>(method);

export const SessionPlanService =  {
    ...baseService,

    post: async (requestSessionPlan: RequestSessionPlanMaster): Promise<Result<SessionPlan>> => {
        const { data } = await api.post(`${method}`, requestSessionPlan);
        return data;
    },
    put: async (id: number, requestSessionPlan: RequestSessionPlanMaster): Promise<Result<SessionPlan>> => {
        const { data } = await api.put(`${method}/${id}`, requestSessionPlan);
        return data;
    }
}