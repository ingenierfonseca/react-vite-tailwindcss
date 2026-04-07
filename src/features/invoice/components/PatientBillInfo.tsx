import { useEffect } from "react"
import AvatarInfo from "../../../components/commons/AvatarInfo"
import PageRightComponent from "../../../components/commons/PageRightComponent"
import type { CustomerInvoiceDTO } from "../../../services/invoice/customerinvoice.dto.type"
import { usePatientBill } from "../hooks/patientBill.hook"

interface PatientBillInfoProps {
    customer: CustomerInvoiceDTO | null
    setIsOpen: (value: boolean) => void
}

export default function PatientBillInfo({ customer, setIsOpen }: PatientBillInfoProps) {
    const { setCustomer, invoiceData, paymentHistoryData } = usePatientBill()
    console.log("Payment History Data in PatientBillInfo:", paymentHistoryData);
    
    useEffect(() => {
        if (customer) {
            setCustomer(customer);
        }
    }, [customer, setCustomer]);
    
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
            {invoiceData && invoiceData.map((invoice) => (
                <div key={invoice.id} className="flex justify-between items-center mt-4 p-4 bg-white dark:bg-slate-800 border-b-2 border-slate-300">
                    <div>
                        <p className="font-bold text-lg text-black dark:text-slate-200">{invoice.number}</p>
                        <p className="text-sm text-slate-600 dark:text-slate-400">{invoice.dueDate}</p>
                    </div>
                    <div>
                        <p className="font-semibold text-lg text-black dark:text-slate-200">${invoice.total.toFixed(2)}</p>
                        <p className={`text-md px-2 font-semibold rounded-md bg-emerald-300/20 ${invoice.statusId === 2 ? "text-emerald-500" : "text-amber-500"}`}>
                            {invoice.status}
                        </p>
                    </div>
                </div>
            ))}

            <p className="text-2xl mt-28 font-semibold text-black dark:text-slate-200">Historial de Pago</p>
            {paymentHistoryData && paymentHistoryData.length > 0 && paymentHistoryData.map((payment) => (
                <div key={payment.id} className="flex justify-between items-center mt-4 p-4 bg-white dark:bg-slate-800 border-b-2 border-slate-300">
                    <div>
                        <p className="font-bold text-lg text-black dark:text-slate-200">C${payment.amount.toFixed(2)}</p>
                        <p className="text-sm text-slate-600 dark:text-slate-400">{payment.paymentMethodId}</p>
                    </div>
                    <div>
                        <p className="font-semibold text-lg text-black dark:text-slate-200">{payment.date}</p>
                        <p className="font-semibold text-lg text-slate-600 dark:text-slate-400">{payment.invoiceNumber}</p>
                    </div>
                </div>
            ))}
        </PageRightComponent>
    )
}