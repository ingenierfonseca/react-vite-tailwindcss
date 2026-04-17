import { useEffect, useState } from "react";
import type { Treatment } from "../../../../services/treatment/treatment.type";
import type { PaginatedResponse } from "../../../../models/paginatedResponse";
import { TreatmentService } from "../../../../services/treatment/treatment.service";

export const useTreatments = () => {
    const [data, setData] = useState<PaginatedResponse<Treatment | null>>();
    const [openPopUp, setOpenPopUp] = useState(0);
    const [isOpenTransitionRight, setIsOpenTransitionRight] = useState(false)
    const [isOpenCreateOrEdit, setIsOpenCreateOrEdit] = useState(false)
    const [treatment, setTreatment] = useState<Treatment | null>(null)
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<any>(null);
    const [search, setSearch] = useState<string>('')
    const [currentPage, setCurrentPage] = useState<number>(1)
    const [pages, setPages] = useState<number[]>([])

    const loadTreatments = async () => {
        setLoading(true)
        TreatmentService.get({ page: currentPage, search })
            .then((data)=>{
                setData(data)
                setPages(
                    Array.from(
                        { length: data?.totalPages || 0 },
                        (_, i) => i + 1
                    )
                )
            })
            .catch(setError)
            .finally(() => setLoading(false));
    }

    /*useEffect(() => {
        setLoading(true)
        CustomerService.getDashboard()
            .then(setDashboardData)
            .catch(setError)
            .finally(() => setLoading(false));
    }, []);*/

    useEffect(() => {
        loadTreatments()
    }, [currentPage, search]);

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
        loading,
        error,
        treatment,
        loadTreatments,
        search,
        setSearch,
        isOpenTransitionRight,
        isOpenCreateOrEdit,
        openCreate,
        currentPage,
        openPopUp,
        setTreatment,
        setOpenPopUp,
        setCurrentPage,
        pages
    };
};