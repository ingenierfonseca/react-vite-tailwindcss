import { useEffect, useState } from "react";
import type { PaginatedResponse } from "../models/paginatedResponse";

interface UseCatalogProps<T> {
    fetchFn: (params: { page: number; search: string }) => Promise<PaginatedResponse<T>>;
}

export function useCatalog<T>({ fetchFn }: UseCatalogProps<T>) {
    const [data, setData] = useState<PaginatedResponse<T>>();
    const [item, setItem] = useState<T>();

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<any>(null);

    const [search, setSearch] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [pages, setPages] = useState<number[]>([]);

    const [openPopUp, setOpenPopUp] = useState(0);
    const [isOpenTransitionRight, setIsOpenTransitionRight] = useState(false);
    const [isOpenCreateOrEdit, setIsOpenCreateOrEdit] = useState(false);

    const load = async () => {
        setLoading(true);
        fetchFn({ page: currentPage, search })
            .then((data) => {
                setData(data);
                setPages(
                    Array.from(
                        { length: data?.totalPages || 0 },
                        (_, i) => i + 1
                    )
                );
            })
            .catch(setError)
            .finally(() => setLoading(false));
    };

    useEffect(() => {
        load();
    }, [currentPage, search]);

    function openCreate(value: boolean) {
        if (value) {
            setIsOpenTransitionRight(true);
            setIsOpenCreateOrEdit(true);
        } else {
            setIsOpenTransitionRight(false);
            setTimeout(() => setIsOpenCreateOrEdit(false), 500);
        }
    }

    return {
        data,
        item,
        setItem,
        loading,
        error,
        search,
        setSearch,
        currentPage,
        setCurrentPage,
        pages,
        load,
        openPopUp,
        setOpenPopUp,
        isOpenTransitionRight,
        isOpenCreateOrEdit,
        openCreate
    };
}