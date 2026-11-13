import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import CardInfo from "@/features/clients/presentation/components/CardInfo";
import ItemList from "@/features/clients/presentation/components/ItemList";
import { usePermissions } from "@/hooks/usePermissions";
import { PermissionAction, PermissionResource } from "@/models/permission.enum";
import { formatDateToMMDameDDYYYY } from "@/utils/date.util";
import { ChevronRight, Clock, FileText, ShieldCheck } from "lucide-react";
import { useNavigate } from "react-router";
import { usePatientProfileData, type PatientProfileData } from "../hooks/usePatientProfileData.ts";

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

interface PatientInfoProps {
    patientId: number;
    getProfile: (patientId: number) => Promise<PatientProfileData>;
    onStartConsultation: () => void,
    onClose: () => void,
    selectedClient: () => void
}
export default function PatientInfo({ patientId, getProfile, onStartConsultation, onClose, selectedClient }: PatientInfoProps) {
    const { can } = usePermissions();
    const navigate = useNavigate();
    const { risks, treatmentHistory, consultationHistory, loading, error } = usePatientProfileData(
        patientId,
        getProfile,
    );

    return (
        <div>
            {loading && <p className="mt-4 text-sm text-slate-500">Cargando información del perfil…</p>}
            {error && <p role="alert" className="mt-4 text-sm text-red-600">{error}</p>}
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
                        {!loading && treatmentHistory.length === 0 ? (
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
                                    onClick={() => can(PermissionAction.View, PermissionResource.PatientsTreatmentPlans) && navigate(`/patients/${patientId}/treatment-plan/${treatment.id}`)}
                                />
                            )))}

                        <div className="flex mt-5">
                            <p className="text-lg font-semibold text-black dark:text-white">Historial de consultas</p>
                            <div className="flex ml-auto gap-2 text-primary">
                                <p>Ver todos</p>
                                <ChevronRight />
                            </div>
                        </div>
                        {!loading && consultationHistory.length === 0 ? (
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
                                    onClick={() => can(PermissionAction.View, PermissionResource.ConsultationHistory) && navigate(`/patients/${patientId}/consultation-history/${consultation.id}`)}
                                />
                            )))}
                    </TabsContent>
                </Tabs>
            </div>

            <div className="mt-4 rounded-md p-3 border border-slate-300 bg-slate-50/50 dark:border-slate-300">
                <p className="font-semibold text-black dark:text-white">Acciones Rapidas</p>
                <div className="grid grid-cols-[repeat(auto-fit,minmax(300px,1fr))] gap-4 mt-4">
                    {can(PermissionAction.Create, PermissionResource.Appointments) && (
                        <button className="flex-1 px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90">
                            Agendar Cita
                        </button>
                    )}
                    {can(PermissionAction.Create, PermissionResource.Appointments) && (
                        <button className="flex-1 px-4 py-2 border border-slate-300 text-black dark:text-white rounded-md hover:bg-slate-300 dark:hover:bg-slate-700"
                            onClick={() => {
                                onClose?.()
                                selectedClient()
                                onStartConsultation()
                            }}>
                            Iniciar Consulta
                        </button>
                    )}
                    {can(PermissionAction.Update, PermissionResource.Patients) && (
                        <button className="flex-1 px-4 py-2 border border-slate-300 text-black dark:text-white rounded-md hover:bg-slate-300 dark:hover:bg-slate-700"
                            onClick={() => {}}>
                            Actualizar Información
                        </button>
                    )}
                    {can(PermissionAction.View, PermissionResource.Invoice) && (
                        <button className="flex-1 px-4 py-2 border border-slate-300 text-black dark:text-white rounded-md hover:bg-slate-300 dark:hover:bg-slate-700"
                            onClick={() => navigate(`/invoice?customerId=${patientId}`)}>
                            Ver Facturas
                        </button>
                    )}
                </div>
            </div>
        </div>
    )
}
