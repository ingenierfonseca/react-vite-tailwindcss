import type { RequestSessionPlanMaster } from "@/services/treatment-plan/treatmentPlan.type";
import type { SessionPlanFormValues } from "../schemas/session-plan.schema";
import { ClinicalSessionService } from "@/services/clinical-session/clinicalSession.service";
import { SessionPlanService } from "@/services/session-plan/sessionPlan.service";
import type { SaveSessionPlanResult } from "../types/saveSessionPlanResult";

export const TotalSessionPlanService =  {
    async saveCompletePlan(values: SessionPlanFormValues): Promise<SaveSessionPlanResult> {
        let sessionId = values.session.id;

        if (!sessionId) {
            const sessionResult = await ClinicalSessionService.post_(values.session);
            sessionId = sessionResult.value.id;
        } else {
            await ClinicalSessionService.put(sessionId, values.session);
        }

        const request = buildRequest(values, sessionId);
        let planId = values.plan.id;

        if (planId) {
            await SessionPlanService.put(planId, request);
        } else {
            const planResult = await SessionPlanService.post(request);
            planId = planResult.value.id;
        }

        return { sessionId, planId };
    }
}

const buildRequest = (
    values: SessionPlanFormValues,
    sessionId: number
): RequestSessionPlanMaster => {
    return {
        sessionId,
        name: values.plan.name,
        status: values.plan.status,
        currencyId: values.plan.currencyId,
        paymentTermId: values.financing.paymentTermId,
        isFinanced: values.financing.isFinanced,
        downPayment: values.financing.downPayment,
        comments: values.plan.comments,
        plansIds: values.items.map((x: any) => x.id),
    };
};