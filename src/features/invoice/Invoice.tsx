import { useState } from "react";
import Modal from "../../components/commons/Modal";
import PageList from "../../components/commons/PageList";
import { cn, theme } from "../../utils/theme";
import { useInvoice } from "./invoice.hooks";
import { useNavigate } from "react-router";

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

export default function Invoice() {
    const navigate = useNavigate();
    const [isModalOpen, setIsModalOpen] = useState(false)
    const {saveInvoice, invoice, setInvoice, data} = useInvoice()
    return (
        <>
        {data && 
            <PageList headers={headers} data={data} setIsModalOpen={()=> navigate(`/invoice/0/detail`)} />
        }
            
            <Modal isOpen={isModalOpen}
                onClose={() => navigate(`/invoice/0/detail`)}
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