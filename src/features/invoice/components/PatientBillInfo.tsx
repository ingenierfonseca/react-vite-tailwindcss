import AvatarInfo from "../../../components/commons/AvatarInfo"
import PageRightComponent from "../../../components/commons/PageRightComponent"
import type { CustomerInvoiceDTO } from "../../../services/invoice/customerinvoice.dto.type"
import { usePatientBill } from "../hooks/patientBill.hook"

const invoiceData = [
    {
        id: 1,
        invoiceNumber: "INV-001",
        dueDate: "2024-01-15",
        amount: 150.00,
        status: "Pending"
    },
    {
        id: 2,
        invoiceNumber: "INV-002",
        dueDate: "2024-01-20",
        amount: 200.00,
        status: "Paid"
    }
]

const paymentHistoryData = [
    {
        id: 1,
        paymentDate: "2024-01-10",
        amount: 150.00,
        method: "Credit Card",
        invoiceNumber: "INV-001"
    },
    {
        id: 2,
        paymentDate: "2024-01-05",
        amount: 100.00,
        method: "Cash",
        invoiceNumber: "INV-003"
    }
]
interface PatientBillInfoProps {
    customer: CustomerInvoiceDTO | null
    setIsOpen: (value: boolean) => void
}
export default function PatientBillInfo({ customer, setIsOpen }: PatientBillInfoProps) {
    const { setCustomer } = usePatientBill()
    setCustomer(customer)
    return (
        <PageRightComponent
            title="Información de Pago del Paciente"
            onClick={() => setIsOpen(false)}
        >
            <AvatarInfo
                className={"mt-6"}
                avatar={customer?.avatar}
                name={customer?.fullName || ""}
                description={`Edad: ${customer?.age} . Ultima Visita: ${customer?.lastVisit ? customer.lastVisit : 'No ha realizado visitas'}`}
                onClick={() => {
                    //setCustomer(patient)
                    //openProfileBillInfo(true)
                }}
            />
            <div className="w-full h-0.5 bg-slate-700 mb-12"/>

            <p className="text-2xl font-semibold text-black dark:text-slate-200">Lista de Facturas</p>
            {invoiceData.map((invoice) => (
                <div key={invoice.id} className="flex justify-between items-center mt-4 p-4 bg-white dark:bg-slate-800 border-b-2 border-slate-300">
                    <div>
                        <p className="font-bold text-lg text-black dark:text-slate-200">{invoice.invoiceNumber}</p>
                        <p className="text-sm text-slate-600 dark:text-slate-400">{invoice.dueDate}</p>
                    </div>
                    <div>
                        <p className="font-semibold text-lg text-black dark:text-slate-200">${invoice.amount.toFixed(2)}</p>
                        <p className={`text-md px-2 font-semibold rounded-md bg-emerald-300/20 ${invoice.status === "Paid" ? "text-emerald-500" : "text-amber-500"}`}>
                            {invoice.status}
                        </p>
                    </div>
                </div>
            ))}

            <p className="text-2xl mt-28 font-semibold text-black dark:text-slate-200">Historial de Pago</p>
            {paymentHistoryData.map((payment) => (
                <div key={payment.id} className="flex justify-between items-center mt-4 p-4 bg-white dark:bg-slate-800 border-b-2 border-slate-300">
                    <div>
                        <p className="font-bold text-lg text-black dark:text-slate-200">C${payment.amount.toFixed(2)}</p>
                        <p className="text-sm text-slate-600 dark:text-slate-400">{payment.method}</p>
                    </div>
                    <div>
                        <p className="font-semibold text-lg text-black dark:text-slate-200">{payment.paymentDate}</p>
                        <p className="font-semibold text-lg text-slate-600 dark:text-slate-400">{payment.invoiceNumber}</p>
                    </div>
                </div>
            ))}
        </PageRightComponent>
    )
}