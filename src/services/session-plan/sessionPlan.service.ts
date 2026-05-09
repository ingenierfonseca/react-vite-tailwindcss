import { ENDPOINTS } from "../../api/endpoints";
import { createCatalogService } from "../baseCatalogService";
import type { SessionPlan } from "../treatment-plan/treatmentPlan.type";

export const SessionPlanService = createCatalogService<SessionPlan>(ENDPOINTS.SESSIONPLAN);