import { EllipsisVertical } from "lucide-react";
import { Navigate } from "react-router";
import PageComponent from "../../../components/commons/PageComponent";
import PaginatedDataTable from "../../../components/pagination-data/PaginatedDataTable";
import { useTreatmentPlans } from "./hooks/useTreatmentPlans";
import TreatmentPlanForm from "./components/TreatmentPlanForm";
import { usePermissions } from "../../../hooks/usePermissions";
import type { Header } from "../../invoice/components/InvoiceDetail";

const headers: Header[] = [
    { header: "Título", className: "flex-3" },
    { header: "Complejidad", className: "flex-1 hidden sm:block" },
    { header: "Precio", className: "flex-1" },
    { header: "Items", className: "flex-1 hidden md:block" },
];

const RESOURCE = "treatmentplans";

export default function TreatmentPlanListPage() {
    const { can } = usePermissions();
    const {
        isOpenCreateOrEdit, isOpenTransitionRight, openCreate,
        load, data, item, openPopUp, setItem, setOpenPopUp,
        setCurrentPage, pages, resetItem
    } = useTreatmentPlans();

    if (!can("view", RESOURCE)) {
        return <Navigate to="/not-found" replace />;
    }

    return (
        <PageComponent
            title="Planes de Tratamiento"
            description="Administra los planes de tratamiento disponibles en la clínica"
            textButton="Agregar Plan"
            showButton={can("create", RESOURCE)}
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
                            <span className="flex-3 dark:text-slate-200 truncate">{item.title}</span>
                            <span className="flex-1 hidden sm:block dark:text-slate-400">{item.complexity}</span>
                            <span className="flex-1 dark:text-slate-200 font-semibold">{item.currency?.symbol}{item.basePrice}</span>
                            <span className="flex-1 hidden md:block dark:text-slate-400">{item.items.length} items</span>
                            <div className="flex-1 flex justify-end relative">
                                <button onClick={() => setOpenPopUp(item.id)}
                                    className="p-1 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-full transition-colors">
                                    <EllipsisVertical size={20} />
                                </button>
                                {openPopUp === item.id && (
                                    <div className="absolute right-0 top-8 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-600 rounded-md shadow-xl z-50 min-w-30"
                                        onMouseLeave={() => setOpenPopUp(0)}>
                                        {can("update", RESOURCE) && (
                                            <button className="w-full text-left px-4 py-2 hover:bg-slate-100 dark:hover:bg-slate-700 text-sm dark:text-slate-200"
                                                onClick={() => { setItem(item); openCreate(true); }}>
                                                Editar
                                            </button>
                                        )}
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
                {isOpenCreateOrEdit && <TreatmentPlanForm setIsOpen={openCreate} itemParam={item} reload={load} />}
            </div>
        </PageComponent>
    );
}
