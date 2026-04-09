import { useEffect, useState } from "react";
import { InvoiceService } from "../../../services/invoice/invoice.service";
import type { CustomerInvoiceDTO } from "../../../services/invoice/customerinvoice.dto.type";
import type { PaymentDTO } from "../../../services/payment/payment.type";
import type { InvoiceInfoDTO } from "../../../services/invoice/invoice.types";

export const usePatientBill = () => {
    const [invoiceData, setInvoiceData] = useState<InvoiceInfoDTO[]>();
    const [paymentHistoryData, setPaymentHistoryData] = useState<PaymentDTO[]>();
    const [customer, setCustomer] = useState<CustomerInvoiceDTO | null>();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);
    const [reload, setReload] = useState(1);

    useEffect(() => {
        if (customer) {
            InvoiceService.getInvoicesByCustomer(customer!.id)
                .then(setInvoiceData)
                .catch(setError)
                .finally(() => setLoading(false));

            InvoiceService.getPaymentHistoryByCustomer(customer!.id)
                .then(setPaymentHistoryData)
                .catch(setError)
                .finally(() => setLoading(false));
        }}, [customer]);
    
    useEffect(() => {
        if (!customer) return;

        setLoading(true);
        InvoiceService.getPaymentHistoryByCustomer(customer!.id)
                .then(setPaymentHistoryData)
                .catch(setError)
                .finally(() => setLoading(false));
    }, [reload])


    return {
        invoiceData,
        paymentHistoryData,
        loading,
        error,
        customer,
        setCustomer,
        setReload
    };
}