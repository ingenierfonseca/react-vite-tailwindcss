import { EllipsisVertical } from "lucide-react";
import PageComponent from "../../../components/commons/PageComponent";
import PaginatedDataTable from "../../../components/pagination-data/PaginatedDataTable";
import { useExchangeRates } from "./hooks/useExchangeRates";
import ExchangeRateForm from "./components/ExchangeRateForm";
import type { Header } from "../../invoice/components/InvoiceDetail";

const headers: Header[] = [
    { header: "De", className: "flex-2" },
    { header: "A", className: "flex-2" },
    { header: "Tasa", className: "flex-1" },
    { header: "Tasa Activa", className: "flex-2" },
];

export default function ExchangeRateListPage() {
    const {
        isOpenCreateOrEdit, isOpenTransitionRight, openCreate,
        load, data, item, openPopUp, setItem, setOpenPopUp,
        setCurrentPage, pages, resetItem
    } = useExchangeRates();

    return (
        <PageComponent
            title="Tipos de Cambio"
            description="Administra las tasas de cambio entre monedas"
            textButton="Agregar Tipo de Cambio"
            onclick={() => { resetItem(); openCreate(true); }}
        >
            <PaginatedDataTable
                columns={headers}
                pagination={data}
                pages={pages}
                onPageChange={setCurrentPage}
            >
                <div className="divide-y divide-slate-200 dark:divide-slate-600">
                    {data?.data?.map((item, index) => (
                        <div key={item.id}
                            className={`flex px-4 py-3 gap-2 items-center ${index % 2 !== 0 ? "bg-slate-200 dark:bg-slate-800" : ""} hover:bg-slate-300 dark:hover:bg-slate-800/50 transition-colors`}>
                            <span className="flex-2 dark:text-slate-200">{item.fromCurrency ? `${item.fromCurrency.symbol} - ${item.fromCurrency.name}` : `ID: ${item.fromCurrencyId}`}</span>
                            <span className="flex-2 dark:text-slate-200">{item.toCurrency ? `${item.toCurrency.symbol} - ${item.toCurrency.name}` : `ID: ${item.toCurrencyId}`}</span>
                            <span className="flex-1 dark:text-slate-200 font-mono">{item.rate}</span>
                            <span className="flex-2 dark:text-slate-200">{item.isActive ? "Activo": ""}</span>
                            <div className="flex-1 flex justify-end relative">
                                <button onClick={() => setOpenPopUp(item.id)}
                                    className="p-1 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-full transition-colors">
                                    <EllipsisVertical size={20} />
                                </button>
                                {openPopUp === item.id && (
                                    <div className="absolute right-0 top-8 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-600 rounded-md shadow-xl z-50 min-w-30"
                                        onMouseLeave={() => setOpenPopUp(0)}>
                                        <button className="w-full text-left px-4 py-2 hover:bg-slate-100 dark:hover:bg-slate-700 text-sm dark:text-slate-200"
                                            onClick={() => { setItem(item); openCreate(true); }}>
                                            Editar
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </PaginatedDataTable>

            <div className={`fixed top-0 right-0 h-full w-full md:w-7/12 bg-white dark:bg-slate-800 shadow-2xl z-50 
                            transform transition-transform duration-500 ease-in-out 
                            ${isOpenTransitionRight ? "translate-x-0" : "translate-x-full"}`}>
                {isOpenCreateOrEdit && <ExchangeRateForm setIsOpen={openCreate} itemParam={item} reload={load} />}
            </div>
        </PageComponent>
    );
}
