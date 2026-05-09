
import type { SessionPlan, TreatmentPlanItem } from "@/services/treatment-plan/treatmentPlan.type";
import { formatNumber } from "@/utils/number.util";
import { TextField } from "@mui/material";
import dayjs from "dayjs";
import { BrickWall, Calendar, Clock, Play } from "lucide-react";
import ItemHeaderIcon from "./ItemHeaderIcon";
import LabelBadge from "@/components/commons/LabelBadge";

interface TreatmentEvolutionProps {
    sessionPlan: SessionPlan
    items: TreatmentPlanItem[]
}
export default function TreatmentEvolution({ sessionPlan, items }: TreatmentEvolutionProps) {
    const durationInMonths =
        sessionPlan.startDate && sessionPlan.endDate
            ? Math.round(dayjs(sessionPlan.endDate).diff(dayjs(sessionPlan.startDate), "month", true))
            : 0;
    return (
        <div className="p-4 flex flex-col">
            <p className="text-2xl font-medium dark:text-slate-200">Tratamiento en curso</p>
            <p className="dark:text-slate-400">Gestiona y da seguimiento al plan de tratamiento del paciente</p>

            <div className="flex gap-3 mt-3 p-2 dark:bg-slate-800/50">
                <ItemHeaderIcon className="flex-1" icon={Calendar} label="Tipo de tratamiento" value={sessionPlan?.name ?? 'Sin definir'} />
                <ItemHeaderIcon className="flex-1" icon={Clock} label="Duración estimada" value={`${durationInMonths} ${durationInMonths > 1 ? "meses" : "mes"}`} />
                <ItemHeaderIcon className="flex-1" icon={BrickWall} label="Precio estimado" value={`${formatNumber(sessionPlan?.totalEstimatedPrice)}`} />
            </div>

            <div className="flex flex-col border dark:border-slate-700 p-2 mt-3">
                <p className="flex-1 font-medium text-lg dark:text-slate-200">Plan de tratamientos</p>
                <div className="flex text-slate-200 mt-3 border-b dark:border-b-slate-700 pb-2">
                    <div className="flex-2">Fase de tratamiento</div>
                    <div className="flex-1">Duracion estimada</div>
                    <div className="flex-1">Estado</div>
                    <div className="flex-1">Acciones</div>
                </div>
                <div className="flex-2 flex flex-col gap-2 mt-2">
                    {items.map((item) => (
                        <div key={item.id} className="flex gap-2 text-lg dark:text-slate-200">
                            <div className="flex-2 flex gap-2 shrink-0 min-w-0 items-center">
                                <div className={`w-10 h-10 flex justify-center items-center rounded-full ${item.status === "Pendiente" ? "bg-slate-300 dark:bg-slate-600" : "bg-primary dark:bg-primary-dark"} text-slate-200`}>
                                    <p>{item.order}</p>
                                </div>
                                <p className="flex-1 truncate">{`${item.name}`}</p>
                            </div>
                            <div className="flex-1">1 dia</div>
                            <div className="flex-1">
                                <LabelBadge label={item.status} className={`${item.status === "Completed" ? "bg-green-400/10" : "bg-yellow-400/10 text-yellow-500"}`} />
                            </div>
                            <div className="flex-1">
                                <button className="flex items-center px-3 py-1 rounded-md border dark:border-slate-700 dark:text-slate-300 text-sm dark:hover:bg-slate-800 hover:bg-slate-200/50 transition-colors">
                                    <Play className="w-4 h-4 mr-1" />
                                    Iniciar
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="flex flex-col mt-6 mb-3">
                <p className="text-lg font-medium dark:text-slate-200">Notas</p>

                <TextField
                    id="outlined-multiline-flexible"
                    label="Notas del plan"
                    multiline
                    rows={4}
                    value={sessionPlan.comments}
                    disabled={true}
                />
            </div>
        </div>
    )
}