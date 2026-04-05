import { useEffect, useState } from "react";
import type { PaginatedResponse } from "../../../models/paginatedResponse";
import type { Customer } from "../../../services/customer/customer.type";
import { CustomerService } from "../../../services/customer/customer.service";

export const usePatient = () => {
    const [data, setData] = useState<PaginatedResponse<Customer | null>>();
    const [customer, setCustomer] = useState<Customer | null>(null)
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<any>(null);

    const loadCustomers = async () => {
        setLoading(true)
        CustomerService.getAllCustomers({ page: 1, search: '' })
            .then(setData)
            .catch(setError)
            .finally(() => setLoading(false));

    }

    useEffect(() => {
        loadCustomers()
    }, []);

    return {
        data,
        loading,
        error,
        customer,
        setCustomer,
        loadCustomers
    };
};