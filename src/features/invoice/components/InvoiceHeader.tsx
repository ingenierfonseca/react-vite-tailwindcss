import DropDownApp from "../../../components/commons/DropDownApp";
import type { DropDownAppModel } from "../../../models/dropdownapp.type";
import CalendarApp from "../../../components/commons/CalendarApp";
import InputTextApp from "../../../components/commons/ImputTextApp";

const customers:DropDownAppModel[] = [
    {
        id: 1,
        value: 'Sharon Umanya'
    }
]
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
export default function InvoiceHeader() {
    return (
        <div className="px-4 py-3">
            <p className="text-black text-xl font-bold px-2">
                Nueva Factura
            </p>
            <div className="w-full h-0.5 bg-slate-200 mt-2" />
            <div className="flex gap-8 mt-4">
                <DropDownApp title="Paciente" data={customers} />
                <DropDownApp title="Terminos de Pago" data={paymentTerns} />
            </div>
            <div className="flex gap-8 mt-4">
                <CalendarApp title="Fecha de Emision" />
                <InputTextApp title="Numero de Factura" placeholder="" />
                <DropDownApp title="Moneda" data={moneys} />
            </div>
            <div className="flex gap-8 mt-4">
                <DropDownApp title="Metodo de Pago" data={paymentMethos} />
                <CalendarApp title="Vencimiento" />
            </div>
        </div>
    )
}