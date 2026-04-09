import { toast } from "react-toastify";
import Modal from "../../../components/commons/Modal";
import NumberInputApp from "../../../components/commons/NumberInputApp";
import TextFieldApp from "../../../components/commons/TextFieldApp";
import type { Payment } from "../../../services/payment/payment.type";
import { useState } from "react";
import DropDownApp from "../../../components/commons/DropDownApp";
import type { CustomerInvoiceDTO } from "../../../services/invoice/customerinvoice.dto.type";

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
    const [payment, setPayment] = useState<Payment>({ id: 0, amount: 0, invoiceId: 0, customerId: 0, paymentTypeId: 1 });

    const onUpdateField = (field: keyof Payment, value: any) => {
        setPayment((prev) => ({
            ...prev,
            [field]: value
        }))
    }

    return (
        <Modal isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            title="Información del Pago"
            textBtnConfirm="Agregar"
            clickBtnConfirm={() => {
                if (validateFields(payment)) {
                    onClick()
                    setIsModalOpen(false)
                }
            }}>
            <div className="space-y-4">
                <p className="text-slate-500 dark:text-slate-400 text-sm">
                    Completa los datos del pago
                </p>
                <fieldset className="grid p-2 gap-2 border border-slate-200 dark:border-slate-700">
                    <TextFieldApp label="Paciente" value={customer.fullName} className="md:flex-2 px-2 text-sm" disabled={true} onChange={()=>{}} />
                    <DropDownApp
                        title="Metodo de Pago"
                        data={paymentTypes} value={payment.paymentTypeId}
                        onChange={(val) => onUpdateField("paymentTypeId", val)} />
                    <NumberInputApp title="Monto" value={payment.amount} className="md:flex-1 px-2 text-sm" min={1} onChange={(val) => { }} />
                </fieldset>
            </div>
        </Modal>
    )
}

const validateFields = (item: Payment) => {
    const { customerId, invoiceId, amount, paymentTypeId } = item;
    if (customerId === undefined || customerId <= 0) {
        toast.error("El campo cliente es requerido");
        return false;
    }
    if (amount === undefined || amount <= 0) {
        toast.error("El campo monto debe ser mayor a 0");
        return false;
    }
    if (paymentTypeId === undefined || paymentTypeId <= 0) {
        toast.error("El campo tipo de pago es requerido");
        return false;
    }

    return true;
}