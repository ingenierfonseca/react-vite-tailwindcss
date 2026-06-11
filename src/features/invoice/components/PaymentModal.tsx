import { toast } from "react-toastify";
import Modal from "../../../components/commons/Modal";
import NumberInputApp from "../../../components/commons/NumberInputApp";
import TextFieldApp from "../../../components/commons/TextFieldApp";
import type { Payment } from "../../../services/payment/payment.type";
import DropDownApp from "../../../components/commons/DropDownApp";
import type { CustomerInvoiceDTO } from "../../../services/invoice/customerinvoice.dto.type";
import { useQuickPayment } from "../hooks/quickPayment.hook";
import { useEffect, useState } from "react";
import type { InvoiceInfoDTO } from "../../../services/invoice/invoice.types";
import { formatNumber } from "../../../utils/number.util";
import { Download, Printer } from "lucide-react";
import { PaymentService } from "../../../services/payment/payment.service";
import { InvoiceStatus, PaymentTypes } from "../state/state";
import type { DropDownAppModel } from "@/models/dropdownapp.type";

const transactionTypes: DropDownAppModel[] = [
    { id: 1, value: "Abono" },
    { id: 2, value: "Pago de factura" }
]

const moneys: DropDownAppModel[] = [
    { id: 1, value: 'COR - Peso Nicaraguense' },
    { id: 2, value: 'USD - Dolares' }
]

interface PaymentModalProps {
    id: number
    customer: CustomerInvoiceDTO,
    isModalOpen: boolean,
    setIsModalOpen: (value: boolean) => void,
    setPaymentId: (value: number) => void
    onClick: () => void,
}

export default function PaymentModal({ id, customer, isModalOpen, setIsModalOpen, setPaymentId, onClick }: PaymentModalProps) {
    const { 
        invoiceData,
        invoice,
        payment,
        transactionId,
        onUpdateField,
        setCustomer,
        setPayment,
        setInvoice,
        setTransactionId,
        registerPayment
    } = useQuickPayment();
    const [disabled, setDisabled] = useState(id !== 0)

    useEffect(() => {
        if (id === 0) {
            setPayment({id: 0, amount: 0, currencyId: 0, customerId: customer.id, invoiceId: 0, paymentTypeId: 0})
            setDisabled(false)
            return
        }
        
        setDisabled(true)

        PaymentService.find(id).then(item => {
            setPayment(item)
        })
    }, [id]);

    useEffect(() => {
        if (customer) {
            setCustomer(customer);
        }
    }, [customer, setCustomer]);

    const resetFields = () => {
        onUpdateField("invoiceId", 0);
        onUpdateField("amount", 0);
        setInvoice(undefined);
    }

    return (
        <Modal isOpen={isModalOpen}
            onClose={() => {
                resetFields();
                setIsModalOpen(false);
            }}
            title="Información del Pago"
            disabled={disabled}
            textBtnConfirm="Agregar"
            clickBtnConfirm={async () => {
                if (validateFields(transactionId, payment, invoice!, customer)) {
                    const { success, paymentId, error: apiError } = await registerPayment();
                    if (!success) {
                        toast.error("Error al registrar el pago: " + (apiError?.message || "Error desconocido"));
                    } else {
                        onClick()
                        setPaymentId(paymentId!)
                        setDisabled(true)
                    }
                }
            }}
            foot={disabled ? Foot() : <div />}>
            <div className="space-y-4">
                <p className="text-slate-500 dark:text-slate-400 text-sm">
                    Completa los datos del pago
                </p>
                <fieldset className="grid p-2 gap-2 border border-slate-200 dark:border-slate-700">
                    <TextFieldApp label="Paciente" value={customer.fullName} className="md:flex-2 px-2 text-sm" disabled={true} onChange={() => { }} />

                    <DropDownApp
                        title="Tipo de transacción"
                        data={transactionTypes}
                        value={transactionId}
                        onChange={(val) => setTransactionId(Number(val))}
                        disabled={disabled} />

                    {transactionId === 2 && invoiceData && invoiceData.length > 0 && (
                        <DropDownApp
                            title="Factura"
                            data={invoiceData.filter(i => { return id !== 0 || (i.statusId === InvoiceStatus.PENDING || i.statusId === InvoiceStatus.OVERDUE || i.statusId === InvoiceStatus.PARTIAL) }).map((invoice) => ({ id: invoice.id, value: invoice.number }))}
                            value={payment.invoiceId}
                            onChange={(val) => {
                                const selectedInvoice = invoiceData.find((inv) => inv.id.toString() === val);
                                if (selectedInvoice) {
                                    setInvoice(selectedInvoice);
                                    onUpdateField("invoiceId", val);
                                }
                            }}
                            disabled={disabled} />
                    )}

                    {transactionId === 1 && (
                        <TextFieldApp label="Saldo Pendiente" value={`${customer.currency}${formatNumber(customer.balance)}`} className="md:flex-2 px-2 text-sm" disabled={true} onChange={() => { }} />
                    )}
                    {transactionId === 2 && invoice && (
                        <TextFieldApp label="Saldo Pendiente" value={`${invoice.currency}${formatNumber(invoice.pendingBalance)}`} className="md:flex-2 px-2 text-sm" disabled={true} onChange={() => { }} />
                    )}

                    <DropDownApp
                        title="Metodo de Pago"
                        data={PaymentTypes} value={payment.paymentTypeId}
                        onChange={(val) => onUpdateField("paymentTypeId", val)}
                        disabled={disabled} />

                    <DropDownApp
                        title="Moneda"
                        data={moneys} value={payment.currencyId}
                        onChange={(val) => onUpdateField("currencyId", Number(val))}
                        disabled={disabled} />

                    <NumberInputApp
                        title="Monto"
                        value={payment.amount}
                        className="md:flex-1 px-2 text-sm" min={1}
                        onChange={(val) => onUpdateField("amount", val)}
                        disabled={disabled}
                        shrink={true} />
                </fieldset>
            </div>
        </Modal>
    )
}

const validateFields = (transactionId: number, item: Payment, invoice: InvoiceInfoDTO, customer: CustomerInvoiceDTO) => {
    const { customerId, invoiceId, currencyId, amount, paymentTypeId } = item;
    if (customerId === undefined || customerId <= 0) {
        toast.error("El campo cliente es requerido");
        return false;
    }
    if (transactionId === 2 && (invoiceId === undefined || invoiceId <= 0)) {
        toast.error("El campo factura es requerido");
        return false;
    }
    if (paymentTypeId === undefined || paymentTypeId <= 0) {
        toast.error("El campo tipo de pago es requerido");
        return false;
    }
    if (currencyId === undefined || currencyId <= 0) {
        toast.error("El campo moneda es requerido");
        return false;
    }
    if (amount === undefined || amount <= 0) {
        toast.error("El campo monto debe ser mayor a 0");
        return false;
    }
    if (transactionId === 2 && amount > invoice.total) {
        toast.error("El monto excede al saldo pendiente de la factura");
        return false;
    }

    if (transactionId === 1 && amount > customer.balance) {
        toast.error("El monto excede al saldo pendiente de la factura");
        return false;
    }

    return true;
}

function Foot() {
    const className = "flex gap-3 px-4 py-2 text-sm font-semibold bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-300 dark:hover:bg-slate-700 rounded-xl transition-all"
    return (
        <div className="flex gap-3">
            <button
                className={className} >
                <Printer /><span>Imprimir</span>
            </button>
            <button
                className={className} >
                <Download /><span>Descargar</span>
            </button>
        </div>
    )
}