import type { SessionPlanFormValues } from "@/features/session-plan/schemas/session-plan.schema";
import { formatNumber } from "@/utils/number.util";
import { TextField } from "@mui/material";
import dayjs from "dayjs";
import { Check } from "lucide-react";
import { useFormContext } from "react-hook-form";

interface ResumeTreatmentPlanProps {
}
export default function ResumeTreatmentPlan({ }: ResumeTreatmentPlanProps) {
    const {
            watch
        } = useFormContext<SessionPlanFormValues>();
    
    const plan = watch("plan");
    const items = watch("items");
    const financing = watch("financing");
    const currency = watch("currency");
    const paymentTerm = watch("paymentTerm");

    const durationInMonths =
        plan.startDate && plan.endDate
            ? Math.round(dayjs(plan.endDate).diff(dayjs(plan.startDate), "month", true))
            : 0;
    
    return (
        <div className="p-4 flex flex-col">
            <p className="text-2xl font-medium dark:text-slate-200">Resumen del plan</p>

            <div className="flex mt-3 gap-4">
                <p className="flex-1 font-medium text-lg dark:text-slate-200">Tipo de tratamiento</p>
                <p className="flex-2 text-lg dark:text-slate-400">{plan.name}</p>
            </div>
            <div className="flex gap-4">
                <p className="flex-1 font-medium text-lg dark:text-slate-200">Duración estimada</p>
                <p className="flex-2 text-lg dark:text-slate-400">{durationInMonths} {durationInMonths > 1 ? "meses" : "mes"}</p>
            </div>
            <div className="flex gap-4">
                <p className="flex-1 font-medium text-lg dark:text-slate-200">Precio estimado</p>
                <p className="flex-2 text-lg dark:text-slate-400">${formatNumber(plan.totalEstimatedPrice)}</p>
            </div>
            <div className="flex gap-4">
                <p className="flex-1 font-medium text-lg dark:text-slate-200">Moneda</p>
                <p className="flex-2 text-lg dark:text-slate-400">{currency?.name}</p>
            </div>
            <div className="flex gap-4">
                <p className="flex-1 font-medium text-lg dark:text-slate-200">Requiere pago inicial</p>
                <p className="flex-2 text-lg dark:text-slate-400">{financing?.isFinanced ? "Sí" : "No"}</p>
            </div>
            {financing?.isFinanced && (
                <div className="flex gap-4">
                    <p className="flex-1 font-medium text-lg dark:text-slate-200">Monto del pago inicial</p>
                    <p className="flex-2 text-lg dark:text-slate-400">{currency?.symbol}{formatNumber(financing?.downPayment)}</p>
                </div>
            )}
            <div className="flex gap-4">
                <p className="flex-1 font-medium text-lg dark:text-slate-200">Termino de pago</p>
                <p className="flex-2 text-lg dark:text-slate-400">{paymentTerm?.name}</p>
            </div>
            <div className="flex gap-4">
                <p className="flex-1 font-medium text-lg dark:text-slate-200">Tratamientos</p>
                <div className="flex-2 flex flex-col">
                    {items.map((item) => (
                        <div key={item.id} className="flex gap-2 items-center text-lg dark:text-slate-400">
                            <div className={`w-fit rounded-full bg-green-400/10 text-green-600`}>
                                <Check />
                            </div>
                            {`${item.name}`}
                        </div>
                    ))}
                </div>
            </div>

            <div className="flex flex-col mt-6 mb-3">
                <p className="text-xl font-medium dark:text-slate-200">Notas del plan</p>
                <p className="text-lg dark:text-slate-400 mb-3">Observaciones adicionales sobre el plan de tratamiento</p>
                <TextField
                    id="outlined-multiline-flexible"
                    label="Notas del plan"
                    multiline
                    rows={4}
                    value={plan.comments}
                    disabled={true}
                />
            </div>
        </div>
    )
}