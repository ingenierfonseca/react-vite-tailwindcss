import type { SessionPlan, TreatmentPlanItem } from "@/services/treatment-plan/treatmentPlan.type";
import { formatNumber } from "@/utils/number.util";
import { Checkbox, FormControlLabel, TextField } from "@mui/material";
import dayjs from "dayjs";
import { Check } from "lucide-react";

interface ResumeTreatmentPlanProps {
    sessionPlan: SessionPlan
    items: TreatmentPlanItem[],
    isStartTreatmentPlan: boolean,
    setIsStartTreatmentPlan: (value: boolean) => void
}
export default function ResumeTreatmentPlan({ sessionPlan, items, isStartTreatmentPlan, setIsStartTreatmentPlan }: ResumeTreatmentPlanProps) {
    const durationInMonths =
        sessionPlan.startDate && sessionPlan.endDate
            ? Math.round(dayjs(sessionPlan.endDate).diff(dayjs(sessionPlan.startDate), "month", true))
            : 0;
    
    return (
        <div className="p-4 flex flex-col">
            <p className="text-2xl font-medium dark:text-slate-200">Resumen del plan</p>

            <div className="flex mt-3">
                <p className="flex-1 font-medium text-lg dark:text-slate-200">Tipo de tratamiento</p>
                <p className="flex-2 text-lg dark:text-slate-400">{sessionPlan?.name}</p>
            </div>
            <div className="flex">
                <p className="flex-1 font-medium text-lg dark:text-slate-200">Duración estimada</p>
                <p className="flex-2 text-lg dark:text-slate-400">{durationInMonths} {durationInMonths > 1 ? "meses" : "mes"}</p>
            </div>
            <div className="flex">
                <p className="flex-1 font-medium text-lg dark:text-slate-200">Precio estimado</p>
                <p className="flex-2 text-lg dark:text-slate-400">${formatNumber(sessionPlan?.totalEstimatedPrice)}</p>
            </div>
            <div className="flex">
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
                    value={sessionPlan.comments}
                    disabled={true}
                />
            </div>

            <FormControlLabel
                label={`Iniciar plan de tratamiento`}
                className="dark:text-slate-400"
                control={
                    <Checkbox
                        checked={isStartTreatmentPlan}
                        onChange={(e) => setIsStartTreatmentPlan(e.target.checked)}
                    />
                }
            />
            <p className="dark:text-slate-400">Si marca esta opcion podrá continuar e iniciar el plan de tratamiento</p>
        </div>
    )
}