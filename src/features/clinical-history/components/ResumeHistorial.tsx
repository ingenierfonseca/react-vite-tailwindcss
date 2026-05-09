import LabelBadge from "@/components/commons/LabelBadge";
import ProgressComponent from "@/components/commons/ProgressComponent";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Calendar, Check, CheckCircle2Icon, Clock } from "lucide-react";
import { SkeletonIndicatorLoader } from "./SkeletonComponent";

const treatmentPlan = [
    {
        treatment: "Diagnóstico y planificación",
        status: "Completo"
    },
    {
        treatment: "Colocación de aparatologia",
        status: "Completo"
    },
    {
        treatment: "Alineación y nivelación",
        status: "En proceso"
    },
    {
        treatment: "Cierre de espacios",
        status: "Pendiente"
    },
    {
        treatment: "Detalle y acabado",
        status: "Pendiente"
    },
    {
        treatment: "Detención",
        status: "Pendiente"
    }
]

const notes = [
    {
        date: "15/05/2026",
        dr: "Dra. Melissa Fonseca",
        note: "Paciente presenta buena evolucion. Continuar con elasticos intermaxilares"
    },
    {
        date: "20/03/2026",
        dr: "Dra. Melissa Fonseca",
        note: "Ajuste de arco. Se cambia a alambre NiTi0.016."
    }
]
export default function ResumeHistorial() {
    const loading = true
    return (
        <div className="flex flex-col gap-4">
            <div className="grid grid-cols-[repeat(auto-fit,minmax(400px,1fr))] gap-4">
                {/* Progress */}
                <Card className="col-span-full md:col-span-1">
                    <CardContent className="p-4 space-y-4">
                        <div className="flex items-center justify-between">
                            <h2 className="text-lg font-medium dark:text-slate-200">Progreso del tratamiento</h2>
                        </div>
                        <div className="flex gap-3 md:gap-10">
                            <ProgressComponent size={150} sizeText={30} value={65} label={"Completado"} />
                            <div className="w-full flex flex-col gap-3">
                                <div className="flex">
                                    <div className="flex-1">
                                        <p className="dark:text-slate-400">Tiempo transcurrido</p>
                                        <p className="text-md font-medium text-black md:text-lg dark:text-slate-200">16 meses</p>
                                    </div>
                                    <div className="flex-1">
                                        <p className="dark:text-slate-400">Tiempo estimado</p>
                                        <p className="text-md md:text-lg font-medium text-black dark:text-slate-200">24 meses</p>
                                    </div>
                                </div>
                                <div>
                                    <p className="dark:text-slate-400">Siguiente objetivo</p>
                                    <p className="text-md font-medium text-black dark:text-slate-200">Alineación y nivelación</p>
                                </div>
                                <div className="flex flex-col">
                                    <p className="text-md font-medium text-black dark:text-slate-200">Etapa actual: Alineación</p>
                                    <Progress value={65} />
                                    <p className="ml-auto dark:text-slate-400">3 de 6 etapas completadas</p>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Evloution */}
                <Card className="col-span-2">
                    <CardContent className="p-4 space-y-4">
                        <div className="flex items-center justify-between">
                            <h2 className="text-lg font-medium dark:text-slate-200">Evolución del tratamiento</h2>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                            {[1, 2, 3, 4].map((i) => (
                                <div key={i} className="rounded-xl overflow-hidden border">
                                    <img
                                        src={`https://i.pravatar.cc/150/?teeth,${i}`}
                                        alt="evolucion"
                                        className="w-full h-32 object-cover"
                                    />
                                    <div className="p-2 text-xs text-center">Mes {i * 4}</div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>

            <div className="grid grid-cols-[repeat(auto-fit,minmax(350px,1fr))] gap-4">
                {/* Next Appointment */}
                <Card>
                    <CardContent className="p-4 space-y-4">
                        <div className="flex items-center justify-between">
                            <h2 className="text-lg font-medium dark:text-slate-200">Próxima cita</h2>
                        </div>
                        <div className="flex gap-3">
                            <Calendar className="text-primary p-2.5 rounded-full bg-primary/10" size={60} />
                            <div>
                                <p className="text-sm text-black dark:text-muted-foreground font-medium">Miercoles, 28 de Mayo 2026</p>
                                <div className="flex gap-4 items-center">
                                    <p className="font-medium text-2xl dark:text-slate-200">10:00 AM</p>
                                    <LabelBadge label="Confirmada" className="text-green-600 bg-green-400/10" />
                                </div>
                                <p className="mt-3 dark:text-slate-300 font-medium">Revisión y ajuste</p>
                                <p className="dark:text-slate-400">Consultorio 2 . Dra. Melissa Fonseca</p>
                            </div>
                        </div>
                    
                    </CardContent>
                </Card>

                {/* Treatment plan */}
                <Card>
                    <CardContent className="p-4 space-y-4">
                        <div className="flex items-center justify-between">
                            <h2 className="text-lg font-medium dark:text-slate-200">Plan de tratamiento</h2>
                        </div>
                        <div className="flex flex-col gap-2">
                            {treatmentPlan.map((plan, index) => {
                                const style = STATUS_STYLES[plan.status] || STATUS_STYLES["Default"];
                                const isComplete = plan.status === "Completo";
                                const isInProcess = plan.status === "En proceso";

                                return (
                                <div key={index} className="flex justify-between items-center gap-4">
                                    <div className="flex items-center gap-2">
                                        <div className={`rounded-full ${isComplete ? `${style.bg} ${style.text}` : "bg-primary"}`}>
                                            {isComplete && <Check />}
                                            {isInProcess && <p className="h-5 w-5 flex justify-center text-slate-200">{index}</p>}
                                            {plan.status === "Pendiente" && <p className="h-5 w-5 flex justify-center bg-white border border-slate-400 rounded-full"></p>}
                                        </div>
                                        <p className={`${isInProcess ? "text-primary dark:text-slate-200" : "dark:text-slate-400"}`}>{index}. {plan.treatment}</p>
                                    </div>

                                    
                                    <LabelBadge
                                        label={plan.status} 
                                        className={`${style.badgeText} ${style.bg} dark:bg-primary-dark/10`} 
                                    />
                                </div>
                                )
                            })}
                        </div>
                    
                    </CardContent>
                </Card>

                {/* Treatment plan */}
                <Card>
                    <CardContent className="p-4 space-y-4">
                        <div className="flex items-center justify-between">
                            <h2 className="text-lg font-medium dark:text-slate-200">Historial de pagos</h2>
                        </div>
                        <div className="flex flex-col gap-4">
                            <div className="flex justify-between">
                                <p className="dark:text-slate-400">Total del tratamiento</p>
                                <p className="text-black dark:text-slate-200 font-medium">$2,800.00</p>
                            </div>
                            <div className="flex justify-between">
                                <p className="dark:text-slate-400">Pagado</p>
                                <p className="text-green-500 dark:text-green-400 font-medium">$1,680.00</p>
                            </div>
                            <div className="flex justify-between">
                                <p className="font-medium dark:text-slate-200">Pendiente</p>
                                <p className="text-red-500 dark:text-green-400 font-medium">$1,120.00</p>
                            </div>
                            <Progress defaultValue="bg-green-500" value={65} />
                        </div>
                    </CardContent>
                </Card>
            </div>

            <div className="grid grid-cols-[repeat(auto-fit,minmax(380px,1fr))] gap-4">
                {/* Next Appointment */}
                <Card>
                    <CardContent className="p-4 space-y-4">
                        <div className="flex items-center justify-between">
                            <h2 className="text-lg font-medium dark:text-slate-200">Próxima cita</h2>
                        </div>
                        <div className="flex gap-3">
                            <Calendar className="text-primary p-2.5 rounded-full bg-primary/10" size={60} />
                            <div>
                                <p className="text-sm text-black dark:text-muted-foreground font-medium">Miercoles, 28 de Mayo 2026</p>
                                <div className="flex gap-4 items-center">
                                    <p className="font-medium text-2xl dark:text-slate-200">10:00 AM</p>
                                    <LabelBadge label="Confirmada" className="text-green-600 bg-green-400/10" />
                                </div>
                                <p className="mt-3 dark:text-slate-300 font-medium">Revisión y ajuste</p>
                                <p className="dark:text-slate-400">Consultorio 2 . Dra. Melissa Fonseca</p>
                            </div>
                        </div>
                    
                    </CardContent>
                </Card>

                {/* Recent Notes */}
                <Card>
                    <CardContent className="p-4 space-y-4">
                        <div className="flex items-center justify-between">
                            <h2 className="text-lg font-medium dark:text-slate-200">Notas recientes</h2>
                        </div>
                        <div className="flex flex-col gap-2">
                            {notes.map((note, index) => (
                                <div key={index} className="flex flex-col gap-2 mt-3">
                                    <div className="flex items-center gap-2 text-slate-600">
                                        <p className={``}>{note.date}</p>
                                        <p>{note.dr}</p>
                                    </div>
                                    <p>{note.note}</p>
                                </div>
                            ))}
                        </div>
                    
                    </CardContent>
                </Card>

                {/* Indicator */}
                <Card>
                    {!loading && <CardContent className="p-4 space-y-4">
                        <div className="flex items-center justify-between">
                            <h2 className="text-lg font-medium dark:text-slate-200">Indicadores</h2>
                        </div>
                        <div className="flex gap-4">
                            <div className="flex-1 flex flex-col justify-center items-center border border-slate-300 rounded-lg p-2 gap-3">
                                <div className="flex justify-center items-center bg-primary/10 p-4 w-20 h-20 rounded-full">
                                    <Calendar className="text-primary" size={35} />
                                </div>
                                <p className="font-bold text-4xl dark:text-slate-200">16</p>
                                <p className="text-lg text-black dark:text-slate-200 font-medium">Citas completadas</p>
                                <p>de 24 programadas</p>
                            </div>
                            <div className="flex-1 flex flex-col justify-center items-center border border-slate-300 rounded-lg p-2 gap-3">
                                <div className="flex justify-center items-center bg-green-400/10 p-4 w-20 h-20 rounded-full">
                                    <CheckCircle2Icon className="text-green-500" size={35} />
                                </div>
                                <p className="font-bold text-4xl dark:text-slate-200">16</p>
                                <p className="text-lg text-black dark:text-slate-200 font-medium">Citas asistidas</p>
                                <p>de 24 programadas</p>
                            </div>
                            <div className="flex-1 flex flex-col justify-center items-center border border-slate-300 rounded-lg p-2 gap-3">
                                <div className="flex justify-center items-center bg-yellow-400/10 p-4 w-20 h-20 rounded-full">
                                    <Clock className="text-yellow-500" size={35} />
                                </div>
                                <p className="font-bold text-4xl dark:text-slate-200">16</p>
                                <p className="text-lg text-black dark:text-slate-200 font-medium">Citas completadas</p>
                                <p>de 24 programadas</p>
                            </div>
                        </div>
                    </CardContent>}
                    {loading && <SkeletonIndicatorLoader />}
                </Card>
            </div>
        </div>
    )
}

interface StatusStyle {
  text: string;
  bg: string;
  badgeText: string;
}

const STATUS_STYLES: Record<string, StatusStyle> = {
  "Completo": {
    text: "text-green-600",
    bg: "bg-green-400/10",
    badgeText: "text-green-500"
  },
  "En proceso": {
    text: "text-primary",
    bg: "bg-primary/10",
    badgeText: "text-primary dark:text-slate-200"
  },
  "Default": {
    text: "text-slate-500",
    bg: "bg-slate-400/10",
    badgeText: "text-slate-500"
  }
};