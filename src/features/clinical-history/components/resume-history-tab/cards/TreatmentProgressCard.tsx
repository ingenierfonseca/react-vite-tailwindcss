import ProgressComponent from "@/components/commons/ProgressComponent"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import type { SessionPlan } from "@/services/treatment-plan/treatmentPlan.type"

interface ProgressInfo {
    percentage: number
    currentPlan: { templateItem: { name: string } } | null
    currentId: number
    nextPlan: { templateItem: { name: string } } | null
    estimatedMonths: number
    transcurredMonths: number
}

interface TreatmentProgressCardProps {
    progress: ProgressInfo
    treatment: SessionPlan
}

export default function TreatmentProgressCard({ progress, treatment }: TreatmentProgressCardProps) {
    return (
        <Card className="flex-[1_1_450px] min-w-0">
            <CardContent className="p-4 space-y-4">
                <div className="flex items-center justify-between">
                    <h2 className="text-lg font-medium dark:text-slate-200">Progreso del tratamiento</h2>
                </div>
                <div className="flex gap-3 md:gap-10">
                    <ProgressComponent size={150} sizeText={30} value={progress.percentage} label="Completado" />
                    <div className="w-full flex flex-col gap-3">
                        <div className="flex">
                            <div className="flex-1">
                                <p className="dark:text-slate-400">Tiempo transcurrido</p>
                                <p className="text-md font-medium text-black md:text-lg dark:text-slate-200">
                                    {progress.transcurredMonths} {progress.transcurredMonths === 1 ? "mes" : "meses"}
                                </p>
                            </div>
                            <div className="flex-1">
                                <p className="dark:text-slate-400">Tiempo estimado</p>
                                <p className="text-md md:text-lg font-medium text-black dark:text-slate-200">
                                    {progress.estimatedMonths} {progress.estimatedMonths === 1 ? "mes" : "meses"}
                                </p>
                            </div>
                        </div>
                        <div>
                            <p className="dark:text-slate-400">Siguiente objetivo</p>
                            <p className="text-md font-medium text-black dark:text-slate-200">
                                {progress.nextPlan?.templateItem.name || "Ninguno"}
                            </p>
                        </div>
                        <div className="flex flex-col">
                            <p className="text-md font-medium text-black dark:text-slate-200">
                                {progress.currentPlan?.templateItem.name || "Ninguno"}
                            </p>
                            <Progress value={progress.percentage} />
                            <p className="ml-auto dark:text-slate-400">
                                {progress.currentId} de {treatment.items.length} etapas completadas
                            </p>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}
