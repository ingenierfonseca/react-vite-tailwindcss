import { Calendar, PencilLine, User } from "lucide-react"
import AddButtonApp from "../../../components/commons/AddButtonApp"
import type { CustomerFormData } from "../../../services/customer/customer.type"
import { calculateAgeFromString } from "../../../utils/date.util"
import { PaginatedAutocomplete } from "../../../components/commons/PaginatedAutocomplete"
import { CustomerService } from "../../../services/customer/customer.service"
import DashboardCard from "../../../components/dashboard/DashboardCard"
import PatientProfile from "../components/PatientProfile"
import { useState } from "react"
import PatientCreate from "../components/PatientCreateEdit"

const patients: CustomerFormData[] = [
    {
        id: 1,
        firstName: 'Emma',
        lastName: 'Johnson',
        dateOfBirth: '1990-05-15',
        lastVisit: '2024-05-15',
        nextAppointment: '2024-06-20',
        balanceDue: 150.00,
        phone: '8611234567',
        email: 'emma.johnson@example.com',
        address: '123 Main St, City, State',
        gender: 'Female'
    },
    {
        id: 2,
        firstName: ' Liam',
        lastName: 'Williams',
        dateOfBirth: '1985-12-10',
        lastVisit: '2024-05-10',
        nextAppointment: '2024-06-15',
        balanceDue: 200.00,
        phone: '8611234567',
        email: 'liam.williams@example.com',
        address: '456 Oak Ave, City, State',
        gender: 'Male'
    }
]

const headers = [
    'Patient', 'Age', 'Last Visit', 'Next Appointment', 'Balance Due', 'Actions'
]
export default function PatientListPage() {
    const [isOpenTransitionRight, setIsOpenTransitionRight] = useState(false)
    const [isOpenProfileInfo, setIsOpenProfileInfo] = useState(false)
    const [isOpenCreateOrEdit, setIsOpenCreateOrEdit] = useState(false)

    function openProfileInfo(value: boolean) {
        setIsOpenTransitionRight(value)
        setIsOpenProfileInfo(value)
    }
    function openCreate(value: boolean) {
        setIsOpenTransitionRight(value)
        setIsOpenCreateOrEdit(value)
    }
    return (
        <div className="relative min-h-screen p-4 bg-white dark:bg-slate-900">
            <div className="flex">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Patient Management</h1>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Manage your patients and their information.</p>
                </div>
                <div className="ml-auto">
                    <AddButtonApp onclick={()=> openCreate(true)} label="Agregar Nuevo Paciente" />
                </div>
            </div>

            <div className="flex gap-8">
                <DashboardCard stat={{
                    title: "Total Patients",
                    value: "1,247",
                    change: "5%",
                    trend: "up",
                    bgColor: "bg-blue-100/80",
                    textColor: "text-blue-500",
                    color: "from-blue-400 to-blue-600",
                    icon: User
                }} />
                <DashboardCard stat={{
                    title: "Active Patients",
                    value: "892",
                    change: "5%",
                    trend: "up",
                    bgColor: "bg-emerald-100/80",
                    textColor: "text-emerald-500",
                    color: "from-emerald-400 to-emerald-600",
                    icon: User
                }} />
            </div>

            <div className="mt-4 bg-white dark:bg-slate-800 rounded-lg shadow-md p-4">
                <PaginatedAutocomplete
                    label="Paciente"
                    value={0}
                    onChange={(value) => alert(value)
                        //updateField("customerId", value)
                    }
                    fetchData={CustomerService.getAllCustomers}
                    getValue={(item) => item.id}
                    getLabel={(item) => `${item.firstName.trim()} ${item.lastName.trim()}`}
                />
            </div>

            <div className="mt-4 bg-white dark:bg-slate-800 rounded-lg shadow-md">
            <div className="flex gap-4 mt-4 px-4 pt-4 bg-slate-100 dark:bg-slate-700/50">
                {headers.map((header) => (
                    <div key={header} className={`${header === 'Patient' ? 'flex-2' : 'flex-1'} font-semibold text-slate-700 dark:text-slate-100`}>
                        {header}
                    </div>
                ))}
            </div>
            {patients.map((patient) => (
                <div key={patient.id} className="flex gap-4 pt-4 px-4 text-slate-700 dark:text-slate-300 border-b border-slate-300 hover:bg-slate-100 dark:hover:bg-slate-600">

                    <button
                        className="flex-2 flex items-center cursor-pointer"
                        onClick={() => openProfileInfo(true)}
                    >
                        {patient.avatarUrl ? (
                            <img src={patient.avatarUrl} alt={`${patient.firstName} ${patient.lastName}`} className="w-10 h-10 rounded-full" />
                        ) : (
                            <div className="w-10 h-10 rounded-full p-2 bg-slate-300 flex items-center justify-center">
                                <User className="w-5 h-5 text-slate-600" />
                            </div>
                        )}
                        <div className="ml-4">
                            <p className="font-semibold">
                                {patient.firstName} {patient.lastName}
                            </p>
                            <p className="dark:text-slate-400">Tel: {patient.phone}</p>
                        </div>
                    </button>
                    <div className="flex-1">{calculateAgeFromString(patient.dateOfBirth)}</div>
                    <div className="flex-1">{patient.lastVisit}</div>
                    <div className="flex-1">{patient.nextAppointment}</div>
                    <div className="flex-1">${patient.balanceDue.toFixed(2)}</div>
                    <div className="flex-1">
                        <button className="text-white px-3">
                            <Calendar />
                        </button>
                        <button className="text-white px-3">
                            <PencilLine />
                        </button>
                    </div>
                </div>
            ))}
            </div>

            <div
                className={`fixed top-0 right-0 h-full w-7/12 bg-white dark:bg-slate-800 shadow-2xl z-50 
                transform transition-transform duration-500 ease-in-out ${isOpenTransitionRight ? 'translate-x-0' : 'translate-x-full'
                }`}
            >
                {isOpenProfileInfo && <PatientProfile setIsOpen={openProfileInfo} />}
                {isOpenCreateOrEdit && <PatientCreate setIsOpen={openCreate} />}
            </div>
        </div>
    )
}