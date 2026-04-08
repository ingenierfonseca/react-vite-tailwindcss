import DropDownApp from "../../../components/commons/DropDownApp";
import type { DropDownAppModel } from "../../../models/dropdownapp.type";
import type { Invoice } from "../../../services/invoice/invoice.types";
import { PaginatedAutocomplete } from "../../../components/commons/PaginatedAutocomplete";
import { CustomerService } from "../../../services/customer/customer.service";
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';
import 'dayjs/locale/es';
import { TextField } from "@mui/material";
import { getInvoiceStatusOptions } from "../state/state";

const paymentTerns:DropDownAppModel[] = [
    {
        id: 1,
        value: '30 dias'
    },
    {
        id: 2,
        value: '15 dias'
    }
]
const moneys: DropDownAppModel[] = [
    {
        id: 1,
        value: 'COR - Peso Nicaraguense'
    },
    {
        id: 2,
        value: 'USD - Dolares'
    }
]

interface InvoiceHeaderProps {
    invoice: Invoice | null,
    disabled: boolean
    updateField: (field: keyof Invoice, value: any) => void
}
export default function InvoiceHeader({invoice, disabled, updateField}: InvoiceHeaderProps) {
    return (
        <fieldset disabled={disabled} className="px-4 py-3">
            <div className="flex flex-col md:flex-row gap-8 mt-4">
                <PaginatedAutocomplete
                    label="Paciente"
                    value={invoice ? invoice.customerId : undefined}
                    onChange={(value) =>
                        updateField("customerId", value)
                    }
                    fetchData={CustomerService.getAllCustomers}
                    getValue={(item) => item.id}
                    getLabel={(item) => `${item.firstName.trim()} ${item.lastName.trim()}`}
                />
                <DatePicker
                    className="flex-1"
                    label="Fecha de Emision"
                    value={invoice?.issueDate ? dayjs(invoice.issueDate) : null}
                    onChange={(val) => updateField("issueDate", val)}
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
                <DropDownApp 
                    title="Terminos de Pago" 
                    data={paymentTerns} 
                    value={1} 
                />
                <DropDownApp 
                    title="Moneda" 
                    data={moneys} value={invoice ? invoice.currencyId : 1}
                    onChange={(val) => updateField("currencyId", val)} />
            </div>
            <div className="flex flex-col md:flex-row gap-8 mt-4">
                <DatePicker
                    className="flex-1"
                    label="Vencimiento"
                    value={invoice?.dueDate ? dayjs(invoice.dueDate) : null}
                    onChange={(val) => updateField("dueDate", val)}
                />
                {invoice && invoice.number && <DropDownApp title="Estado" 
                    data={getInvoiceStatusOptions()} value={invoice.statusId}
                    onChange={(value) => updateField("statusId", value)}
                />}
            </div>
        </fieldset>
    )
}