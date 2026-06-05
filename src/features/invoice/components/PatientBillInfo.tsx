import { useEffect } from "react"
import AvatarInfo from "../../../components/commons/AvatarInfo"
import PageRightComponent from "../../../components/commons/PageRightComponent"
import type { CustomerInvoiceDTO } from "../../../services/invoice/customerinvoice.dto.type"
import { usePatientBill } from "../hooks/patientBill.hook"
import PaymentModal from "./PaymentModal"
import { formatDateToMMDameDDYYYY } from "../../../utils/date.util"
import { CircularProgress } from "@mui/material"
import { Download, EllipsisVertical, Printer, Receipt, Share2 } from "lucide-react"
import TickectModal from "./TicketModal"
import InvoicePrintModal from "./InvoicePrint"
import { PDFViewer } from '@react-pdf/renderer';
import InvoicePDF from "./InvoicePDF"
import ModalInvoice from "../../../components/commons/ModalInvoice"
import { ASSETS_URLS } from "../../../config/constants"

interface PatientBillInfoProps {
    customer: CustomerInvoiceDTO | null
    setIsOpen: (value: boolean) => void
    reload: () => void,
    openInvoiceDetail: (id: string) => void
}

const datosEjemplo = {
    clienteNombre: "Juan Pérez",
    clienteId: "12345678-K",
    numeroFactura: "2026-001",
    items: [
        { descripcion: "Limpieza Dental Pro", cantidad: 1, precioUnitario: 45.00 },
        { descripcion: "Resina Simple", cantidad: 2, precioUnitario: 35.00 }
    ]
};

export default function PatientBillInfo({ customer, setIsOpen, reload, openInvoiceDetail }: PatientBillInfoProps) {
    const {
        setCustomer,
        invoiceData,
        paymentHistoryData,
        setReload,
        loading,
        openPopUp,
        openPopUpPayment,
        isOpenModal,
        isOpenTicket,
        isOpenInvoicePDF,
        paymentId,
        setOpenPopUp,
        setOpenPopUpPayment,
        setIsOpenModal,
        setIsOpenTicket,
        setIsOpenInvoicePDF,
        setPaymentId
    } = usePatientBill()

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
                avatar={`${ASSETS_URLS.avatars}/${customer!.avatar}`}
                name={customer?.fullName || ""}
                title={`Edad: ${customer?.age} . Ultima Visita: ${customer?.lastVisit ? formatDateToMMDameDDYYYY(customer.lastVisit) : 'No ha realizado visitas'}`}
                onClick={() => { }}
            />
            <div className="w-full h-0.5 bg-slate-700 mb-12" />

            <p className="text-xl md:text-2xl font-semibold text-black dark:text-slate-200">Lista de Facturas</p>
            {!loading && invoiceData && invoiceData.map((invoice) => (
                <div key={invoice.id} className="flex justify-between items-center mt-4 p-4 bg-white dark:bg-slate-800 border-b-2 dark:border-slate-700">
                    <div>
                        <p className="font-bold text-lg text-black dark:text-slate-200">{invoice.number}</p>
                        <p className="text-sm text-slate-600 dark:text-slate-400">{formatDateToMMDameDDYYYY(invoice.dueDate)}</p>
                    </div>
                    <div className="flex gap-3 relative">
                        <div>
                            <p className="text-right font-semibold text-lg text-black dark:text-slate-200">${invoice.total.toFixed(2)}</p>
                            <p className={`text-right text-md px-2 font-semibold rounded-md bg-emerald-300/20 ${invoice.statusId === 2 ? "text-emerald-500" : "text-amber-500"}`}>
                                {invoice.status}
                            </p>
                        </div>
                        <div className="flex-1 flex justify-end items-center">
                            <div className="p-1 hover:bg-slate-200 dark:hover:bg-slate-700 dark:text-slate-200 rounded-full transition-colors" onClick={() => setOpenPopUp(`inv-${invoice.id}`)}><EllipsisVertical /></div>
                        </div>
                        {openPopUp === `inv-${invoice.id}` && (
                            <div className="absolute flex flex-col w-fit right-0 mt-2 mr-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-900 rounded-lg shadow-lg z-50" onMouseLeave={() => setOpenPopUp('')}>
                                <TooltipButton
                                    text="Ver Factura"
                                    icon={<Receipt />}
                                    onClick={() => openInvoiceDetail(invoice.id.toString())}
                                />
                                <TooltipButton
                                    text="Imprimir Factura"
                                    icon={<Printer />}
                                    onClick={() => setIsOpenInvoicePDF(true)}
                                />
                            </div>
                        )}
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
                    <div className="flex gap-3 relative">
                        <div>
                            <p className="text-right font-semibold text-lg text-black dark:text-slate-200">{formatDateToMMDameDDYYYY(payment.date)}</p>
                            <p className="text-right font-semibold text-lg text-slate-600 dark:text-slate-400">{payment.invoiceNumber}</p>
                        </div>
                        <div className="flex-1 flex justify-end items-center">
                            <div className="p-1 hover:bg-slate-200 dark:hover:bg-slate-700 dark:text-slate-200 rounded-full transition-colors" onClick={() => setOpenPopUpPayment(`pay-${payment.id}`)}><EllipsisVertical /></div>
                        </div>
                        {openPopUpPayment === `pay-${payment.id}` && (
                            <div className="absolute flex flex-col right-0 mt-2 mr-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-900 rounded-lg shadow-lg z-50" onMouseLeave={() => setOpenPopUpPayment('')}>
                                <TooltipButton
                                    text="Ver Pago"
                                    icon={<Receipt />}
                                    onClick={() => {
                                        setPaymentId(payment.id)
                                        setIsOpenModal(true)
                                    }}
                                />
                                <TooltipButton
                                    text="Imprimir Pago"
                                    icon={<Printer />}
                                    onClick={() => {
                                        setPaymentId(payment.id)
                                        setIsOpenTicket(true)
                                    }}
                                />
                                <TooltipButton
                                    text="Descargar Pago"
                                    icon={<Download />}
                                    onClick={() => {}}
                                />
                                <TooltipButton
                                    text="Compartir"
                                    icon={<Share2 />}
                                    onClick={() => {}}
                                />
                            </div>
                        )}
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
                    <button className="flex-1 px-4 py-2 bg-primary text-white rounded-md hover:bg-blue-600" 
                        onClick={() => {
                            setPaymentId(0)
                            setIsOpenModal(true)
                        }} 
                        disabled={customer?.balance === 0}>
                        Agregar Pago
                    </button>
                </div>
            </div>

            <PaymentModal id={paymentId} customer={customer!} isModalOpen={isOpenModal} setIsModalOpen={setIsOpenModal} onClick={() => { setReload((prev) => prev + 1); reload() }} />
            <TickectModal id={paymentId} isOpen={isOpenTicket} onClose={() => setIsOpenTicket(false)} title={"Baucher"} textBtnConfirm={"Imprimir"} clickBtnConfirm={() => { }} />
            <InvoicePrintModal isOpen={false} onClose={() => setIsOpenTicket(false)} title={"Baucher"} textBtnConfirm={"Imprimir"} clickBtnConfirm={() => { }} />
            <ModalInvoice isOpen={isOpenInvoicePDF} onClose={() => setIsOpenInvoicePDF(false)} title={"Factura"}>
                <PDFViewer width="100%" height="98%">
                    <InvoicePDF {...datosEjemplo} />
                </PDFViewer>
            </ModalInvoice>
        </PageRightComponent>
    )
}

interface TooltipButtonProps {
    text: string,
    onClick: () => void,
    icon?: React.ReactElement
}
function TooltipButton({text, icon, onClick}: TooltipButtonProps) {
    return (
        <button
            className="flex gap-2 text-left px-2 py-1 hover:bg-slate-100 dark:hover:bg-slate-800 dark:text-slate-200"
            onClick={onClick}
        >
            {icon}<span>{text}</span>
        </button>
    )
}