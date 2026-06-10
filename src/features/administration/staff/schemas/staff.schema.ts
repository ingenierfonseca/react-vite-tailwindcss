import { validateBirthDate } from "@/utils/date.util";
import { z } from "zod";

export const staffSchema = z.object({
  id: z.number(),
  firstName: z.string().min(1, "El nombre es requerido"),
  lastName: z.string().min(1, "El apellido es requerido"),
  gender: z.string().min(1, "El género es requerido"),
  birthDate: z.string().optional().or(z.literal(""))
    .superRefine((val, ctx) => zodDateValidation(val, ctx)),
  email: z.string().optional(),
  phone: z.string().optional(),
  address: z.string().optional(),
  avatar: z.string().optional(),
});

export type StaffFormValues = z.infer<typeof staffSchema>;

const zodDateValidation = (val: string | undefined, ctx: z.core.$RefinementCtx<string | undefined>) => {
  if (!val) return;

  const date = new Date(val);
  if (isNaN(date.getTime())) {
    ctx.addIssue({
      code: "custom",
      message: "La fecha de nacimiento no tiene un formato válido.",
    });
    return;
  }

  const result = validateBirthDate(date);

  if (!result.isValid) {
    ctx.addIssue({
      code: "custom",
      message: result.message,
    });
  }
}
