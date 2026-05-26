import type { SessionPlanFormValues } from "@/features/session-plan/schemas/session-plan.schema";
import type { Customer } from "@/services/customer/customer.type";
import dayjs from "dayjs";

export const createDefaultSessionPlanValues = (
    customer: Customer
): SessionPlanFormValues => ({
    session: {
        id: 0,
        customerId: customer.id,
        doctorId: 1,
        date: dayjs().format("YYYY-MM-DD"),
        reasonForVisit: "",
        clinicalNotes: "",
    },

    plan: {
        id: 0,
        name: "",
        status: "Pendiente",
        startDate: dayjs().format("YYYY-MM-DD"),
        endDate: "",
        currencyId: 2,
        totalEstimatedPrice: 0,
        comments: "",
    },

    financing: {
        paymentTermId: 0,
        isFinanced: false,
        downPayment: 0,
    },

    items: [],

    plansIds: []
});