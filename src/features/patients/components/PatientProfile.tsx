import { Car } from "lucide-react";
import type { Customer } from "../../../services/customer/customer.type";
import CardInfo from "./CardInfo";
import { ASSETS_URLS } from "../../../config/constants";
import PageRightComponent from "@/components/commons/PageRightComponent";
import { formatPhoneNumber } from "@/utils/number.util";
import { useEffect, useState } from "react";
import { SessionPlanService } from "@/services/session-plan/sessionPlan.service";
import type { SessionPlan } from "@/services/treatment-plan/treatmentPlan.type";
import { formatDateToMMDameDDYYYY } from "@/utils/date.util";
import { useNavigate } from "react-router";
import type { ClinicalSession } from "@/services/clinical-session/clinicalSession.type";
import { ClinicalSessionService } from "@/services/clinical-session/clinicalSession.service";

const cardinfo = [
    {
        title: "Missed Visit Risk",
        description: "2 citas perdidas en 6 meses",
        info: "AI Confidence: 85%",
        icon: <Car className="w-6 h-6" />,
        riskLevel: "medium"
    },
    {
        title: "Payment Risk",
        description: "Excelent payment history",
        info: "Last updated: 12/12/2023",
        icon: <Car className="w-6 h-6" />,
        riskLevel: "low"
    },
    {
        title: "Preventive Care",
        description: "Due for annual check-up",
        info: "Last check-up: 01/01/2023",
        icon: <Car className="w-6 h-6" />,
        riskLevel: "high"
    }
];
interface PatientProfileProps {
    customer: Customer;
    setIsOpen: (value: boolean) => void;
    setIsOpenTransition: (value: boolean) => void;
}

export default function PatientProfile({ customer, setIsOpen, setIsOpenTransition }: PatientProfileProps) {
    const [treatmentHistory, setTreatmentHistory] = useState<SessionPlan[]>([])
    const [consultationHistory, setConsultationHistory] = useState<ClinicalSession[]>([])
    const navigate = useNavigate();

    useEffect(() => {
        SessionPlanService.getTreatmentHistory(customer.id)
            .then((response) => {
                setTreatmentHistory(response)
            })
            .catch((error) => {
                console.error("Error fetching treatment history:", error);
            });
        ClinicalSessionService.getSessionHistory(customer.id)
            .then((response) => {
                setConsultationHistory(response)
            })
            .catch((error) => {
                console.error("Error fetching consultation history:", error);
            });
    }, [customer.id])

    return (
        <PageRightComponent
            title={"Perfil del Paciente"}
            onClick={() => setIsOpen(false)}>
            <div className="flex mt-2 gap-2">
                {customer.avatar && !customer.avatar.includes('null') ? (
                    <img
                        src={`${ASSETS_URLS.avatars}/${customer.avatar}`}
                        alt={`${customer.firstName} ${customer.lastName}`}
                        className="w-1/2 h-1/2 rounded-md object-cover"
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
                        <p className="text-lg font-medium text-black dark:text-white">
                            {customer.firstName} {customer.lastName}
                        </p>
                        <p className="dark:text-slate-400">Id: {customer.dni}</p>
                        <p className="dark:text-slate-400">Edad: {customer.age} {customer.age > 1 ? 'años' : 'año'}</p>
                        <p className="dark:text-slate-400">Tel: {formatPhoneNumber(customer.phone)}</p>
                        <p className="dark:text-slate-400">Email: {customer.email}</p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-[repeat(auto-fit,minmax(300px,1fr))] gap-4 w-full mt-4">
                {cardinfo.map((info, index) => (
                    <CardInfo
                        key={index}
                        title={info.title}
                        description={info.description}
                        info={info.info}
                        icon={info.icon}
                        riskLevel={info.riskLevel as 'low' | 'medium' | 'high'}
                    />
                ))}
            </div>

            <div className="mt-4 rounded-md p-2 border dark:border-slate-300">
                <p className="font-semibold text-black dark:text-white">Historial de tratamientos</p>
                {treatmentHistory.length === 0 ? (
                    <p className="text-sm text-gray-500 mt-2">No hay historial de tratamientos disponible.</p>
                ) : (
                treatmentHistory.map((treatment) => (
                    <div key={treatment.id}
                        className="flex mt-4 p-2 rounded-md bg-slate-100 dark:bg-slate-900 cursor-pointer dark:hover:bg-slate-700 hover:bg-slate-200 transition-colors"
                        onClick={() => navigate(`/patients/${customer.id}/treatment-plan/${treatment.id}`)}>
                        <div className="w-10 h-10 p-2 rounded-full dark:bg-slate-300 flex items-center justify-center">
                            <p>MF</p>
                        </div>
                        <div className="mx-2">
                            <p className="text-sm text-black dark:text-white">{treatment.name}</p>
                            <p className="text-xs dark:text-slate-300">Dra. Melissa Fonseca</p>
                            <p className="text-xs dark:text-slate-400">{treatment.comments}</p>
                        </div>
                        <div className="ml-auto">
                            <p className="text-xs text-gray-500 dark:text-slate-400">{formatDateToMMDameDDYYYY(treatment.startDate)}</p>
                        </div>
                    </div>
                )))}
            </div>

            <div className="mt-4 rounded-md p-2 border dark:border-slate-300">
                <p className="font-semibold text-black dark:text-white">Historial de consultas</p>
                {consultationHistory.length === 0 ? (
                    <p className="text-sm text-gray-500 mt-2">No hay historial de consultas disponible.</p>
                ) : (
                consultationHistory.map((consultation) => (
                    <div key={consultation.id}
                        className="flex mt-4 p-2 rounded-md bg-slate-100 dark:bg-slate-900 cursor-pointer dark:hover:bg-slate-700 hover:bg-slate-200 transition-colors"
                        onClick={() => navigate(`/patients/${customer.id}/consultation-history/${consultation.id}`)}>
                        <div className="w-10 h-10 p-2 rounded-full dark:bg-slate-300 flex items-center justify-center">
                            <p>MF</p>
                        </div>
                        <div className="mx-2">
                            <p className="text-sm text-black dark:text-white">{consultation.reasonForVisit}</p>
                            <p className="text-xs dark:text-slate-300">Dra. Melissa Fonseca</p>
                            <p className="text-xs dark:text-slate-400">{consultation.clinicalNotes}</p>
                        </div>
                        <div className="ml-auto">
                            <p className="text-xs text-gray-500 dark:text-slate-400">{formatDateToMMDameDDYYYY(consultation.date)}</p>
                        </div>
                    </div>
                )))}
            </div>

            <div className="mt-4 rounded-md p-2 border dark:border-slate-300">
                <p className="font-semibold text-black dark:text-white">Acciones Rapidas</p>
                <div className="grid grid-cols-[repeat(auto-fit,minmax(300px,1fr))] gap-4 mt-4">
                    <button className="flex-1 px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90">Agendar Cita</button>
                    <button className="flex-1 px-4 py-2 border border-slate-300 text-black dark:text-white rounded-md hover:bg-slate-300 dark:hover:bg-slate-700" onClick={() => setIsOpenTransition(true)}>Iniciar Consulta</button>
                    <button className="flex-1 px-4 py-2 border border-slate-300 text-black dark:text-white rounded-md hover:bg-slate-300 dark:hover:bg-slate-700">Actualizar Información</button>
                    <button className="flex-1 px-4 py-2 border border-slate-300 text-black dark:text-white rounded-md hover:bg-slate-300 dark:hover:bg-slate-700">Ver Facturas</button>
                </div>
            </div>
        </PageRightComponent>
    )
}