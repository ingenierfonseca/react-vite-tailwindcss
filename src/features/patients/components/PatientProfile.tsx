import { Car } from "lucide-react";
import type { Customer } from "../../../services/customer/customer.type";
import { calculateAgeFromString } from "../../../utils/date.util";
import CardInfo from "./CardInfo";

const customer: Customer = {
    id: 1,
    firstName: "Emma",
    lastName: "Jhonson",
    email: "emma.jhonson@example.com",
    phone: "123-456-7890",
    address: "123 Main St, Anytown, USA",
    dateOfBirth: "1990-01-01",
    gender: "Female"
    /*medicalHistory: "No known allergies. Previous surgery in 2015.",
    medications: "None",
    emergencyContact: {
        name: "Jane Doe",
        phone: "987-654-3210",
    },*/
};
interface PatientProfileProps {
    isOpen: boolean;
    setIsOpen: (isOpen: boolean) => void;
}

export default function PatientProfile({ isOpen, setIsOpen }: PatientProfileProps) {
    return (
        <div className="w-full/2 h-screen py-5 px-4">
            <p className="font-semibold text-black dark:text-white">Perfil del Paciente</p>
            <div className="flex mt-2 gap-2">
                {customer.avatarUrl ? (
                    <img 
                        src={customer.avatarUrl}
                        alt={`${customer.firstName} ${customer.lastName}`}
                        className="w-16 h-16 rounded-full object-cover"
                    />
                ) : (
                    <div className="flex-1 aspect-square bg-gray-300 rounded-md flex items-center justify-center">
                        <span className="text-9xl text-gray-600 font-bold">
                            {customer.firstName.charAt(0)}{customer.lastName.charAt(0)}
                        </span>
                    </div>
                )}
                <div className="flex-1">
                    <div>
                        <p className="font-medium text-black dark:text-white">
                            {customer.firstName} {customer.lastName}
                        </p>
                        <p className="text-sm">Edad: {calculateAgeFromString(customer.dateOfBirth)}</p>
                        <p className="text-sm">Tel: {customer.phone}</p>
                        <p className="text-sm">Email: {customer.email}</p>
                    </div>
                </div>
            </div>

            <div className="flex gap-4">
                <CardInfo 
                    title="Missed Visit Risk"
                    description="2 citas perdidas en 6 meses"
                    info="AI Confidence: 85%"
                    icon={<Car className="w-6 h-6" />}
                    riskLevel="medium"
                />
                <CardInfo
                    title="Payment Risk"
                    description="Excelent payment history"
                    info="Last updated: 12/12/2023"
                    icon={<Car className="w-6 h-6" />}
                    riskLevel="low"
                />
            </div>

            <div className="mt-4 rounded-md p-2 border dark:border-slate-300">
                <p className="font-semibold text-black dark:text-white">Treatment history</p>
                <div className="flex mt-4 p-2 rounded-md dark:bg-slate-700">
                    <div className="w-10 h-10 p-2 rounded-full dark:bg-slate-300 flex items-center justify-center">
                        <p>MF</p>
                    </div>
                    <div className="mx-2">
                        <p className="text-sm text-black dark:text-white">Rutina de Limpieza y Examinacion</p>
                        <p className="text-xs">Dra. Melissa Fonseca</p>
                        <p className="text-xs">Excelent oral igiene, No cavities detected. Recomended 6-month follow-up.</p>
                    </div>
                    <div className="mr-auto">
                        <p className="text-xs text-gray-500">12/12/2023</p>
                    </div>
                </div>
            </div>
            <button 
              onClick={() => setIsOpen(false)}
              className="text-slate-500 hover:text-red-500 text-2xl"
            >
              &times;
            </button>
        </div>
    )
}