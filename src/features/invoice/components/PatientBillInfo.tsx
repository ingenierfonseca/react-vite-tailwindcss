import { useEffect, useState } from "react"
import AvatarInfo from "../../../components/commons/AvatarInfo"
import PageRightComponent from "../../../components/commons/PageRightComponent"
import type { CustomerInvoiceDTO } from "../../../services/invoice/customerinvoice.dto.type"
import { usePatientBill } from "../hooks/patientBill.hook"
import PaymentModal from "./PaymentModal"
import { formatDateToMMDameDDYYYY } from "../../../utils/date.util"
import { CircularProgress } from "@mui/material"

interface PatientBillInfoProps {
    customer: CustomerInvoiceDTO | null
    setIsOpen: (value: boolean) => void
}

export default function PatientBillInfo({ customer, setIsOpen }: PatientBillInfoProps) {
    const { setCustomer, invoiceData, paymentHistoryData, setReload, loading } = usePatientBill()
    const [isOpenModal, setIsOpenModal] = useState(false)
    
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
                onClick={() => {}}
            />
            <div className="w-full h-0.5 bg-slate-700 mb-12"/>

            <p className="text-xl md:text-2xl font-semibold text-black dark:text-slate-200">Lista de Facturas</p>
            {!loading &&invoiceData && invoiceData.map((invoice) => (
                <div key={invoice.id} className="flex justify-between items-center mt-4 p-4 bg-white dark:bg-slate-800 border-b-2 dark:border-slate-700">
                    <div>
                        <p className="font-bold text-lg text-black dark:text-slate-200">{invoice.number}</p>
                        <p className="text-sm text-slate-600 dark:text-slate-400">{formatDateToMMDameDDYYYY(invoice.dueDate)}</p>
                    </div>
                    <div>
                        <p className="font-semibold text-lg text-black dark:text-slate-200">${invoice.total.toFixed(2)}</p>
                        <p className={`text-md px-2 font-semibold rounded-md bg-emerald-300/20 ${invoice.statusId === 2 ? "text-emerald-500" : "text-amber-500"}`}>
                            {invoice.status}
                        </p>
                    </div>
                </div>
            ))}
            {loading && 
                <div className="flex flex-col justify-center items-center mt-4 p-4 bg-white dark:bg-slate-800 border-b-2 dark:border-slate-700">
                    <CircularProgress size={50} color="primary" />
                    <p className="text-slate-500 dark:text-slate-400">Cargando información...</p>
                </div>
            }

            <p className="text-xl md:text-2xl mt-28 font-semibold text-black dark:text-slate-200">Historial de Pago</p>
            {!loading && paymentHistoryData && paymentHistoryData.length > 0 && paymentHistoryData.map((payment) => (
                <div key={payment.id} className="flex justify-between items-center mt-4 p-4 bg-white dark:bg-slate-800 border-b-2 dark:border-slate-700">
                    <div>
                        <p className="font-bold text-lg text-black dark:text-slate-200">C${payment.amount.toFixed(2)}</p>
                        <p className="text-lg text-slate-600 dark:text-slate-400">{payment.paymentTypeName}</p>
                    </div>
                    <div>
                        <p className="font-semibold text-lg text-black dark:text-slate-200">{formatDateToMMDameDDYYYY(payment.date)}</p>
                        <p className="font-semibold text-lg text-slate-600 dark:text-slate-400">{payment.invoiceNumber}</p>
                    </div>
                </div>
            ))}
            {loading && 
                <div className="flex flex-col justify-center items-center mt-4 p-4 bg-white dark:bg-slate-800 border-b-2 dark:border-slate-700">
                    <CircularProgress size={50} color="primary" />
                    <p className="text-slate-500 dark:text-slate-400">Cargando información...</p>
                </div>
            }

            <div className="mt-28 rounded-md p-2 border dark:border-slate-300">
                <p className="font-semibold text-black dark:text-white">Acciones Rapidas</p>
                <div className="grid grid-cols-[repeat(auto-fit,minmax(300px,1fr))] gap-4 mt-4">
                    <button className="flex-1 px-4 py-2 bg-primary text-white rounded-md hover:bg-blue-600" onClick={()=> setIsOpenModal(true)} disabled={invoiceData?.filter(inv => inv.statusId === 1 || inv.statusId === 5).length === 0}>
                        Agregar Pago
                    </button>
                </div>
            </div>

            <PaymentModal customer={customer!} isModalOpen={isOpenModal} setIsModalOpen={setIsOpenModal} onClick={() => setReload((prev) => prev + 1)} />
        </PageRightComponent>
    )
}