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
    const [search, setSearch] = useState<string>('')
    const [currentPage] = useState<number>(1)
    const [isOpenTransitionRight, setIsOpenTransitionRight] = useState(false)
    const [isOpenProfileBillInfo, setIsOpenProfileBillInfo] = useState(false)
    const [isOpenMakeInvoice, setIsOpenMakeInvoice] = useState(false)
    const [invoiceId, setInvoiceId] = useState("0")

    const loadDataPage = async () => {
        setLoading(true)
        InvoiceService.getDashboard()
            .then(setDashboardData)
            .catch(setError)
            .finally(() => setLoading(false));

        InvoiceService.getCustomerIvoicesDashboard({ page: currentPage, search: search })
            .then(setData)
            .catch(setError)
            .finally(() => setLoading(false));
    }

    useEffect(() => {
        loadDataPage()
    }, [currentPage, search]);



    function openProfileBillInfo(value: boolean) {
        if (value) {
            setIsOpenProfileBillInfo(true);
            setIsOpenTransitionRight(true);
        } else {
            setIsOpenTransitionRight(false);
            setTimeout(() => {
                setIsOpenProfileBillInfo(false);
            }, 500);
        }
    }

    function openMakeInvoice(value: boolean) {
        if (value) {
            setIsOpenMakeInvoice(true);
            setIsOpenTransitionRight(true);
        } else {
            setIsOpenTransitionRight(false);
            setTimeout(() => {
                setIsOpenMakeInvoice(false);
            }, 500);
        }
    }


    function openInvoiceDetail(id: string) {
        setInvoiceId(id)
        openProfileBillInfo(false)
        setTimeout(() => {
            openMakeInvoice(true)
        }, 500);
    }

    return {
        data,
        dashboardData,
        loading,
        error,
        customer,
        setCustomer,
        loadDataPage,
        search,
        setSearch,
        invoiceId,
        setInvoiceId,
        isOpenTransitionRight,
        isOpenProfileBillInfo,
        isOpenMakeInvoice,
        openProfileBillInfo,
        openMakeInvoice,
        openInvoiceDetail
    };
}