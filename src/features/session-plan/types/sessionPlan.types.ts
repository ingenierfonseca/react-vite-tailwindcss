import type { SessionPlanFormValues } from "@/features/session-plan/schemas/session-plan.schema";
import type { Customer } from "@/services/customer/customer.type";
import dayjs from "dayjs";

/*const upperJaw = [18, 17, 16, 15, 14, 13, 12, 11, 21, 22, 23, 24, 25, 26, 27, 28];
const lowerJaw = [48, 47, 46, 45, 44, 43, 42, 41, 31, 32, 33, 34, 35, 36, 37, 38];
const allTeeth = [...upperJaw, ...lowerJaw];

const defaultSurfaces = () => ({
  center: null,
  top: null,
  bottom: null,
  right: null,
  left: null,
});*/

export const createDefaultSessionPlanValues = (
    customer: Customer
): SessionPlanFormValues => ({
    session: {
        id: 0,
        customerId: customer.id,
        consultationSpecialtyId: 0,
        doctorId: 0,
        consultationTypeId: 0,
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

    /*odontogram: allTeeth.map((toothId) => ({
        toothId,
        surfaces: defaultSurfaces(),
    })),

    diseases: [],*/

    items: [],

    plansIds: []
});