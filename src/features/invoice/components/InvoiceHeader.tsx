import DropDownApp from "../../../components/commons/DropDownApp";
import type { DropDownAppModel } from "../../../models/dropdownapp.type";
import CalendarApp from "../../../components/commons/CalendarApp";
import InputTextApp from "../../../components/commons/ImputTextApp";
import type { Invoice } from "../../../services/invoice/invoice.types";
import { useCustomerAsyncHook } from "../../../hooks/useCustomerAsyncHook";
import AsyncDropdown from "../../../components/commons/AsyncDropdown";

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
const paymentMethos:DropDownAppModel[] = [
    {
        id: 1,
        value: 'Contado'
    },
    {
        id: 2,
        value: 'Transferencia'
    },
    {
        id: 3,
        value: 'Cuotas'
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
    const {
        options,
        search,
        setSearch,
        loading,
        hasMore,
        setPage,
        filteredOptions
    } = useCustomerAsyncHook();

    console.log("search", search)
    return (
        <fieldset disabled={disabled} className="px-4 py-3">
            <p className="text-black text-xl font-bold px-2">
                {invoice != null && invoice!.number !== '' ? "Factura " + invoice!.number : "Nueva Factura"}
            </p>
            <div className="w-full h-0.5 bg-slate-200 mt-2" />
            <div className="flex gap-8 mt-4">
                <AsyncDropdown
                    title="Paciente"
                    options={filteredOptions}
                    value={invoice?.customerId}
                    onSearch={setSearch}
                    onChange={(value) => updateField("customerId", value)}
                    loadMore={() => setPage(p => p + 1)}
                    hasMore={hasMore}
                />
                <DropDownApp title="Terminos de Pago" data={paymentTerns} />
            </div>
            <div className="flex gap-8 mt-4">
                <CalendarApp title="Fecha de Emision" value={invoice?.date ?? ''} onChange={(val) => updateField("date", val)} />
                <InputTextApp title="Numero de Factura" value={invoice ? invoice.number : ''} placeholder="" disabled={true} />
                <DropDownApp title="Moneda" data={moneys} />
            </div>
            <div className="flex gap-8 mt-4">
                <DropDownApp title="Metodo de Pago" data={paymentMethos} />
                <CalendarApp title="Vencimiento" value={invoice?.dueDate ?? ''} onChange={(val) => updateField("dueDate", val)} />
            </div>
        </fieldset>
    )
}