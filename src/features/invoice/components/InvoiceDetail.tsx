import { Plus } from "lucide-react";
import { cn, theme } from "../../../utils/theme";
import InvoiceHeader from "./InvoiceHeader";
import { useInvoiceDetail } from "../hooks/useInvoiceDetail";
import { formatNumber } from "../../../utils/number.util";
import ButtonSaveApp from "../../../components/commons/ButtonSaveApp";
import PageRightComponent from "../../../components/commons/PageRightComponent";
import ThreatmentModal from "./ThreatmentModal";
import { useState } from "react";

const headers = [
    "Tratamiento",
    "Cantidad",
    "Precio",
    "Descuento",
    "Total"
]

interface InvoiceDetailProps {
    setIsOpen: (value: boolean) => void
}
export default function InvoiceDetail({ setIsOpen }: InvoiceDetailProps) {
    const [isOpenModal, setIsOpenModal] = useState(false)
    const { 
        invoice,
        itemInvoice,
        loading,
        resetItemInvoice,
        onChangeItemInvoice,
        handleAddNewItem,
        calculateLineTotal,
        calculateTotal,
        saveInvoice,
        updateField
    } = useInvoiceDetail()

    return (
        <PageRightComponent
                    title="Nueva Factura"
                    onClick={() => setIsOpen(false)}
                >
            <InvoiceHeader 
                invoice={invoice} 
                updateField={updateField} 
                disabled={loading}
            />
            <div className="h-0.5 bg-slate-200 mt-3 mb-3 dark:bg-slate-600" />
            <div className="flex flex-col px-4 py-3">
                <p className="font-bold text-md dark:text-slate-100">Detalle de la Factura</p>
                <div className="flex flex-col md:flex-row mt-2">
                    <div className="flex-1 flex-col">
                        <div className="flex flex-1 p-2 gap-2 bg-slate-200 text-black/50 dark:bg-slate-800 dark:text-white">
                            {headers.map((header, index) => {
                                return <span key={index} className={`${index === 0 ? 'flex-2' : index === 3 ? 'flex-1 hidden md:block' :'flex-1'} px-2 text-sm`}>{header}</span>
                            })}
                        </div>
                        {invoice && invoice!.items.map((item, index) => {
                            return (
                                <div key={index} className="flex">
                                    <span className="flex-2">{item.description}</span>
                                    <span className="flex-1">{item.quantity}</span>
                                    <span className="flex-1">{item.unitPrice}</span>
                                    <span className="flex-1 hidden md:block">{item.discount}</span>
                                    <span className="flex-1">{calculateLineTotal(item)}</span>
                                </div>
                            )
                        })}
                        <button onClick={() => {
                            resetItemInvoice()
                            setIsOpenModal(true)
                        }}
                            disabled={loading}
                            className={`mt-2 mb-4 flex disabled:opacity-50 ${cn(theme.button.base)} bg-slate-200 dark:bg-slate-800 dark:border-slate-500 dark:text-white dark:hover:bg-slate-700`}>
                            <Plus />
                            Agregar Tratamiento
                        </button>
                    </div>
                    <div className="md:w-70 h-fit border border-slate-200 bg-slate-100 ml-2 text-sm dark:bg-slate-800 dark:border-slate-700 dark:text-white">
                        <div className="border-b-2 border-slate-200 dark:border-slate-600 flex justify-between p-2.5"><span>SubTotal</span><span>{invoice !== null ? calculateTotal() : "0.00"}</span></div>
                        <div className="border-b-2 border-slate-200 dark:border-slate-600 flex justify-between p-2.5"><span>IVA (0%)</span><span>{invoice !== null ? formatNumber(invoice?.taxTotal) : "0.00"}</span></div>
                        <div className="flex justify-between p-2.5"><span>Total</span><span className="font-bold">{invoice !== null ? calculateTotal() : "0.00"}</span></div>
                    </div>
                </div>
            </div>
            <div className="flex justify-end px-4 gap-1 pb-3">
                <button className={`disabled:opacity-50 ${cn(theme.button.base)} h-10 dark:bg-slate-700/50 dark:border-slate-600 dark:text-white dark:hover:bg-slate-700 mt-4`}
                    disabled={loading}
                    onClick={() => setIsOpen(false)}>
                    Cancelar
                </button>
                <ButtonSaveApp label="Factura" onClick={saveInvoice} loading={loading} />
            </div>
            <ThreatmentModal 
                isModalOpen={isOpenModal}
                setIsModalOpen={setIsOpenModal}
                onClick={() => {
                    handleAddNewItem()
                    setIsOpenModal(false)
                }}
                onChangeItem={onChangeItemInvoice}
                invoiceItem={itemInvoice} />
        </PageRightComponent>
    )
}