import type { SessionPlan, TreatmentPlan, TreatmentPlanItem } from "@/services/treatment-plan/treatmentPlan.type";
import type { SessionPlanFormValues } from "../schemas/session-plan.schema";
import dayjs from "dayjs";

export const TOTAL_STEPS = 4;

export const buildUpdatedPlan = (
    plan: SessionPlanFormValues["plan"],
    items: SessionPlanFormValues["items"],
    session: SessionPlanFormValues["session"],
    incomingPlan: TreatmentPlan
): SessionPlan => {
    let currentPlan: SessionPlan = {
        id: plan.id,
        sessionId: session.id,
        name: plan.name,
        status: plan.status,
        startDate: plan.startDate,
        endDate: plan.endDate!,
        currencyId: plan.currencyId,
        totalEstimatedPrice: plan.totalEstimatedPrice,
        comments: plan.comments,
        items: items,
    };

    const isFirstPlan =
        !currentPlan.name.trim();

    return {
        ...currentPlan,

        name: isFirstPlan
            ? incomingPlan.title
            : `${currentPlan.name} | ${incomingPlan.title}`,

        endDate: dayjs(currentPlan.startDate)
            .add(
                incomingPlan.estimatedDurationMonths,
                "month"
            )
            .toISOString(),

        totalEstimatedPrice:
            currentPlan.totalEstimatedPrice +
            incomingPlan.basePrice,

        currencyId:
            currentPlan.currencyId ||
            incomingPlan.currencyId
    };
};

export const normalizeTreatmentItems = (
    items: TreatmentPlanItem[]
) =>
    items.map(item => ({
        ...item,
        status: "Pendiente",
    })
);

export const STEPS = {
    1: {
        fields: [
            "session.date",
            "session.consultationSpecialtyId",
            "session.doctorId",
            "session.consultationTypeId",
            "session.reasonForVisit",
            "session.clinicalNotes",
        ]
    },
    //2: { fields: [] },
    2: {
        fields: [
            "items"
        ]
    },
    3: {
        fields: [
            "financing.paymentTermId",
            "financing.downPayment"
        ]
    }
} as const;