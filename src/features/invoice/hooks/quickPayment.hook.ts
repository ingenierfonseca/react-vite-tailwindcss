import { useEffect, useState } from "react";
import { InvoiceService } from "../../../services/invoice/invoice.service";
import type { CustomerInvoiceDTO } from "../../../services/invoice/customerinvoice.dto.type";
import type { InvoiceInfoDTO } from "../../../services/invoice/invoice.types";
import type { Payment } from "../../../services/payment/payment.type";

export const useQuickPayment = () => {
    const [invoiceData, setInvoiceData] = useState<InvoiceInfoDTO[]>();
    const [invoice, setInvoice] = useState<InvoiceInfoDTO>();
    const [customer, setCustomer] = useState<CustomerInvoiceDTO | null>();
    const [payment, setPayment] = useState<Payment>({ id: 0, amount: 0, invoiceId: 0, customerId: 0, paymentTypeId: 1 });

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        if (customer) {
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

    return {
        invoiceData,
        loading,
        error,
        customer,
        payment,
        invoice,
        setCustomer,
        onUpdateField,
        setInvoice
    };
}