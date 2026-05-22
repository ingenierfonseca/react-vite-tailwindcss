import NumberInputApp from "@/components/commons/NumberInputApp";
import { PaginatedAutocomplete } from "@/components/pagination-data/PaginatedAutocomplete";
import AddTreatmentPlan from "@/features/invoice/components/AddTreatmentPlan";
import { CurrencyService } from "@/services/currency/currency.service";
import { PaymentTermService } from "@/services/paymentTerm/paymentTerm.service";
import type { PaymentTerm } from "@/services/paymentTerm/PaymentTerm.type";
import type { RequestSessionPlanMaster, SessionPlan, TreatmentPlanItem } from "@/services/treatment-plan/treatmentPlan.type";
import { formatNumber } from "@/utils/number.util";
import { Checkbox, FormControlLabel, TextField } from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers";
import dayjs from "dayjs";

interface EditTreatmentPlanProps {
    sessionPlan: SessionPlan,
    items: TreatmentPlanItem[],
    request: RequestSessionPlanMaster,
    setIsOpenModal: (value: boolean) => void
    setPaymentTerm: (paymentTerm: PaymentTerm) => void
    updateSessionPlan: <K extends keyof SessionPlan>(
        key: K,
        value: SessionPlan[K]
    ) => void;
    updateRequestField: <K extends keyof RequestSessionPlanMaster>(
        key: K,
        value: RequestSessionPlanMaster[K]
    ) => void;
}
export default function EditTreatmentPlan({ 
    sessionPlan, 
    items, 
    request, 
    setIsOpenModal,
    updateSessionPlan,
    updateRequestField, 
    setPaymentTerm 
}: EditTreatmentPlanProps) {
    const maxLength = 300;
    return (
        <div className="p-4 flex flex-col space-y-6">
            <div>
                <p className="text-2xl font-medium dark:text-slate-200 mt-3">Plan de tratamiento propuesto</p>
                <p className="text-slate-600 dark:text-slate-400 mb-3">Selecciona el tipo de tratamiento y configura los detalles</p>
                <p className="text-lg mb-3 dark:text-slate-200 wrap-break-word">{sessionPlan?.name}</p>
            </div>
            <div className="grid grid-cols-[repeat(auto-fit,minmax(300px,1fr))] gap-4">
                <DatePicker
                    className="min-w-0"
                    label="Fecha de inicio"
                    value={sessionPlan?.startDate ? dayjs(sessionPlan.startDate) : null}
                    onChange={(val) => updateSessionPlan("startDate", val ? val.toISOString() : "")}
                    disabled={true}
                />
                <DatePicker
                    className="flex-1"
                    label="Fecha de fin"
                    value={sessionPlan?.endDate ? dayjs(sessionPlan.endDate) : null}
                    onChange={(val) => updateSessionPlan("endDate", val ? val.toISOString() : "")}
                    disabled={true}
                />

                <PaginatedAutocomplete
                    label="Moneda"
                    value={sessionPlan?.currencyId}
                    onChange={(item) => {
                        console.log(item)
                    }}
                    fetchData={CurrencyService.get}
                    getValue={(item) => item.id}
                    getLabel={(item) => `${item.symbol}-${item.name.trim()}`}
                    disabled={true}
                />

                <TextField
                    className="flex-1"
                    label="Precio estimado"
                    variant="outlined"
                    value={`${sessionPlan?.currency?.symbol ?? ""} ${formatNumber(sessionPlan?.totalEstimatedPrice) ?? '0'}`}
                    slotProps={{
                        inputLabel: { shrink: true }
                    }}
                    disabled={true}
                />

                <PaginatedAutocomplete
                    label="Terminos de Pago"
                    value={request.paymentTermId}
                    onChange={(value, item) => {
                        updateRequestField("paymentTermId", value)
                        setPaymentTerm(item!)
                    }}
                    fetchData={PaymentTermService.get}
                    getValue={(item) => item.id}
                    getLabel={(item) => item.name.trim()}
                />

                <FormControlLabel
                    label="Requiere pago inicial"
                    className="dark:text-slate-400"
                    control={
                        <Checkbox className="dark:text-primary-dark!"
                            checked={request.isFinanced}
                            onChange={(e) => updateRequestField("isFinanced", e.target.checked)}
                        />
                    }
                />
                {request.isFinanced && (
                    <NumberInputApp
                        title="Monto del pago inicial"
                        value={request.downPayment}
                        onChange={(value) => updateRequestField("downPayment", value)}
                        shrink={true}
                    />
                )}
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
                    value={sessionPlan.comments ?? ""}
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