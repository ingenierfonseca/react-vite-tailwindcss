import { useEffect, useState } from "react";
import { InvoiceService } from "../../../services/invoice/invoice.service";
import type { CustomerInvoiceDTO } from "../../../services/invoice/customerinvoice.dto.type";
import type { InvoiceInfoDTO } from "../../../services/invoice/invoice.types";
import type { Payment, RequestPayment } from "../../../services/payment/payment.type";
import { PaymentService } from "../../../services/payment/payment.service";

export const useQuickPayment = () => {
    const [invoiceData, setInvoiceData] = useState<InvoiceInfoDTO[]>();
    const [invoice, setInvoice] = useState<InvoiceInfoDTO>();
    const [customer, setCustomer] = useState<CustomerInvoiceDTO | null>();
    const [payment, setPayment] = useState<Payment>({id: 0, amount: 0, currencyId: 0, customerId: 0, invoiceId: 0, paymentTypeId: 0});
    const [transactionId, setTransactionId] = useState(1)
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        if (customer) {
            setLoading(true);
            onUpdateField("customerId", customer.id);
            InvoiceService.getInvoicesByCustomer(customer.id)
                .then(setInvoiceData)
                .catch(setError)
                .finally(() => setLoading(false));
        }
    }, [customer]);

    const onUpdateField = (field: keyof Payment, value: any) => {
        setPayment((prev) => ({
            ...prev,
            [field]: value
        }))
    }

    const registerPayment = async () => {
        try {
            setLoading(true);
            setError(null);
            var request: RequestPayment = {
                amount: payment.amount,
                currencyId: payment.currencyId,
                customerId: payment.customerId,
                invoiceId: payment.invoiceId,
                paymentTypeId: payment.paymentTypeId,
                operationTypeId: transactionId
            }
            const result = await PaymentService.post(request);
            setPayment(result)
            return { success: true, paymentId: result.id }
        } catch (error: any) {
            const msg = error.response?.data?.message || error.message || "Error inesperado";
            const errorObject = new Error(msg);
            setError(errorObject);
            return { success: false, error: errorObject }
        } finally {
            setLoading(false);
        }
    }

    return {
        invoiceData,
        loading,
        error,
        customer,
        payment,
        invoice,
        transactionId,
        setCustomer,
        onUpdateField,
        setInvoice,
        setPayment,
        setTransactionId,
        registerPayment
    };
}