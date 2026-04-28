import { ChevronLeft, ChevronRight } from "lucide-react";
import PaginationButton from "./PaginationButton";

interface PaginatedFootProps {
    sizeData: number,
    currentPage: number,
    totalPages: number,
    onPageChange: (page: number) => void,
}
export default function PaginatedFoot({ sizeData, currentPage, totalPages, onPageChange }: PaginatedFootProps) {
    const itemsPerPage = 15;

    // El primer elemento de la página actual
    // Ejemplo: Página 1 -> (1-1)*15 + 1 = 1 | Página 2 -> (2-1)*15 + 1 = 16
    const from = sizeData === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1;

    // El último elemento de la página actual
    // Usamos Math.min para no pasarnos del total real (sizeData)
    const to = Math.min(currentPage * itemsPerPage, sizeData);
    const getVisiblePages = () => {
        const pages: (number | string)[] = [];
        const sideNeighbors = 1; // Ajusta esto si quieres más números alrededor del centro

        // 1. Siempre incluir la primera página
        pages.push(1);

        // Calcular el rango dinámico
        let start = Math.max(2, currentPage - sideNeighbors);
        let end = Math.min(totalPages - 1, currentPage + sideNeighbors);

        // Ajustes para mostrar siempre al menos 3 números cuando sea posible
        // (Ej: Si estás en la pag 1, mostrar 1, 2, 3)
        if (currentPage <= 2) {
            end = Math.min(totalPages - 1, 3);
        }
        // (Ej: Si estás en la última, mostrar 18, 19, 20)
        if (currentPage >= totalPages - 1) {
            start = Math.max(2, totalPages - 2);
        }

        // 2. Agregar puntos suspensivos iniciales si es necesario
        if (start > 2) {
            pages.push("...");
        }

        // 3. Agregar el rango central
        for (let i = start; i <= end; i++) {
            pages.push(i);
        }

        // 4. Agregar puntos suspensivos finales si es necesario
        if (end < totalPages - 1) {
            pages.push("...");
        }

        // 5. Siempre incluir la última página (si hay más de una)
        if (totalPages > 1) {
            pages.push(totalPages);
        }

        return pages;
    };

    const visiblePages = getVisiblePages();

    return (
        <div className="flex items-center justify-between px-4 py-3 bg-white dark:bg-slate-800 border-t border-slate-200 dark:border-slate-600">
            <span className="text-md text-slate-500 dark:text-sidebar-item">
                Mostrando del <b className="text-black dark:text-sidebar-item">{from}</b> al <b className="text-black dark:text-sidebar-item">{to}</b> de <b className="text-black dark:text-sidebar-item">{sizeData}</b> registros
            </span>
            <div className="flex gap-2">
                <PaginationButton
                    disabled={currentPage === 1}
                    onClick={() => onPageChange(currentPage - 1)}
                >
                    <ChevronLeft size={16} />
                </PaginationButton>
                {visiblePages.map((page, index) => (
                    <PaginationButton
                        key={index}
                        onClick={() => typeof page === 'number' ? onPageChange(page) : null}
                        active={page === currentPage}
                        isClassNone={page === '...'}
                    >
                        <span className="text-sm">{page}</span>
                    </PaginationButton>
                ))}
                <PaginationButton
                    disabled={currentPage === totalPages}
                    onClick={() => onPageChange(currentPage + 1)}
                >
                    <ChevronRight size={16} />
                </PaginationButton>
            </div>
        </div>
    )
}
