import { EllipsisVertical } from "lucide-react"
import { routesConfig } from "../../app/routesConfig";
import { cn, theme } from "../../utils/theme";
import type { Invoice } from "../../services/invoice/invoice.types";
import { useNavigate } from "react-router";
import { formatDateDDMMYYYY } from "../../utils/date.util";
import type { PaginatedResponse } from "../../models/paginatedResponse";
import { formatNumber } from "../../utils/number.util";
import AddButtonApp from "./AddButtonApp";

interface PageListProps {
    headers: string[],
    data?: PaginatedResponse<Invoice | null>,
    setIsModalOpen: () => void
}
export default function PageList({ headers, data, setIsModalOpen }: PageListProps) {
    const currentRoute = routesConfig.find(
        (r) => r.path === location.pathname
    );
    const navigate = useNavigate();
    const title = currentRoute !== undefined ? currentRoute.title : ''
    const title2 = getPluralName(title)
    return (
        <div className="w-full p-8 bg-white rounded-2xl">
            <div className="flex pb-5">
                <div>
                    <p className="font-bold">Lista de {title2}</p>
                    <p className="text-xs">Puedes buscar todas tus {title2} aquí.</p>
                </div>
                <div className="ml-auto flex">
                    <AddButtonApp onclick={setIsModalOpen} label="Agregar Nueva Factura" />
                </div>
            </div>
            <div className="ml-auto flex gap-4 mb-4">
                <input type="text" placeholder="Search..." className="flex-1 mt-2 p-1 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                <div>
                    <span className="text-sm text-black mr-2">Doctor</span>
                    <select className={`${cn(theme.dropDownStyle)}`}>
                        <option value="">All</option>
                        <option value="Dr. Smith">Dr. Smith</option>
                    </select>
                </div>
                <div>
                    <span className="text-sm text-black mr-2">Status</span>
                    <select className={`${cn(theme.dropDownStyle)}`}>
                        <option value="">All</option>
                        <option value="Completed">Completed</option>
                        <option value="Pending">Pending</option>
                        <option value="Cancelled">Cancelled</option>
                    </select>
                </div>
                <div>
                    <select className={`${cn(theme.dropDownStyle)}`}>
                        <option value="">Hoy</option>
                        <option value="today">Semana</option>
                        <option value="today">Mes</option>
                        <option value="today">Todos</option>
                    </select>
                </div>
            </div>

            <div className="flex flex-1 overflow-auto flex-col">
                <div className="flex">
                    {headers.map((header) => {
                        return <span key={header} className={`${header === '#' ? 'mr-2' : 'flex-1'} text-xs text-slate-500 uppercase font-medium`}>{header}</span>
                    })}
                </div>
                {data !== null && data?.data.map((item) => {
                    return (
                        <div key={item!.id} className="flex items-center w-full py-2">
                            <span className="mr-2 text-sm">{item!.id}</span>
                            <span className="flex-1 text-sm">{item!.number}</span>
                            <span className="flex-1 text-sm">{item!.customerName}</span>
                            <span className="flex-1 text-sm">{formatNumber(item!.subTotal)}</span>
                            <span className="flex-1 text-sm">{formatNumber(item!.taxTotal)}</span>
                            <span className="flex-1 text-sm">{formatNumber(item!.total)}</span>
                            <span className="flex-1 text-sm">{formatDateDDMMYYYY(item!.issueDate)}</span>
                            <span className={`flex-1`}>
                                <div className={`pl-2 pr-2 pb-0.5 w-22 text-center text-sm rounded-2xl ${getBgColorStatus(item!.statusId)}`}>{item!.statusId}</div>
                            </span>
                            <div className="flex flex-1">
                                <button
                                    onClick={() => navigate(`/invoice/${item?.id}/detail`)}
                                    className="pl-4 pr-4 rounded-sm bg-blue-200 border-2 border-blue-600 text-sm">Ver</button>
                                <EllipsisVertical />
                            </div>
                        </div>
                    )
                })}
                {data !== null && data !== undefined &&
                    <div className="flex pt-3">
                        <p className="text-xs">Showing 1 to {data!.totalPages} of {data!.totalItems} entries</p>
                        <div className="ml-auto flex gap-1">
                            {data!.currentPage !== 1 && (
                                <button className={`${cn(theme.buttonPage)}`} disabled>Previous</button>
                            )}
                            {data!.totalPages > 1 && Array.from({ length: data!.totalPages }).map((_, index) => (
                                <button key={index} className={`${cn(theme.buttonPage)}`}>
                                    {index + 1}
                                </button>
                            ))}
                            {data!.currentPage < data!.totalPages && (
                                <button className={`${cn(theme.buttonPage)}`} disabled>Next</button>
                            )}
                        </div>
                    </div>
                }
                {(!data || !data.data) &&
                    <div className="flex flex-col items-center">
                        <img src="./src/assets/notfounditem.png" className="w-72" />
                        <p className="font-bold">No se encontraron facturas</p>
                        <p className="py-2">No hay resultados con los filtros actuales, Intenta ajustar los filtros</p>
                    </div>
                }
            </div>
        </div>
    )
}

function getPluralName(name: string) {
    return `${name}s`
}

function getBgColorStatus(status: number) {
    switch (status) {
        case 1:
            return "bg-green-200 border-green-600 text-green-800"
        case 2:
            return "bg-yellow-200 border-yellow-600 text-yellow-800"
        case 3:
            return "bg-red-200 border-red-600 text-red-800"
        default:
            return "bg-gray-200 border-gray-600 text-gray-800"
    }
}