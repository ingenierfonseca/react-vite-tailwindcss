import { ChevronLeft, ChevronRight, EllipsisVertical } from "lucide-react";
import PageComponent from "../../../components/commons/PageComponent";
import TreatmentForm from "./components/TreatmentForm";
import { useTreatments } from "./hooks/useTreatmetns";
import PaginationButton from "../../../components/pagination-data/PaginationButton";

const headers = [
    'Tratamiento', 'Descripcion', 'Precio', 'Estado', ''
]
export default function TreatmentListPage() {
    const {
        isOpenCreateOrEdit,
        isOpenTransitionRight,
        openCreate,
        loadTreatments,
        data,
        treatment,
        openPopUp,
        setTreatment,
        setOpenPopUp,
        setCurrentPage,
        pages
    } = useTreatments()

    return (
        <PageComponent
            title="Tratamientos"
            description="Administra los tratamientos que se realizan en esta clinica"
            textButton="Agregar Tratamiento"
            onclick={() => openCreate(true)}>

            <div className="flex mt-4 px-4 py-2 gap-2 bg-slate-100 border border-slate-200 dark:bg-slate-700/20 dark:border-slate-600">
                {headers.map((header) => (
                    <div key={header} className={`
                        ${header === 'Tratamiento' ? 'flex-3' : ''}
                        ${header === 'Descripcion' ? 'flex-3 hidden md:block' : ''}
                        ${header === 'Precio' || header === 'Estado' ? 'flex-1' : ''} font-semibold text-slate-700 dark:text-slate-100
                        ${header === '' ? 'flex-1 ml-auto' : ''}`}>
                        {header}
                    </div>
                ))}
            </div>
            {data && data.data.map((item) => (
                <div key={item?.name} className="flex px-4 py-2 gap-2 border border-slate-200 dark:border-slate-600">
                    <span className="flex-3 dark:text-slate-200">{item?.name}</span>
                    <span className="flex-3 hidden md:block dark:text-slate-400">{item?.description}</span>
                    <span className="flex-1 font-bold dark:text-slate-200">{item?.currency?.symbol}{item?.price}</span>
                    <span className="flex-1 dark:text-slate-400">{item?.isActive ? 'Activo' : 'Inactivo'}</span>
                    <div className="flex-1 flex justify-end items-center dark:text-slate-200 dark:hover:text-slate-400 cursor-pointer" onClick={() => setOpenPopUp(item?.id ?? 0)}><EllipsisVertical /></div>
                    {openPopUp === item?.id &&(
                        <div className="absolute right-0 mt-2 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg shadow-lg z-50" onMouseLeave={() => setOpenPopUp(0)}>
                            <button
                                className="w-full text-left px-2 py-0 hover:bg-slate-100 dark:hover:bg-slate-700 dark:text-slate-200"
                                onClick={() => {
                                    setTreatment(item)
                                    openCreate(true)
                                }}
                            >
                                Editar
                            </button>
                        </div>
                    )}
                </div>
            ))}
            {data && data.data && (
                <div className="flex px-4 py-2 border border-slate-200 dark:border-slate-600">
                    <div>
                        <p className="text-sm dark:text-slate-400">
                            Mostrando{" "}
                            <span className="font-bold dark:text-slate-100">
                                {(data?.currentPage - 1) * data?.pageSize + 1}
                                {"-"}
                                {Math.min(data.currentPage * data.pageSize, data.totalItems)}
                                {" "}de{" "}{data?.totalItems}{" "}
                            </span>
                            registros</p>
                    </div>
                    <div className="ml-auto flex gap-1">
                        <PaginationButton 
                            onClick={() => setCurrentPage(prev => prev - 1)} 
                            disabled={data.currentPage == 1}>
                            <ChevronLeft size={16} className="font-bold" />
                        </PaginationButton>
                        {pages.map(page => (
                            <PaginationButton
                                key={page}
                                onClick={() => setCurrentPage(page)}
                                active={page === data.currentPage}
                                >
                                <span className="text-sm">{page}</span>
                            </PaginationButton>
                        ))}
                        <PaginationButton 
                            onClick={() => setCurrentPage(prev => prev + 1)} 
                            disabled={data.currentPage === data.totalPages}>
                            <ChevronRight size={16} className="font-bold" />
                        </PaginationButton>
                    </div>
                </div>
            )}


            <div
                className={`fixed top-0 right-0 h-full w-full md:w-7/12 bg-white dark:bg-slate-800 shadow-2xl z-50 
                    transform transition-transform duration-500 ease-in-out 
                    ${isOpenTransitionRight ? 'translate-x-0' : 'translate-x-full'
                    }`}
            >
                {isOpenCreateOrEdit && <TreatmentForm setIsOpen={openCreate} treatmentParam={treatment!} reload={loadTreatments} />}
            </div>
        </PageComponent>
    )
}