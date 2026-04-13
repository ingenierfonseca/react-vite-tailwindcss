import { useEffect, useState } from "react";
import type { PaginatedResponse } from "../../../models/paginatedResponse";
import type { Customer, CustomerDashboard } from "../../../services/customer/customer.type";
import { CustomerService } from "../../../services/customer/customer.service";

export const usePatient = () => {
    const [data, setData] = useState<PaginatedResponse<Customer | null>>();
    const [dashboardData, setDashboardData] = useState<CustomerDashboard[]>();
    const [isOpenTransitionRight, setIsOpenTransitionRight] = useState(false)
    const [isOpenProfileInfo, setIsOpenProfileInfo] = useState(false)
    const [isOpenCreateOrEdit, setIsOpenCreateOrEdit] = useState(false)
    const [customer, setCustomer] = useState<Customer | null>(null)
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<any>(null);
    const [search, setSearch] = useState<string>('')
    const [currentPage] = useState<number>(1)

    const loadCustomers = async () => {
        setLoading(true)
        CustomerService.getAllCustomers({ page: currentPage, search })
            .then(setData)
            .catch(setError)
            .finally(() => setLoading(false));

    }

    useEffect(() => {
        setLoading(true)
        CustomerService.getDashboard()
            .then(setDashboardData)
            .catch(setError)
            .finally(() => setLoading(false));
    }, []);

    useEffect(() => {
        loadCustomers()
    }, [currentPage, search]);

    function openProfileInfo(value: boolean) {
        if (value) {
            setIsOpenTransitionRight(value)
            setIsOpenProfileInfo(value)
        } else {
            setIsOpenTransitionRight(false)
            setTimeout(() => {
                setIsOpenProfileInfo(false)
            }, 500);
        }
    }
    function openCreate(value: boolean) {
        if (value) {
            setIsOpenTransitionRight(value)
            setIsOpenCreateOrEdit(value)
        } else {
            setIsOpenTransitionRight(false)
            setTimeout(() => {
                setIsOpenCreateOrEdit(false)
            }, 500);
        }
    }

    return {
        data,
        dashboardData,
        loading,
        error,
        customer,
        setCustomer,
        loadCustomers,
        search,
        setSearch,
        isOpenTransitionRight,
        isOpenProfileInfo,
        isOpenCreateOrEdit,
        openProfileInfo,
        openCreate
    };
};