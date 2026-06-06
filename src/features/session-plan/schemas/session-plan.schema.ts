import { z } from "zod";

const surfaceSchema = z.object({
  center: z.string().nullable(),
  top: z.string().nullable(),
  bottom: z.string().nullable(),
  right: z.string().nullable(),
  left: z.string().nullable(),
});

export const sessionPlanSchema = z.object({
  session: z.object({
    id: z.number(),
    customerId: z.number().min(1, "Cliente requerido"),
    doctorId: z.number().min(1, "Médico requerido"),
    specialtyId: z.number().min(1, "Especialidad requerida"),
    consultationTypeId: z.number().min(1, "Tipo de consulta requerido"),
    date: z.string(),
    reasonForVisit: z.string(),
    clinicalNotes: z.string(),
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

  odontogram: z.array(z.object({
    toothId: z.number(),
    surfaces: surfaceSchema,
  })),

  diseases: z.array(z.object({
    id: z.string(),
    name: z.string(),
  })),

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

export type SurfaceKey = 'center' | 'top' | 'bottom' | 'right' | 'left';
export type ToothSurfaces = Record<SurfaceKey, string | null>;
export type OdontogramEntry = { toothId: number; surfaces: ToothSurfaces };
export type DiseaseEntry = { id: string; name: string };