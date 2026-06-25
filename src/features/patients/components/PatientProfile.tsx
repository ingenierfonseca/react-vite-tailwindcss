import { Calendar, ChevronRight, Clock, FileText, IdCard, Mail, Phone, ShieldCheck, User } from "lucide-react";
import type { Customer, CustomerRiskDashboard } from "../../../services/customer/customer.type";
import CardInfo from "./CardInfo";
import { ASSETS_URLS } from "../../../config/constants";
import PageRightComponent from "@/components/commons/PageRightComponent";
import { formatPhoneNumber } from "@/utils/number.util";
import { useEffect, useState } from "react";
import { SessionPlanService } from "@/services/session-plan/sessionPlan.service";
import type { SessionPlan } from "@/services/treatment-plan/treatmentPlan.type";
import { formatDateToMMDameDDYYYY, calculateAgeFromString } from "@/utils/date.util";
import { useNavigate } from "react-router";
import type { ClinicalSession } from "@/services/clinical-session/clinicalSession.type";
import { ClinicalSessionService } from "@/services/clinical-session/clinicalSession.service";
import { usePermissions } from "../../../hooks/usePermissions";
import { PermissionAction, PermissionResource } from "../../../models/permission.enum";
import { CustomerService } from "@/services/customer/customer.service";
import CustomerItemInfo from "./ItemInfo";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ItemList from "./ItemList";
import QuickAppointmentCreate from "../../appointments/components/QuickAppointmentCreate";

const tabs = [
    {
        value: "history",
        label: "Historial",
        icon: <Clock />
    },
    {
        value: "additionalInfo",
        label: "Información adicional",
        icon: <FileText />
    },
]
interface PatientProfileProps {
    customer: Customer;
    setIsOpen: (value: boolean) => void;
    setIsOpenTransition: (value: boolean) => void;
    onEdit?: (value: boolean) => void;
}

export default function PatientProfile({ customer, setIsOpen, setIsOpenTransition, onEdit }: PatientProfileProps) {
    const { can } = usePermissions();
    const [treatmentHistory, setTreatmentHistory] = useState<SessionPlan[]>([])
    const [consultationHistory, setConsultationHistory] = useState<ClinicalSession[]>([])
    const [risks, setRisks] = useState<CustomerRiskDashboard[]>([])
    const [age] = useState(calculateAgeFromString(customer.birthDate))
    const navigate = useNavigate();
    const [isOpenQuickAppointment, setIsOpenQuickAppointment] = useState(false)

    useEffect(() => {
        CustomerService.getCustomerRisk(customer.id)
            .then((response) => {
                setRisks(response)
            })
            .catch((error) => {
                console.error("Error fetching treatment history:", error);
            });
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
            icon={
                <div className="p-2 bg-primary/5 text-primary rounded-lg">
                    <User />
                </div>
            }
            onClick={() => setIsOpen(false)}>
            <div className="flex mt-2 gap-8">
                {customer.avatar && !customer.avatar.includes('null') ? (
                    <img
                        src={`${ASSETS_URLS.avatars}/${customer.avatar}`}
                        alt={`${customer.firstName} ${customer.lastName}`}
                        className="w-90 h-1/2 rounded-md object-cover"
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
                        <p className="text-3xl font-medium mb-8 text-black dark:text-white">
                            {customer.firstName} {customer.lastName}
                        </p>
                        <CustomerItemInfo
                            title="ID del paciente"
                            value={customer.dni}
                            icon={<IdCard size={30} />} />
                        <CustomerItemInfo
                            title="Edad"
                            value={`${age} ${Number(age) > 1 ? "años" : "año"}`}
                            icon={<Calendar size={30} />} />
                        <CustomerItemInfo
                            title="Teléfono"
                            value={formatPhoneNumber(customer.phone)}
                            icon={<Phone size={30} />} />
                        <CustomerItemInfo
                            title="Email"
                            value={customer.email}
                            icon={<Mail size={30} />} />
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-[repeat(auto-fit,minmax(300px,1fr))] gap-4 w-full mt-4">
                {risks.map((info, index) => (
                    <CardInfo
                        key={index}
                        title={info.title}
                        description={info.description}
                        info=""
                        icon={<ShieldCheck className="w-6 h-6" />}
                        riskLevel={info.riskLevel.toLowerCase() as 'low' | 'medium' | 'high'}
                    />
                ))}
            </div>

            <div className="mt-4 rounded-md p-2 border border-slate-300 dark:border-slate-300">
                <Tabs defaultValue="history" className="w-full">
                    <TabsList className="w-full overflow-x-auto flex">
                        {tabs.map((tab, index) => (
                            <TabsTrigger key={index} value={tab.value} className={`
                                border-b-2 border-transparent
                                data-[state=active]:border-b-primary-dark
                                data-[state=active]:text-primary-dark
                            `}>
                                {tab.icon}{tab.label}
                            </TabsTrigger>
                        ))}
                    </TabsList>
                    <TabsContent value="history" className="p-3">
                        <div className="flex">
                            <p className="text-lg font-semibold text-black dark:text-white">Historial de tratamientos</p>
                            <div className="flex ml-auto gap-2 text-primary">
                                <p>Ver todos</p>
                                <ChevronRight />
                            </div>
                        </div>
                        {treatmentHistory.length === 0 ? (
                            <p className="text-sm text-gray-500 mt-2">No hay historial de tratamientos disponible.</p>
                        ) : (
                            treatmentHistory.map((treatment) => (
                                <ItemList
                                    key={treatment.id}
                                    className={can(PermissionAction.View, PermissionResource.PatientsTreatmentPlans) ? "cursor-pointer dark:hover:bg-slate-700 hover:bg-slate-50" : ""}
                                    title={treatment.name}
                                    subTitle=""
                                    content={treatment.comments}
                                    date={formatDateToMMDameDDYYYY(treatment.startDate)}
                                    onClick={() => can(PermissionAction.View, PermissionResource.PatientsTreatmentPlans) && navigate(`/patients/${customer.id}/treatment-plan/${treatment.id}`)}
                                />
                            )))}

                        <div className="flex mt-5">
                            <p className="text-lg font-semibold text-black dark:text-white">Historial de consultas</p>
                            <div className="flex ml-auto gap-2 text-primary">
                                <p>Ver todos</p>
                                <ChevronRight />
                            </div>
                        </div>
                        {consultationHistory.length === 0 ? (
                            <p className="text-sm text-gray-500 mt-2">No hay historial de consultas disponible.</p>
                        ) : (
                            consultationHistory.map((consultation) => (
                                <ItemList
                                    key={consultation.id}
                                    className={can(PermissionAction.View, PermissionResource.ConsultationHistory) ? "cursor-pointer dark:hover:bg-slate-700 hover:bg-slate-50" : ""}
                                    title=""
                                    subTitle=""
                                    content={consultation.reasonForVisit}
                                    date={formatDateToMMDameDDYYYY(consultation.date)}
                                    onClick={() => can(PermissionAction.View, PermissionResource.ConsultationHistory) && navigate(`/patients/${customer.id}/consultation-history/${consultation.id}`)}
                                />
                            )))}
                    </TabsContent>
                </Tabs>
            </div>

            <div className="mt-4 rounded-md p-3 border border-slate-300 bg-slate-50/50 dark:border-slate-300">
                <p className="font-semibold text-black dark:text-white">Acciones Rapidas</p>
                <div className="grid grid-cols-[repeat(auto-fit,minmax(300px,1fr))] gap-4 mt-4">
                    {can(PermissionAction.Create, PermissionResource.Appointments) && (
                        <button className="flex-1 px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90"
                            onClick={() => setIsOpenQuickAppointment(true)}>
                            Agendar Cita
                        </button>
                    )}
                    {can(PermissionAction.Create, PermissionResource.Appointments) && (
                        <button className="flex-1 px-4 py-2 border border-slate-300 text-black dark:text-white rounded-md hover:bg-slate-300 dark:hover:bg-slate-700"
                            onClick={() => setIsOpenTransition(true)}>
                            Iniciar Consulta
                        </button>
                    )}
                    {can(PermissionAction.Update, PermissionResource.Patients) && (
                        <button className="flex-1 px-4 py-2 border border-slate-300 text-black dark:text-white rounded-md hover:bg-slate-300 dark:hover:bg-slate-700"
                            onClick={() => onEdit?.(true)}>
                            Actualizar Información
                        </button>
                    )}
                    {can(PermissionAction.View, PermissionResource.Invoice) && (
                        <button className="flex-1 px-4 py-2 border border-slate-300 text-black dark:text-white rounded-md hover:bg-slate-300 dark:hover:bg-slate-700"
                            onClick={() => navigate(`/invoice?customerId=${customer.id}`)}>
                            Ver Facturas
                        </button>
                    )}
                </div>
            </div>

            {isOpenQuickAppointment && <QuickAppointmentCreate
                customer={customer}
                isOpen={isOpenQuickAppointment}
                setIsOpen={setIsOpenQuickAppointment}
            />}
        </PageRightComponent>
    )
}