import { Card } from "@/components/ui/card";
import { Controller, useFormContext } from "react-hook-form";
import type { SessionPlanFormValues } from "../../schemas/session-plan.schema";
import NumberInputApp from "@/components/commons/NumberInputApp";
import { Checkbox, FormControlLabel, TextField } from "@mui/material";
import { PaginatedAutocomplete } from "@/components/pagination-data/PaginatedAutocomplete";
import { formatNumber } from "@/utils/number.util";
import { CurrencyService } from "@/services/currency/currency.service";
import { DatePicker } from "@mui/x-date-pickers";
import dayjs from "dayjs";
import { PaymentTermService } from "@/services/paymentTerm/paymentTerm.service";

export default function TreatmentPaymentPlanStep() {
    const {
            watch,
            setValue,
            control,
        } = useFormContext<SessionPlanFormValues>();
    
        const plan = watch("plan");
        //const items = watch("items");
        const financing = watch("financing");
        const currency = watch("currency");
    
        const maxLength = 300;
    return (
        <div className="w-full min-w-full shrink-0 basis-full p-1">
            <Card className="w-full">
                <div className="p-4 flex flex-col space-y-6">
                    <div>
                        <p className="text-2xl font-medium dark:text-slate-200 mt-3">Plan de pago</p>
                        <p className="text-slate-600 dark:text-slate-400 mb-3">Selecciona y configura los detalles</p>
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

                        <Controller
                            control={control}
                            name="plan.currencyId"
                            render={({ field }) => (
                                <PaginatedAutocomplete
                                    label="Moneda"
                                    value={plan?.currencyId}
                                    onChange={(item) => {
                                        field.onChange(item?.id)
                                    }}
                                    fetchData={CurrencyService.get}
                                    getValue={(item) => item.id}
                                    getLabel={(item) => `${item.symbol}-${item.name.trim()}`}
                                    disabled={true}
                                />
                            )}
                        />

                        <TextField
                            className="flex-1"
                            label="Precio estimado"
                            variant="outlined"
                            value={`${currency?.symbol ?? ""} ${formatNumber(plan?.totalEstimatedPrice) ?? '0'}`}
                            slotProps={{
                                inputLabel: { shrink: true }
                            }}
                            disabled={true}
                        />

                        <Controller
                            control={control}
                            name="financing.paymentTermId"
                            render={({ field }) => (
                                <PaginatedAutocomplete
                                    label="Terminos de Pago"
                                    value={financing.paymentTermId}
                                    onChange={(value, item) => {
                                        field.onChange(value)
                                        setValue("paymentTerm", item!)
                                    }}
                                    fetchData={PaymentTermService.get}
                                    getValue={(item) => item.id}
                                    getLabel={(item) => item.name.trim()}
                                />
                            )}
                        />

                        <Controller
                            control={control}
                            name="financing.isFinanced"
                            render={({ field }) => (
                                <FormControlLabel
                                    label="Requiere pago inicial"
                                    className="dark:text-slate-400"
                                    control={
                                        <Checkbox className="dark:text-primary-dark!"
                                            checked={financing.isFinanced}
                                            onChange={(e) => field.onChange(e.target.checked)}
                                        />
                                    }
                                />
                            )}
                        />

                        {financing.isFinanced && (
                            <Controller
                                control={control}
                                name="financing.downPayment"
                                render={({ field }) => (
                                    <NumberInputApp
                                        title="Monto del pago inicial"
                                        value={financing.downPayment}
                                        onChange={(value) => field.onChange(value)}
                                        shrink={true}
                                    />
                                )}
                            />
                        )}
                    </div>

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
            </Card>
        </div>
    )
}