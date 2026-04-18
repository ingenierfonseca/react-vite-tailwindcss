import { ChevronLeft, ChevronRight } from "lucide-react";
import type { PaginatedResponse } from "../../models/paginatedResponse";
import type React from "react";
import PaginationButton from "./PaginationButton";

export interface Header {
    header: string
    className: string
}
interface DataTableProps<T> {
    columns: Header[]
    pagination?: PaginatedResponse<T>
    pages: number[]
    onPageChange: (page: number) => void
    children: React.ReactElement
}
export default function PaginatedDataTable<T>({
    columns,
    pagination,
    pages,
    onPageChange,
    children
}: DataTableProps<T>) {
    return (
        <div className="w-full mt-4 overflow-hidden rounded-lg border border-slate-200 dark:border-slate-600">
            {/* Encabezados */}
            <div className="flex bg-slate-100 dark:bg-slate-700/50 px-4 py-3 gap-2 border-b border-slate-200 dark:border-slate-600">
                {columns.map((col) => (
                    <div
                        key={col.header}
                        className={`${col.className} font-semibold text-slate-700 dark:text-slate-100`}
                    >
                        {col.header}
                    </div>
                ))}
                <div className="flex-1 text-right">Acciones</div>
            </div>

            {children}

            {/* Paginación */}
            {pagination && (<div className="flex items-center justify-between px-4 py-3 bg-white dark:bg-slate-800 border-t border-slate-200 dark:border-slate-600">
                <span className="text-sm text-slate-500 dark:text-slate-400">
                    Mostrando <b>{Math.min(pagination.data?.length ?? 0, pagination.pageSize)}</b> de <b>{pagination.totalItems}</b>
                </span>
                <div className="flex gap-2">
                    <PaginationButton
                        disabled={pagination.currentPage === 1}
                        onClick={() => onPageChange(pagination.currentPage - 1)}
                    >
                        <ChevronLeft size={16} />
                    </PaginationButton>
                    {pages.map(page => (
                        <PaginationButton
                            key={page}
                            onClick={() => onPageChange(page)}
                            active={page === pagination.currentPage}
                        >
                            <span className="text-sm">{page}</span>
                        </PaginationButton>
                    ))}
                    <PaginationButton
                        disabled={pagination.currentPage === pagination.totalPages}
                        onClick={() => onPageChange(pagination.currentPage + 1)}
                    >
                        <ChevronRight size={16} />
                    </PaginationButton>
                </div>
            </div>)}
        </div>
    );
};