import { PlanStatus, type SessionPlan, type SessionPlanItem } from "@/services/treatment-plan/treatmentPlan.type";
import { formatNumber } from "@/utils/number.util";
import { Card } from "@/components/ui/card";
import { TextField, CircularProgress } from "@mui/material";
import { Calendar, Clock, BrickWall, CheckIcon, Loader, Play } from "lucide-react";

import AlertDialogApp from "@/components/alert-modal/ConfirmDialog";
import { LabelIconBadge } from "@/components/commons/LabelBadge";
import ItemHeaderIcon from "@/features/patients/components/ItemHeaderIcon";
import { useEvolutionTab } from "../hooks/useEvolutionTab";

// Strategy Pattern: Mapeo estático centralizado para configuraciones de interfaz
const ACTION_CONFIG = {
    [PlanStatus.PENDING]: {
        title: 'Iniciar tratamiento',
        description: '¿Está seguro que desea iniciar este tratamiento?',
        confirmStatus: PlanStatus.INPROCESS,
        buttonText: 'Iniciar',
        loadingText: 'Iniciando...',
        icon: <Play className="w-4 h-4 mr-1" />
    },
    [PlanStatus.INPROCESS]: {
        title: 'Completar tratamiento',
        description: '¿Está seguro que desea completar este tratamiento?',
        confirmStatus: PlanStatus.COMPLETED,
        buttonText: 'Completar',
        loadingText: 'Completando...',
        icon: null
    }
} as const;

const STATUS_STYLE_STRATEGY = {
    [PlanStatus.COMPLETED]: { className: "bg-green-400/10 text-green-600", icon: <CheckIcon className="w-4 h-4" /> },
    [PlanStatus.PENDING]: { className: "bg-yellow-400/10 text-yellow-600", icon: <Clock className="w-4 h-4" /> },
    [PlanStatus.INPROCESS]: { className: "bg-slate-300 dark:bg-slate-600 text-black dark:text-slate-200", icon: <Loader className="w-4 h-4" /> }
} as const;

interface EvolutionTabProps {
    sessionPlan?: SessionPlan;
    setSessionPlan: React.Dispatch<React.SetStateAction<SessionPlan | undefined>>;
}

export default function EvolutionTab({ sessionPlan, setSessionPlan }: EvolutionTabProps) {
    const { durationInMonths, isItemLoading, handleChangeStatus } = useEvolutionTab({ sessionPlan, setSessionPlan });

    return (
        <div className="flex flex-col gap-4">
            <Card className="p-3">
                <p className="text-2xl font-medium dark:text-slate-200">Tratamiento en curso</p>
                <p className="text-lg text-black dark:text-slate-400">{sessionPlan?.name}</p>

                {/* Métricas del Encabezado */}
                <div className="flex gap-3 mt-3 p-2 bg-slate-100 dark:bg-slate-800/50">
                    <ItemHeaderIcon className="flex-1" icon={Calendar} label="Tipo de tratamiento" value={sessionPlan?.name ?? 'Sin definir'} />
                    <ItemHeaderIcon className="flex-1" icon={Clock} label="Duración estimada" value={`${durationInMonths} ${durationInMonths > 1 ? "meses" : "mes"}`} />
                    <ItemHeaderIcon className="flex-1" icon={BrickWall} label="Precio estimado" value={`$${formatNumber(sessionPlan?.totalEstimatedPrice ?? 0)}`} />
                </div>

                {/* Tabla de Fases */}
                <div className="flex flex-col border border-slate-300 dark:border-slate-700 p-2 mt-3">
                    <p className="font-medium text-lg dark:text-slate-200">Plan de tratamientos</p>
                    <TableHeader />
                    
                    <div className="flex flex-col gap-2 mt-2">
                        {sessionPlan?.items.map((item, index) => (
                            <TreatmentItemRow 
                                key={item.id} 
                                item={item} 
                                index={index} 
                                isLoading={isItemLoading(item.id)} 
                                onStatusChange={handleChangeStatus}
                            />
                        ))}
                    </div>
                </div>

                {/* Sección de Notas */}
                <div className="flex flex-col mt-6 mb-3">
                    <p className="text-lg font-medium dark:text-slate-200 mb-2">Notas</p>
                    <TextField
                        id="outlined-multiline-flexible"
                        label="Notas del plan"
                        multiline
                        rows={4}
                        value={sessionPlan?.comments ?? ""}
                        disabled
                    />
                </div>
            </Card>
        </div>
    );
}

// Sub-componentes limpios (Sub-views)
const TableHeader = () => (
    <div className="flex text-black dark:text-slate-200 mt-3 border-b border-b-slate-300 dark:border-b-slate-700 pb-2 font-medium">
        <div className="flex-2">Fase de tratamiento</div>
        <div className="flex-1">Duración estimada</div>
        <div className="flex-1 flex justify-center">Estado</div>
        <div className="flex-1">Acciones</div>
    </div>
);

interface ItemRowProps {
    item: SessionPlanItem;
    index: number;
    isLoading: boolean;
    onStatusChange: (itemId: number, status: string) => void;
}

const TreatmentItemRow = ({ item, index, isLoading, onStatusChange }: ItemRowProps) => {
    const config = ACTION_CONFIG[item.status as keyof typeof ACTION_CONFIG];
    const strategy = STATUS_STYLE_STRATEGY[item.status as keyof typeof STATUS_STYLE_STRATEGY] || STATUS_STYLE_STRATEGY[PlanStatus.PENDING];

    return (
        <div className="flex gap-2 text-lg dark:text-slate-200 items-center py-1">
            <div className="flex-2 flex gap-2 shrink-0 min-w-0 items-center">
                <div className={`w-10 h-10 flex justify-center items-center rounded-full shrink-0 ${item.status === PlanStatus.PENDING ? "bg-slate-300 dark:bg-slate-600 text-black dark:text-slate-200" : "bg-primary text-slate-200"}`}>
                    <span>{index + 1}</span>
                </div>
                <p className="flex-1 truncate text-base">{item.templateItem.name}</p>
            </div>
            <div className="flex-1 text-base">1 día</div>
            <div className="flex-1 flex justify-center">
                <LabelIconBadge label={item.status} icon={strategy.icon} className={strategy.className} />
            </div>
            <div className="flex-1">
                {config && (
                    <AlertDialogApp 
                        trigger={
                            <button disabled={isLoading} className="flex gap-1 items-center px-3 py-1 rounded-md border dark:border-slate-700 dark:text-slate-300 text-sm dark:hover:bg-slate-800 hover:bg-slate-200/50 transition-colors disabled:opacity-50 cursor-pointer">
                                {isLoading ? (
                                    <>
                                        <CircularProgress size={16} color="inherit" />
                                        <span>{config.loadingText}</span>
                                    </>
                                ) : (
                                    <>
                                        {config.icon}
                                        <span className="text-sm font-semibold">{config.buttonText}</span>
                                    </>
                                )}
                            </button>
                        } 
                        title={config.title} 
                        description={config.description} 
                        onConfirm={() => onStatusChange(item.id, config.confirmStatus)} 
                    />
                )}
            </div>
        </div>
    );
};