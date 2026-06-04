import DropDownApp from "../../../components/commons/DropDownApp";
import type { Invoice } from "../../../services/invoice/invoice.types";
import { PaginatedAutocomplete } from "../../../components/pagination-data/PaginatedAutocomplete";
import { CustomerService } from "../../../services/customer/customer.service";
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';
import 'dayjs/locale/es';
import { TextField } from "@mui/material";
import { getInvoiceStatusOptions } from "../state/state";
import { PaymentTermService } from "../../../services/paymentTerm/paymentTerm.service";
import { useState } from "react";
import type { PaymentTerm } from "../../../services/paymentTerm/PaymentTerm.type";
import { addDays } from "../../../utils/date.util";
import { CurrencyService } from "../../../services/currency/currency.service";
import type { Currency } from "../../../models/currency.type";

interface InvoiceHeaderProps {
    invoice: Invoice | null,
    disabled: boolean
    updateField: (field: keyof Invoice, value: any) => void
    setCurrency: (currency: Currency) => void
}
export default function InvoiceHeader({ invoice, disabled, updateField, setCurrency }: InvoiceHeaderProps) {
    const [paymentTerm, setPaymentTerm] = useState<PaymentTerm | null>()

    return (
        <fieldset disabled={disabled} className="px-4 py-3">
            <div className="flex flex-col md:flex-row gap-8 mt-4">
                <PaginatedAutocomplete
                    label="Paciente"
                    value={invoice ? invoice.customerId : undefined}
                    onChange={(value) =>
                        updateField("customerId", value)
                    }
                    fetchData={CustomerService.get}
                    getValue={(item) => item.id}
                    getLabel={(item) => `${item.firstName.trim()} ${item.lastName.trim()}`}
                />
                <PaginatedAutocomplete
                    label="Terminos de Pago"
                    value={invoice ? invoice.paymentTermId : undefined}
                    onChange={(value, item) => {
                        setPaymentTerm(item)
                        updateField("paymentTermId", value)
                        updateField("dueDate", addDays(invoice?.issueDate!, item?.daysToDue!))
                    }}
                    fetchData={PaymentTermService.get}
                    getValue={(item) => item.id}
                    getLabel={(item) => item.name.trim()}
                />
            </div>
            <div className="flex flex-col md:flex-row gap-8 mt-6">
                <TextField
                    className="flex-1"
                    label="Numero de Factura"
                    variant="outlined"
                    value={invoice ? invoice.number : ''}
                    slotProps={{
                        inputLabel: { shrink: true }
                    }}
                    disabled={true}
                />
                <DatePicker
                    className="flex-1"
                    label="Fecha de Emision"
                    value={invoice?.issueDate ? dayjs(invoice.issueDate) : null}
                    onChange={(val) => {
                        updateField("issueDate", val)
                        if (val && paymentTerm?.daysToDue) {
                            const dueDate = val.add(paymentTerm?.daysToDue, "day");
                            updateField("dueDate", dueDate)
                        }
                    }}
                />
                <PaginatedAutocomplete
                    label="Moneda"
                    value={invoice ? invoice.currencyId : undefined}
                    onChange={(value, item) => {
                        setCurrency(item!)
                        updateField("currencyId", value)
                    }}
                    fetchData={CurrencyService.get}
                    getValue={(item) => item.id}
                    getLabel={(item) => `${item.symbol}-${item.name.trim()}`}
                />
            </div>
            <div className="flex flex-col md:flex-row gap-8 mt-4">
                <DatePicker
                    className="flex-1"
                    label="Vencimiento"
                    value={invoice?.dueDate ? dayjs(invoice.dueDate) : null}
                    disabled={true}
                />
                {invoice && invoice.number && <DropDownApp title="Estado"
                    data={getInvoiceStatusOptions()} value={invoice.statusId}
                    onChange={(value) => updateField("statusId", value)}
                    disabled={disabled}
                />}
            </div>
        </fieldset>
    )
}