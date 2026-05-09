import AddTreatmentPlan from "@/features/invoice/components/AddTreatmentPlan";
import type { SessionPlan, TreatmentPlanItem } from "@/services/treatment-plan/treatmentPlan.type";
import { formatNumber } from "@/utils/number.util";
import { TextField } from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers";
import dayjs from "dayjs";

interface EditTreatmentPlanProps {
    sessionPlan: SessionPlan,
    items: TreatmentPlanItem[]
    setIsOpenModal: (value: boolean) => void
    updateSessionPlan: <K extends keyof SessionPlan>(
        key: K,
        value: SessionPlan[K]
    ) => void;
}
export default function EditTreatmentPlan({ sessionPlan, items, setIsOpenModal, updateSessionPlan }: EditTreatmentPlanProps) {
    const maxLength = 300;
    return (
        <div className="p-4 flex flex-col">
            <p className="text-2xl font-medium dark:text-slate-200 mt-3">Plan de tratamiento propuesto</p>
            <p className="text-slate-600 dark:text-slate-400 mb-3">Selecciona el tipo de tratamiento y configura los detalles</p>
            <p className="text-lg mb-3">{sessionPlan?.name}</p>
            <div className="flex gap-3">
                <DatePicker
                    className="flex-1"
                    label="Fecha de inicio"
                    value={sessionPlan?.startDate ? dayjs(sessionPlan.startDate) : null}
                    onChange={(val) => updateSessionPlan("startDate", val ? val.toISOString() : "")}
                />
                <DatePicker
                    className="flex-1"
                    label="Fecha de fin"
                    value={sessionPlan?.endDate ? dayjs(sessionPlan.endDate) : null}
                    onChange={(val) => updateSessionPlan("endDate", val ? val.toISOString() : "")}
                />
                <TextField
                    className="flex-1"
                    label="Precio estimado"
                    variant="outlined"
                    value={`${formatNumber(sessionPlan?.totalEstimatedPrice) ?? '0'}`}
                    slotProps={{
                        inputLabel: { shrink: true }
                    }}
                />
            </div>
            <div className="mt-3">
                {items.map((item) => (
                    <div key={item.id} className="text-lg dark:text-slate-400">{`${item.order} ${item.name}`}</div>
                ))}
            </div>

            <AddTreatmentPlan
                disabled={false}
                onClick={() => {
                    setIsOpenModal(true)
                }}
            />

            <div className="flex flex-col mb-3">
                <p className="text-2xl font-medium dark:text-slate-200">Notas del plan</p>
                <p className="text-lg dark:text-slate-400 mb-3">Observaciones adicionales sobre el plan de tratamiento</p>
                <TextField
                    id="outlined-multiline-flexible"
                    label="Notas del plan"
                    multiline
                    rows={4}
                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => {
                        if (e.target.value.length <= maxLength) {
                            updateSessionPlan("comments", e.target.value)
                        }
                    }}
                    helperText={`${sessionPlan.comments.length}/${maxLength}`}
                    slotProps={{
                        input: {
                            inputProps: {
                                maxLength: maxLength,
                            },
                        },
                    }}
                />
            </div>
        </div>
    )
}