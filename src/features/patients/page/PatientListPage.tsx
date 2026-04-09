import { Calendar, PencilLine, User } from "lucide-react"
import { PaginatedAutocomplete } from "../../../components/commons/PaginatedAutocomplete"
import { CustomerService } from "../../../services/customer/customer.service"
import DashboardCard from "../../../components/dashboard/DashboardCard"
import PatientProfile from "../components/PatientProfile"
import { useState } from "react"
import PatientCreate from "../components/PatientCreateEdit"
import { usePatient } from "../hooks/patient.hook"
import AvatarInfo from "../../../components/commons/AvatarInfo"
import PageComponent from "../../../components/commons/PageComponent"

const headers = [
    'Paciente', 'Edad', /*'Last Visit', 'Next Appointment', 'Balance Due',*/ 'Acciones'
]
export default function PatientListPage() {
    const { data, dashboardData, customer, setCustomer, loadCustomers, search, setSearch } = usePatient()
    const [isOpenTransitionRight, setIsOpenTransitionRight] = useState(false)
    const [isOpenProfileInfo, setIsOpenProfileInfo] = useState(false)
    const [isOpenCreateOrEdit, setIsOpenCreateOrEdit] = useState(false)

    function openProfileInfo(value: boolean) {
        if (value) {
            setIsOpenTransitionRight(value)
            setIsOpenProfileInfo(value)
        } else {
            setIsOpenTransitionRight(false)
            setTimeout(() => {                setIsOpenProfileInfo(false)
            }, 500);
        }
    }
    function openCreate(value: boolean) {
        if (value) {
        setIsOpenTransitionRight(value)
        setIsOpenCreateOrEdit(value)
        } else {
            setIsOpenTransitionRight(false)
            setTimeout(() => {
                setIsOpenCreateOrEdit(false)
            }, 500);
        }
    }
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
            </div>

            <div className="mt-4 bg-white dark:bg-slate-800 rounded-lg shadow-md p-4">
                <PaginatedAutocomplete
                    label="Paciente"
                    value={search}
                    onChange={(value) => setSearch(data?.data.find(c => c?.id === value)?.firstName || '')}
                    fetchData={CustomerService.getAllCustomers}
                    getValue={(item) => item.id}
                    getLabel={(item) => `${item.firstName.trim()} ${item.lastName.trim()}`}
                />
            </div>

            {data && data.data && 
            <div className="mt-4 bg-white dark:bg-slate-800 rounded-lg shadow-md">
                <div className="flex gap-4 mt-4 px-4 pt-4 bg-slate-100 dark:bg-slate-700/50">
                    {headers.map((header) => (
                        <div key={header} className={`
                            ${header === 'Paciente' ? 'flex-2' : ''}
                            ${header === 'Edad' ? 'flex-1 hidden md:block' : ''}
                            ${header === 'Acciones' ? 'flex-1 text-right' : ''} font-semibold text-slate-700 dark:text-slate-100`}>
                            {header}
                        </div>
                    ))}
                </div>
                {data.data.map((patient) => (
                    <div key={patient!.id} className="flex gap-4 pt-4 px-4 text-slate-700 dark:text-slate-300 border-b border-slate-300 hover:bg-slate-100 dark:hover:bg-slate-600">
                        <AvatarInfo
                            className="flex-2"
                            avatar={patient!.avatar}
                            name={patient!.firstName + " " + patient!.lastName}
                            description={`Tel: ${patient!.phone}`}
                            onClick={() => {
                                setCustomer(patient)
                                openProfileInfo(true)
                            }}
                        />
                        <div className="flex-1 hidden md:block">{patient!.age}</div>
                        {/*<div className="flex-1">{formatDateDDMMYYYY(patient!.lastVisit)}</div>
                    <div className="flex-1">{formatDateDDMMYYYY(patient!.nextAppointment)}</div>
                    <div className="flex-1">${patient!.balanceDue.toFixed(2)}</div>*/}
                        <div className="flex-1 flex justify-end items-center gap-2">
                            <button className="bg-primary/20 p-1 text-primary px-2 rounded-sm hover:bg-primary/30">
                                <Calendar />
                            </button>
                            <button
                                onClick={() => {
                                    setCustomer(patient)
                                    openCreate(true)
                                }}
                                className="bg-primary/20 p-1 text-primary px-2 ml-1 rounded-sm hover:bg-primary/30">
                                <PencilLine />
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
                {isOpenProfileInfo && <PatientProfile setIsOpen={openProfileInfo} customer={customer!} />}
                {isOpenCreateOrEdit && <PatientCreate setIsOpen={openCreate} customerParam={customer!} reload={loadCustomers} />}
            </div>
        </PageComponent>
    )
}