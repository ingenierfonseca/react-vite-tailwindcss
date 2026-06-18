import { Navigate } from "react-router";
import { EllipsisVertical } from "lucide-react";
import { usePermissions } from "@/hooks/usePermissions";
import PageComponent from "@/components/commons/PageComponent";
import PaginatedDataTable from "@/components/pagination-data/PaginatedDataTable";
import type { Staff } from "@/models/staff.type";
import { useStaffList } from "./hooks/useStaffList";
import StaffForm from "./components/StaffForm";
import type { Header } from "@/models/header.type";
import { calculateAgeFromString } from "@/utils/date.util";

const RESOURCE = "staff";

const headers : Header[] = [
    { header: "Nombre completo", className: "flex-2" },
    { header: "Edad", className: "flex-[0.5]" },
    { header: "Género", className: "flex-[0.5]" },
    { header: "Teléfono", className: "flex-[0.5]" },
    { header: "Email", className: "flex-1" }
];

export default function StaffListPage() {
    const { can } = usePermissions();
    const {
        isOpenCreateOrEdit,
        isOpenTransitionRight,
        openCreate,
        load,
        data,
        item,
        openPopUp,
        setItem,
        setOpenPopUp,
        setCurrentPage,
        pages,
        resetItem,
    } = useStaffList();

    if (!can("view", RESOURCE)) return <Navigate to="/not-found" replace />;

    return (
        <PageComponent
            title="Empleados"
            description="Gestión del personal de la clínica"
            textButton="Agregar Empleado"
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
                    {data?.data?.map((staff: Staff) => (
                        <div key={staff.id} className="flex px-4 py-3 gap-2 items-center hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                            <span className="flex-2 text-sm text-slate-800 dark:text-slate-200">
                                {staff.firstName} {staff.lastName}
                            </span>
                            <span className="flex-[0.5] text-sm text-slate-600 dark:text-slate-400">
                                {calculateAgeFromString(staff.birthDate)}
                            </span>
                            <span className="flex-[0.5] text-sm text-slate-600 dark:text-slate-400">
                                {staff.gender}
                            </span>
                            <span className="flex-[0.5] text-sm text-slate-600 dark:text-slate-400">
                                {staff.phone}
                            </span>
                            <span className="flex-1 text-sm text-slate-600 dark:text-slate-400">
                                {staff.email}
                            </span>
                            <div className="flex-1 flex justify-end relative">
                                <button
                                    onClick={() => setOpenPopUp(staff.id)}
                                    className="p-1 rounded-md hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors cursor-pointer"
                                >
                                    <EllipsisVertical size={18} className="text-slate-500" />
                                </button>
                                {openPopUp === staff.id && (
                                    <div
                                        className="absolute right-0 top-8 bg-white dark:bg-slate-800 shadow-lg border border-slate-200 dark:border-slate-700 rounded-lg z-50 min-w-30"
                                        onMouseLeave={() => setOpenPopUp(0)}
                                    >
                                        {can("update", RESOURCE) && (
                                            <button
                                                onClick={() => { setItem(staff); openCreate(true); }}
                                                className="w-full text-left px-4 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors cursor-pointer"
                                            >
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
                            ${isOpenTransitionRight ? "translate-x-0" : "translate-x-full"}`}
            >
                {isOpenCreateOrEdit && (
                    <StaffForm setIsOpen={openCreate} itemParam={item} reload={load} />
                )}
            </div>
        </PageComponent>
    );
}
