import { toast } from "react-toastify";
import Modal from "../../../components/commons/Modal";
import NumberInputApp from "../../../components/commons/NumberInputApp";
import TextFieldApp from "../../../components/commons/TextFieldApp";
import type { Payment } from "../../../services/payment/payment.type";
import DropDownApp from "../../../components/commons/DropDownApp";
import type { CustomerInvoiceDTO } from "../../../services/invoice/customerinvoice.dto.type";
import { useQuickPayment } from "../hooks/quickPayment.hook";
import { useEffect } from "react";
import type { InvoiceInfoDTO } from "../../../services/invoice/invoice.types";
import { formatNumber } from "../../../utils/number.util";

const paymentTypes = [
    { id: 1, value: "Efectivo" },
    { id: 2, value: "Tarjeta de Credito/Debito" },
    { id: 3, value: "Transferencia Bancaria" }
];

interface PaymentModalProps {
    customer: CustomerInvoiceDTO,
    isModalOpen: boolean,
    setIsModalOpen: (value: boolean) => void,
    onClick: () => void,
}

export default function PaymentModal({ customer, isModalOpen, setIsModalOpen, onClick }: PaymentModalProps) {
    const { invoiceData, invoice, payment, error, onUpdateField, setCustomer, setInvoice, registerPayment } = useQuickPayment();

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
            textBtnConfirm="Agregar"
            clickBtnConfirm={async () => {
                if (validateFields(payment, invoice!)) {
                    await registerPayment();
                    if (error) {
                        toast.error("Error al registrar el pago: " + error.message);
                    } else {
                        onClick()
                        setIsModalOpen(false)
                    }
                }
            }}>
            <div className="space-y-4">
                <p className="text-slate-500 dark:text-slate-400 text-sm">
                    Completa los datos del pago
                </p>
                <fieldset className="grid p-2 gap-2 border border-slate-200 dark:border-slate-700">
                    <TextFieldApp label="Paciente" value={customer.fullName} className="md:flex-2 px-2 text-sm" disabled={true} onChange={() => { }} />
                    {invoiceData && invoiceData.length > 0 && (
                        <DropDownApp
                            title="Factura"
                            data={invoiceData.map((invoice) => ({ id: invoice.id, value: invoice.number }))}
                            value={payment.invoiceId}
                            onChange={(val) => {
                                const selectedInvoice = invoiceData.find((inv) => inv.id.toString() === val);
                                if (selectedInvoice) {
                                    setInvoice(selectedInvoice);
                                    onUpdateField("invoiceId", val);
                                }
                            }}
                        />
                    )}
                    {invoice && (
                        <TextFieldApp label="Saldo Pendiente" value={`${invoice.currency}${formatNumber(invoice.total)}`} className="md:flex-2 px-2 text-sm" disabled={true} onChange={() => { }} />
                    )}
                    <DropDownApp
                        title="Metodo de Pago"
                        data={paymentTypes} value={payment.paymentTypeId}
                        onChange={(val) => onUpdateField("paymentTypeId", val)} />
                    <NumberInputApp title="Monto" value={payment.amount} className="md:flex-1 px-2 text-sm" min={1} onChange={(val) => onUpdateField("amount", val)} />
                </fieldset>
            </div>
        </Modal>
    )
}

const validateFields = (item: Payment, invoice: InvoiceInfoDTO) => {
    const { customerId, invoiceId, amount, paymentTypeId } = item;
    if (customerId === undefined || customerId <= 0) {
        toast.error("El campo cliente es requerido");
        return false;
    }
    if (invoiceId === undefined || invoiceId <= 0) {
        toast.error("El campo factura es requerido");
        return false;
    }
    if (paymentTypeId === undefined || paymentTypeId <= 0) {
        toast.error("El campo tipo de pago es requerido");
        return false;
    }
    if (amount === undefined || amount <= 0) {
        toast.error("El campo monto debe ser mayor a 0");
        return false;
    }
    if (amount > invoice.total) {
        toast.error("El monto excede al saldo pendiente de la factura");
        return false;
    }

    return true;
}