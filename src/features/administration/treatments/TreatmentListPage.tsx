import { EllipsisVertical } from "lucide-react";
import { Navigate } from "react-router";
import PageComponent from "../../../components/commons/PageComponent";
import TreatmentForm from "./components/TreatmentForm";
import { useTreatments } from "./hooks/useTreatmetns";
import { usePermissions } from "../../../hooks/usePermissions";
import { PermissionAction, PermissionResource } from "../../../models/permission.enum";
import PaginatedDataTable from "@/components/pagination-data/PaginatedDataTable";
import type { Header } from "@/models/header.type";

const headers: Header[] = [
    { header: "Tratamiento", className: "flex-3" },
    { header: "Descripcion", className: "flex-1 hidden sm:block" },
    { header: "Precio", className: "flex-1" },
    { header: "Estado", className: "flex-1 hidden md:block" },
];

const RESOURCE = PermissionResource.Treatments;

export default function TreatmentListPage() {
    const { can } = usePermissions();
    const {
        isOpenCreateOrEdit,
        isOpenTransitionRight,
        openCreate,
        load, data, item, openPopUp, setItem, setOpenPopUp,
        setCurrentPage,
        pages
    } = useTreatments()

    if (!can(PermissionAction.View, RESOURCE)) {
        return <Navigate to="/not-found" replace />;
    }

    return (
        <PageComponent
            title="Tratamientos"
            description="Administra los tratamientos que se realizan en esta clinica"
            textButton="Agregar Tratamiento"
            showButton={can(PermissionAction.Create, RESOURCE)}
            onclick={() => openCreate(true)}>

            <PaginatedDataTable
                columns={headers}
                pagination={data}
                pages={pages}
                onPageChange={setCurrentPage}
            >
                <div className="divide-y divide-slate-200 dark:divide-slate-600">
                    {data?.data?.map((item, index) => (
                        <div key={item?.name}
                            className={`flex px-4 py-3 gap-2 items-center ${index % 2 !== 0 ? "bg-slate-200 dark:bg-slate-800" : ""} hover:bg-slate-300 dark:hover:bg-slate-800/50 transition-colors`}>
                            <span className="flex-3 dark:text-slate-200 truncate">{item?.name}</span>
                            <span className="flex-1 hidden sm:block dark:text-slate-400">{item?.description}</span>
                            <span className="flex-1 dark:text-slate-200 font-semibold">{item?.currency?.symbol}{item?.price}</span>
                            <span className="flex-1 hidden md:block dark:text-slate-400">{item?.isActive ? 'Activo' : 'Inactivo'}</span>
                            <div className="flex-1 flex justify-end relative">
                                <button onClick={() => setOpenPopUp(item!.id)}
                                    className="p-1 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-full transition-colors">
                                    <EllipsisVertical size={20} />
                                </button>
                                {openPopUp === item!.id && (
                                    <div className="absolute right-0 top-8 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-600 rounded-md shadow-xl z-50 min-w-30"
                                        onMouseLeave={() => setOpenPopUp(0)}>
                                        {can(PermissionAction.Update, RESOURCE) && (
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

            <div
                className={`fixed top-0 right-0 h-full w-full md:w-7/12 bg-white dark:bg-slate-800 shadow-2xl z-50 
                    transform transition-transform duration-500 ease-in-out 
                    ${isOpenTransitionRight ? 'translate-x-0' : 'translate-x-full'
                    }`}>
                {isOpenCreateOrEdit && <TreatmentForm setIsOpen={openCreate} treatmentParam={item} reload={load} />}
            </div>
        </PageComponent>
    )
}
