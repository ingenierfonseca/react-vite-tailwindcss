import LabelBadge from "@/components/commons/LabelBadge"
import { Card, CardContent } from "@/components/ui/card"
import { Check } from "lucide-react"
import type { SessionPlan } from "@/services/treatment-plan/treatmentPlan.type"

interface StatusStyle {
    text: string
    bg: string
    badgeText: string
}

const STATUS_STYLES: Record<string, StatusStyle> = {
    Completo: {
        text: "text-green-600",
        bg: "bg-green-400/10",
        badgeText: "text-green-500",
    },
    "En proceso": {
        text: "text-primary",
        bg: "bg-primary/10",
        badgeText: "text-primary dark:text-slate-200",
    },
    Pendiente: {
        text: "text-slate-500",
        bg: "bg-slate-400/10",
        badgeText: "text-slate-500",
    },
}

const DEFAULT_STYLE: StatusStyle = {
    text: "text-slate-500",
    bg: "bg-slate-400/10",
    badgeText: "text-slate-500",
}

interface TreatmentPlanCardProps {
    treatment: SessionPlan
}

export default function TreatmentPlanCard({ treatment }: TreatmentPlanCardProps) {
    return (
        <Card>
            <CardContent className="p-4 space-y-4">
                <div className="flex items-center justify-between">
                    <h2 className="text-lg font-medium dark:text-slate-200">Plan de tratamiento</h2>
                </div>
                <div className="flex flex-col gap-2">
                    {treatment.items.map((plan, index) => {
                        const style = STATUS_STYLES[plan.status] || DEFAULT_STYLE
                        const isComplete = plan.status === "Completo"
                        const isInProcess = plan.status === "En proceso"

                        return (
                            <div key={plan.id ?? index} className="flex justify-between items-center gap-4">
                                <div className="flex items-center gap-2">
                                    <div
                                        className={`rounded-full ${
                                            isComplete ? `${style.bg} ${style.text}` : "bg-primary"
                                        }`}
                                    >
                                        {isComplete && <Check />}
                                        {isInProcess && (
                                            <p className="h-5 w-5 flex justify-center text-slate-200">{index + 1}</p>
                                        )}
                                        {plan.status === "Pendiente" && (
                                            <p className="h-5 w-5 flex justify-center bg-white border border-slate-400 rounded-full" />
                                        )}
                                    </div>
                                    <p
                                        className={`${
                                            isInProcess ? "text-primary dark:text-slate-200" : "dark:text-slate-400"
                                        }`}
                                    >
                                        {index + 1}. {plan.templateItem.name}
                                    </p>
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
    )
}
