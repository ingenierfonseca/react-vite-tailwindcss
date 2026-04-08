import { useEffect, useState } from "react";
import { InvoiceService } from "../../../services/invoice/invoice.service";
import type { PaginatedResponse } from "../../../models/paginatedResponse";
import type { CustomerInvoiceDTO } from "../../../services/invoice/customerinvoice.dto.type";
import type { CustomerDashboard } from "../../../services/customer/customer.type";

export const useCustomerInvoice = () => {
    const [dashboardData, setDashboardData] = useState<CustomerDashboard[]>();
    const [data, setData] = useState<PaginatedResponse<CustomerInvoiceDTO | null>>();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);
    const [customer, setCustomer] = useState<CustomerInvoiceDTO | null>(null);

    useEffect(() => {
        setLoading(true)
        InvoiceService.getDashboard()
            .then(setDashboardData)
            .catch(setError)
            .finally(() => setLoading(false));

        InvoiceService.getCustomerIvoicesDashboard({ page: 1, search: "" })
            .then(setData)
            .catch(setError)
            .finally(() => setLoading(false));
    }, []);

    return {
        data,
        dashboardData,
        loading,
        error,
        customer,
        setCustomer
    };
}