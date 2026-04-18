import { EllipsisVertical } from "lucide-react";
import PageComponent from "../../../components/commons/PageComponent";
import PaginatedDataTable, { type Header } from "../../../components/pagination-data/PaginatedDataTable";
import { useAppointmentTypes } from "./hooks/appointmentTypes.hook";
import AppointmentTypeForm from "./components/AppointmentTypeForm";

const headers: Header[] = [
    {
        header: 'Nombre',
        className: 'flex-3'
    },
    {
        header: 'Descripcion',
        className: 'hidden md:flex-3'
    },
    {
        header: 'Duración Minutos',
        className: 'flex-1'
    }
]
export default function AppointmentTypeListPage() {
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
        pages
    } = useAppointmentTypes()

    return (
        <PageComponent
            title="Tipos de Citas"
            description="Administra los tipos de cita en esta clínica"
            textButton="Agregar Tipo de Cita"
            onclick={() => { }}>
            <PaginatedDataTable
                columns={headers}
                pagination={data}
                pages={pages}
                onPageChange={setCurrentPage}
            >
                {/* Cuerpo de la tabla */}
                <div className="divide-y divide-slate-200 dark:divide-slate-600">
                    {data?.data?.map((item, index) => (
                        <div key={item.id} className={`flex px-4 py-3 gap-2 items-center ${index % 2 !== 0 ? 'dark:bg-slate-800' : ''} hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors`}>
                            <span className="flex-3 dark:text-slate-200">{item.name}</span>
                            <span className="hidden md:flex-3 dark:text-slate-200">{item.description}</span>
                            <span className="flex-1 dark:text-slate-200">{item.time}</span>
                            {/* Menú de Acciones */}
                            <div className="flex-1 flex justify-end relative">
                                <button
                                    onClick={() => setOpenPopUp(item?.id ?? 0)}
                                    className="p-1 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-full transition-colors"
                                >
                                    <EllipsisVertical size={20} />
                                </button>

                                {openPopUp === item.id && (
                                    <div
                                        className="absolute right-0 top-8 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-600 rounded-md shadow-xl z-50 min-w-30"
                                        onMouseLeave={() => setOpenPopUp(0)}
                                    >
                                        <button
                                            className="w-full text-left px-4 py-2 hover:bg-slate-100 dark:hover:bg-slate-700 text-sm dark:text-slate-200"
                                            onClick={() => {
                                                setItem(item)
                                                openCreate(true)
                                            }}
                                        >
                                            Editar
                                        </button>
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
                    }`}
            >
                {isOpenCreateOrEdit && <AppointmentTypeForm setIsOpen={openCreate} itemParam={item} reload={load} />}
            </div>
        </PageComponent>
    )
}