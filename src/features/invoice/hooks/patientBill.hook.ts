import { useEffect, useState } from "react";
import { InvoiceService } from "../../../services/invoice/invoice.service";
import type { Invoice } from "../../../services/invoice/invoice.types";
import type { CustomerInvoiceDTO } from "../../../services/invoice/customerinvoice.dto.type";

export const usePatientBill = () => {
    const [data, setData] = useState<Invoice[]>();
    const [customer, setCustomer] = useState<CustomerInvoiceDTO | null>();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        console.log("Customer changed in usePatientBill:", customer);
        //if (customer) {
            InvoiceService.getInvoicesByCustomer(customer!.id)
                .then(setData)
                .catch(setError)
                .finally(() => setLoading(false));
        }, []);

    return {
        data,
        loading,
        error,
        customer,
        setCustomer
    };
}