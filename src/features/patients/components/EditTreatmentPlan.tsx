import AddTreatmentPlan from "@/features/invoice/components/AddTreatmentPlan";
import type { SessionPlanFormValues } from "@/features/session-plan/schemas/session-plan.schema";
import { TextField } from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers";
import dayjs from "dayjs";
import { Controller, useFormContext } from "react-hook-form";

interface EditTreatmentPlanProps {
    setIsOpenModal: (value: boolean) => void
}
export default function EditTreatmentPlan({
    setIsOpenModal
}: EditTreatmentPlanProps) {

    const {
        watch,
        setValue,
        control,
    } = useFormContext<SessionPlanFormValues>();

    const plan = watch("plan");
    const items = watch("items");

    const maxLength = 300;
    return (
        <div className="p-4 flex flex-col space-y-6">
            <div>
                <p className="text-2xl font-medium dark:text-slate-200 mt-3">Plan de tratamiento propuesto</p>
                <p className="text-slate-600 dark:text-slate-400 mb-3">Selecciona el tipo de tratamiento y configura los detalles</p>
                <p className="text-lg mb-3 dark:text-slate-200 wrap-break-word">{plan?.name}</p>
            </div>
            <div className="grid grid-cols-[repeat(auto-fit,minmax(300px,1fr))] gap-4">
                <Controller
                    control={control}
                    name="plan.startDate"
                    render={({ field }) => (
                        <DatePicker
                            className="min-w-0"
                            label="Fecha de inicio"
                            value={plan?.startDate ? dayjs(plan.startDate) : null}
                            onChange={(val) => field.onChange(val ? val.toISOString() : "")}
                            disabled={true}
                        />
                    )}
                />

                <Controller
                    control={control}
                    name="plan.endDate"
                    render={({ field }) => (
                        <DatePicker
                            className="flex-1"
                            label="Fecha de fin"
                            value={plan?.endDate ? dayjs(plan.endDate) : null}
                            onChange={(val) => field.onChange(val ? val.toISOString() : "")}
                            disabled={true}
                        />
                    )}
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
                    value={plan.comments ?? ""}
                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => {
                        if (e.target.value.length <= maxLength) {
                            setValue("plan", { ...plan, comments: e.target.value })
                        }
                    }}
                    helperText={`${plan.comments.length}/${maxLength}`}
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