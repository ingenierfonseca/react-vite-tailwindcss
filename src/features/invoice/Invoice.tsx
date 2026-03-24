import { useState } from "react";
import Modal from "../../components/commons/Modal";
import PageList from "../../components/commons/PageList";
import { cn, theme } from "../../utils/theme";
import { useInvoice } from "./invoice.hooks";

const headers = [
    '#',
    'invoice number',
    'patient name',
    'subtotal',
    'tax',
    'total',
    'date',
    'status',
    'action'
]

interface PageListProps {

}

interface Invoice {
    id: number,
    invoiceNumber: string,
    patientName: string,
    subtotal: number,
    tax: string,
    total: number,
    date: string,
    status: string,
    notes: string
}

interface InvoiceDetail {

}

interface DataPage {
    currentPage: number,
    totalPages: number,
    totalItems: number,
    data: Invoice[]
}

const data: DataPage = {
    currentPage: 1,
    totalItems: 3,
    totalPages: 1,
    data: [
        {
            id: 1,
            invoiceNumber: "56754",
            patientName: "John Doe",
            subtotal: 3000,
            tax: "Cardiology",
            total: 3500,
            date: "2024-07-01",
            status: "Completed",
            notes: ""
        }
    ]
}

export default function Invoice() {
    const [isModalOpen, setIsModalOpen] = useState(false)
    const {saveInvoice, invoice, setInvoice} = useInvoice()
    return (
        <>
            <PageList headers={headers} data={data} setIsModalOpen={()=> setIsModalOpen(!isModalOpen)} />
            <Modal isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title="Información de la Factura"
                textBtnConfirm="Guardar"
                clickBtnConfirm={()=> saveInvoice}>
                <div className="space-y-4">
                    <p className="text-slate-500 dark:text-slate-400 text-sm">
                        Completa los datos de la factura
                    </p>
                    <div className="flex gap-8">
                        <div className="flex flex-col flex-1">
                            <p className="font-bold p-1">Seleccione un paciente</p>
                            <select className={`${cn(theme.dropdown.content)} ${cn(theme.dropdown.item)}`}>
                                <option value="1">Marlon Fonseca</option>
                            </select>
                        </div>
                        <div className="flex flex-col flex-1">
                            <p className="font-bold p-1">Seleccione un tratamiento</p>
                            <select className={`${cn(theme.dropdown.content)} ${cn(theme.dropdown.item)}`}>
                                <option value="1">Extraccion</option>
                            </select>
                        </div>
                    </div>
                    <div className="flex gap-8">
                        <div className="flex-1">
                            <p>SubTotal</p>
                            <input
                                type="text"
                                placeholder="Nombre del paciente"
                                className="w-full p-1 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 outline-none focus:ring-2 focus:ring-indigo-500"
                            />
                        </div>
                        <div className="flex-1">
                            <p>Tax</p>
                            <input
                                type="text"
                                placeholder="Nombre del paciente"
                                className="w-full p-1 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 outline-none focus:ring-2 focus:ring-indigo-500"
                            />
                        </div>
                    </div>
                </div>
            </Modal>
        </>
    )
}