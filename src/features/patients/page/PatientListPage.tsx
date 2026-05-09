import { Calendar, Pencil, User } from "lucide-react"
import { PaginatedAutocomplete } from "../../../components/pagination-data/PaginatedAutocomplete"
import { CustomerService } from "../../../services/customer/customer.service"
import DashboardCard from "../../../components/dashboard/DashboardCard"
import PatientProfile from "../components/PatientProfile"
import PatientCreate from "../components/PatientCreateEdit"
import { usePatient } from "../hooks/patient.hook"
import AvatarInfo from "../../../components/commons/AvatarInfo"
import PageComponent from "../../../components/commons/PageComponent"
import type { Header } from "../../../models/header.type"
import DashboardCardII from "../../../components/dashboard/DashboardCardII"
import { ASSETS_URLS } from "../../../config/constants"
import ClinicalAssessment from "../components/ClinicalAssessment"
import TreatmentEvolution from "../components/TreatmentEvolution"

const headers:Header[]  = [
    {
        header: 'Paciente',
        className: 'flex-2'
    },
    {
        header: 'Edad',
        className: 'flex-1 hidden md:block'
    },
    {
        header: 'Telefono',
        className: 'flex-1 hidden md:block'
    },
    {
        header: 'Estado',
        className: 'flex-1 hidden md:block'
    },
    {
        header: 'Acciones',
        className: 'flex-1 text-right'
    }
]
export default function PatientListPage() {
    const { 
        data,
        dashboardData,
        customer,
        setCustomer,
        loadCustomers,
        search,
        setSearch,
        isOpenTransitionRight,
        isOpenTransition,
        isOpenProfileInfo,
        isOpenCreateOrEdit,
        isOpenSession,
        isOpenSessionPlan,
        openProfileInfo,
        openCreate,
        openClinicalAssessment,
        openSessionTreatmentPlan
    } = usePatient()

    return (
        <PageComponent
            title="Administración de Pacientes"
            description="Administra la información de tus pacientes"
            textButton="Agregar Nuevo Paciente"
            onclick={() => {
                setCustomer(null)
                openCreate(true)
            }}>

            <div className="grid grid-cols-[repeat(auto-fit,minmax(80px,1fr))] gap-4">
                {dashboardData && dashboardData.map((dashboard, index) => (
                    <DashboardCard
                        key={index}
                        iconClassName={`${dashboardData.length > 1 ? "hidden md:block" : ""}`}
                        stat= {{
                            title: dashboard.title,
                            value: dashboard.value,
                            change: dashboard.change,
                            trend: dashboard.trend,
                            bgColor: "bg-primary/20",
                            iconColor: "text-primary",
                            textColor: "text-blue-500",
                            color: "from-blue-400 to-blue-600",
                            icon: User
                        }} />
                ))}
                <DashboardCardII title="Pacientes activos" value={95} />
            </div>

            <div className="mt-4">
                <PaginatedAutocomplete
                    label="Paciente"
                    value={search}
                    onChange={(value) => setSearch(data?.data.find(c => c?.id === value)?.firstName || '')}
                    fetchData={CustomerService.get}
                    getValue={(item) => item.id}
                    getLabel={(item) => `${item.firstName.trim()} ${item.lastName.trim()}`}
                />
            </div>

            {data && data.data && 
            <div className="mt-4 bg-white dark:bg-slate-900 rounded-lg shadow-md">
                <div className="flex mt-4 py-2 bg-slate-100 dark:bg-slate-800/50 dark:border dark:border-slate-800">
                    {headers.map((header) => (
                        <div key={header.header} className={`font-semibold text-slate-700 dark:text-slate-100 ${header.className}`}>
                            {header.header}
                        </div>
                    ))}
                </div>
                {data.data.map((patient) => (
                    <div key={patient!.id} className="flex gap-4 pt-4 px-4 text-slate-700 dark:text-slate-300 border border-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 dark:border-slate-800">
                        <AvatarInfo
                            className="flex-2 min-w-0"
                            avatar={`${ASSETS_URLS.avatars}/${patient!.avatar}`}
                            name={patient!.firstName + " " + patient!.lastName}
                            title={`${patient!.email}`}
                            subTitle={`ID: PAC-${String(patient!.id).padStart(4, '0')}`}
                            onClick={() => {
                                setCustomer(patient)
                                openProfileInfo(true)
                            }}
                        />
                        <div className="flex-1 hidden md:block">{patient!.age}</div>
                        <div className="flex-1 hidden md:block">{patient!.phone}</div>
                        <div className="flex-1 hidden md:block">
                            <div className="flex justify-center w-fit px-3 rounded-2xl bg-green-400/10 dark:bg-green-400/20 font-semibold text-green-600 dark:text-green-400">Activo</div>
                        </div>
                        {/*<div className="flex-1">{formatDateDDMMYYYY(patient!.lastVisit)}</div>
                    <div className="flex-1">{formatDateDDMMYYYY(patient!.nextAppointment)}</div>
                    <div className="flex-1">${patient!.balanceDue.toFixed(2)}</div>*/}
                        <div className="flex-1 flex justify-end items-center gap-2">
                            <button className="w-8 h-8 bg-primary/10 p-1 text-primary px-2 rounded-sm hover:bg-primary/30 cursor-pointer">
                                <Calendar size={18} />
                            </button>
                            <button
                                onClick={() => {
                                    setCustomer(patient)
                                    openCreate(true)
                                }}
                                className="w-8 h-8 bg-primary/10 p-1 text-primary dark:bg-slate-700/50 dark:text-slate-300 px-2 ml-1 rounded-sm hover:bg-primary/30 cursor-pointer">
                                <Pencil size={18} />
                            </button>
                        </div>
                    </div>
                ))}
            </div>}

            <div
                className={`fixed top-0 right-0 h-full md:w-7/12 bg-white dark:bg-slate-800 shadow-2xl z-50 
                    transform transition-transform duration-500 ease-in-out 
                    ${isOpenTransitionRight ? 'translate-x-0' : 'translate-x-full'
                }`}
            >
                {isOpenProfileInfo && <PatientProfile setIsOpen={openProfileInfo} customer={customer!} setIsOpenTransition={openClinicalAssessment} openSessionTreatmentPlan={openSessionTreatmentPlan} />}
                {isOpenCreateOrEdit && <PatientCreate setIsOpen={openCreate} customerParam={customer!} reload={loadCustomers} />}
            </div>
            <div
                className={`fixed top-0 right-0 h-full md:w-7/12 bg-white dark:bg-slate-800 shadow-2xl z-51 
                    transform transition-transform duration-500 ease-in-out 
                    ${isOpenTransition ? 'translate-x-0' : 'translate-x-full'
                }`}
            >
                {customer && isOpenSession && <ClinicalAssessment setIsOpen={openClinicalAssessment} customer={customer} />}
                {customer && isOpenSessionPlan && <TreatmentEvolution setIsOpen={openClinicalAssessment} customer={customer} />}
            </div>
        </PageComponent>
    )
}