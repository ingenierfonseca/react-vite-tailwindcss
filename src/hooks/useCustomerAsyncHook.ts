import { useState } from "react";
import { CustomerService } from "../services/customer/customer.service"
import type { Customer } from "../services/customer/customer.type";
import { useAsyncDropdown } from "./useAsyncDropdown"
import type { Paggination } from "../services/appointment/appointment.types";

export const useCustomerAsyncHook = () => {
    const {
        options,
        search,
        setSearch,
        loading,
        hasMore,
        setPage
    } = useAsyncDropdown<Customer>({
        fetchData: ({search, page}) => CustomerService.getAllCustomers(page, search),
        getValue: c => c.id,
        getLabel: c => `${c.firstName} ${c.lastName}`,
    });

    //totalPages
    const filteredOptions =
        1 === 1
        ? options.filter(o =>
            o.value.toLowerCase().includes(search.toLowerCase())
        )
        : options;


    return {
        options,
        search,
        setSearch,
        loading,
        hasMore,
        setPage,
        filteredOptions
    };
} 