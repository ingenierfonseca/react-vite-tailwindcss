import { FileCheck, Trash2 } from "lucide-react";
import { cn, theme } from "../../../utils/theme";
import InvoiceHeader from "./InvoiceHeader";
import { useInvoiceDetail } from "../hooks/useInvoiceDetail";
import { formatNumber } from "../../../utils/number.util";
import ButtonSaveApp from "../../../components/commons/ButtonSaveApp";
import PageRightComponent from "../../../components/commons/PageRightComponent";
import ThreatmentModal from "./ThreatmentModal";
import { useEffect, useState } from "react";
import { InvoiceStatus } from "../state/state";
import { toast } from "react-toastify";
import { calculateLineTotal } from "../../../utils/invoice.util";
import AddTreatmentPlan from "./AddTreatmentPlan";

export interface Header {
    header: string
    className: string
}

const headers: Header[] = [
    {
        header: 'Tratamiento',
        className: 'flex-2'
    },
    {
        header: 'Cantidad',
        className: 'flex-1 hidden md:block'
    },
    {
        header: 'Precio',
        className: 'flex-1'
    },
    {
        header: 'Descuento',
        className: 'flex-1 hidden md:block'
    },
    {
        header: 'Total',
        className: 'flex-1'
    },
    {
        header: '',
        className: 'flex-1 text-right'
    }
]

interface InvoiceDetailProps {
    setIsOpen: (value: boolean) => void,
    reload: () => void
    idParam: string
}
export default function InvoiceDetail({ setIsOpen, reload, idParam }: InvoiceDetailProps) {
    const [isOpenModal, setIsOpenModal] = useState(false)
    const {
        invoice,
        itemInvoice,
        loading,
        resetItemInvoice,
        onChangeItemInvoice,
        handleAddNewItem,
        handleRemoveItem,
        calculateTotal,
        saveInvoice,
        updateField,
        setId,
        currency,
        setCurrency,
        recalculateItemsCurrency
    } = useInvoiceDetail()
    const disabled = invoice?.statusId !== InvoiceStatus.PENDING

    useEffect(() => {
        if (idParam !== "0" || idParam !== undefined) {
            setId(idParam)
        }
    }, [idParam])

    const handleSave = async () => {
        const response = await saveInvoice()
        if (response) {
            reload()
        }
    }

    useEffect(() => {
        console.log("Cambio de moneda")
        if (invoice?.items && invoice.items.length > 0) {
            console.log("Hay items")
            const updateCurrency = async () => {
                try {
                    // Opcional: setLoader(true)
                    await recalculateItemsCurrency(invoice.currencyId);
                } catch (error) {
                    console.error("Error al recalcular precios:", error);
                    // Aquí podrías revertir el cambio de moneda o mostrar una alerta
                } finally {
                    // Opcional: setLoader(false)
                }
            };

            updateCurrency();
        }
    }, [invoice?.currencyId]);

    return (
        <PageRightComponent
            title={invoice?.id !== 0 ? !disabled ? "Editar Factura" : "Informacion de Factura" : "Nueva Factura"}
            onClick={() => setIsOpen(false)}
        >
            <InvoiceHeader
                invoice={invoice}
                updateField={updateField}
                disabled={disabled || loading}
                setCurrency={(item) => setCurrency(item)}
            />
            <div className="h-0.5 bg-slate-200 mt-3 mb-3 dark:bg-slate-600" />
            <div className="flex flex-col px-4 py-3">
                <p className="font-bold text-md dark:text-slate-100">Detalle de la Factura</p>
                <div className="flex flex-col lg:flex-row mt-2">
                    <div className="flex-1 flex-col">
                        <div className="flex p-2 text-sm font-semibold rounded-lg bg-slate-100 text-black/50 dark:bg-slate-700/30 dark:text-white">
                            {headers.map((header) => (
                                <span key={header.header} className={header.className}>{header.header}</span>
                            ))}
                        </div>
                        {invoice && invoice!.items.map((item, index) => {
                            return (
                                <div key={index} className="flex px-2 my-1 items-center text-sm">
                                    <span className="flex-2">{item.description}</span>
                                    <span className="flex-1 hidden md:block">{item.quantity}</span>
                                    <span className="flex-1">{currency?.symbol}{item.unitPrice.toFixed(2)}</span>
                                    <span className="flex-1 hidden md:block">{item.discount}</span>
                                    <span className="flex-1">{currency?.symbol}{calculateLineTotal(item)}</span>
                                    <span className="flex-1 text-right">
                                        <button className="cursor-pointer w-fit p-2 border dark:border-slate-600 dark:hover:bg-slate-700" onClick={() => handleRemoveItem(index)} disabled={disabled}>
                                            <Trash2 size={18} />
                                        </button>
                                    </span>
                                </div>
                            )
                        })}
                        <AddTreatmentPlan
                            disabled={disabled || loading}
                            onClick={() => {
                                if (invoice?.currencyId == 0) {
                                    toast.error("Seleccione una moneda antes de continuar")
                                    return
                                }
                                resetItemInvoice()
                                setIsOpenModal(true)
                            }}
                        />
                    </div>
                    <div className="lg:w-50 h-fit border border-slate-200 bg-slate-50 ml-2 text-sm dark:bg-slate-900 dark:border-slate-700 dark:text-slate-400">
                        <div className="border-b-2 border-slate-200 dark:border-slate-600 flex justify-between p-2.5"><span>SubTotal</span><span>{currency?.symbol}{invoice !== null ? calculateTotal() : "0.00"}</span></div>
                        <div className="border-b-2 border-slate-200 dark:border-slate-600 flex justify-between p-2.5"><span>IVA (0%)</span><span>{currency?.symbol}{invoice !== null ? formatNumber(invoice?.taxTotal) : "0.00"}</span></div>
                        <div className="flex justify-between p-2.5 bg-primary/5"><span className="text-primary font-semibold">Total</span><span className="text-primary font-semibold">{currency?.symbol}{invoice !== null ? calculateTotal() : "0.00"}</span></div>
                    </div>
                </div>
            </div>
            <div className="flex justify-end px-4 gap-1 pb-3">
                <button className={`disabled:opacity-50 ${cn(theme.button.base)} rounded-sm dark:bg-slate-700/50 dark:border-slate-600 dark:text-white dark:hover:bg-slate-700 mt-4 text-sm font-medium`}
                    disabled={loading}
                    onClick={() => setIsOpen(false)}>
                    Cancelar
                </button>
                <ButtonSaveApp
                    label="Factura"
                    onClick={handleSave}
                    loading={loading}
                    disabled={disabled}>
                    <FileCheck size={16} />
                </ButtonSaveApp>
            </div>
            <ThreatmentModal
                isModalOpen={isOpenModal}
                setIsModalOpen={setIsOpenModal}
                onClick={() => {
                    handleAddNewItem()
                    setIsOpenModal(false)
                }}
                onChangeItem={onChangeItemInvoice}
                currency={currency}
                invoiceItem={itemInvoice} />
        </PageRightComponent>
    )
}