import { z } from "zod";

export const sessionPlanSchema = z.object({
  session: z.object({
    id: z.number(),
    customerId: z.number().min(1, "Cliente requerido"),
    doctorId: z.number().min(1, "Médico requerido"),
    date: z.string(),
    reasonForVisit: z.string(),//.min(1, "El motivo de la visita es requerido"),
    clinicalNotes: z.string()//.min(1, "Las notas clínicas son requeridas"),
  }),

  plan: z.object({
    id: z.number(),
    name: z.string().min(1, "Nombre requerido"),
    status: z.string(),
    startDate: z.string(),
    endDate: z.string().optional(),
    currencyId: z.number(),
    totalEstimatedPrice: z.number(),
    comments: z.string(),
  }),

  financing: z.object({
    paymentTermId: z.number().min(1, "Tiene que seleccionar un término de pago para continuar"),
    isFinanced: z.boolean(),
    downPayment: z.number(),
  }).refine(
    (data) => {
      if (data.isFinanced && data.downPayment <= 0) {
        return false;
      }
      return true;
    },
    {
      message: "Tiene que ingresar un monto para el pago inicial",
      path: ["downPayment"],
    }
  ),

  items: z.array(z.any()).min(1, "Tiene que agregar un plan de tratamiento para continuar"),
  plansIds: z.array(z.number()),
  currency: z.object({
    id: z.number(),
    symbol: z.string(),
    name: z.string(),
  }).optional(),
  paymentTerm: z.object({
    id: z.number(),
    name: z.string(),
  }).optional(),
});

export type SessionPlanFormValues = z.infer<typeof sessionPlanSchema>;