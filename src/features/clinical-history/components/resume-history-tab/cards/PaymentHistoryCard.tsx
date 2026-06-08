import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { formatNumber } from "@/utils/number.util"
import type { SessionPlan } from "@/services/treatment-plan/treatmentPlan.type"

interface PaymentHistoryCardProps {
    treatment: SessionPlan
    totalPaid: number
}

export default function PaymentHistoryCard({ treatment, totalPaid }: PaymentHistoryCardProps) {
    const total = treatment.totalEstimatedPrice ?? 0
    const pending = total - totalPaid
    const percentagePaid = total > 0 ? Math.round((totalPaid / total) * 100) : 0

    return (
        <Card>
            <CardContent className="p-4 space-y-4">
                <div className="flex items-center justify-between">
                    <h2 className="text-lg font-medium dark:text-slate-200">Historial de pagos</h2>
                </div>
                <div className="flex flex-col gap-4">
                    <div className="flex justify-between">
                        <p className="dark:text-slate-400">Total del tratamiento</p>
                        <p className="text-black dark:text-slate-200 font-medium">${formatNumber(total)}</p>
                    </div>
                    <div className="flex justify-between">
                        <p className="dark:text-slate-400">Pagado</p>
                        <p className="text-green-500 dark:text-green-400 font-medium">${formatNumber(totalPaid)}</p>
                    </div>
                    <div className="flex justify-between">
                        <p className="font-medium dark:text-slate-200">Pendiente</p>
                        <p className="text-red-500 dark:text-green-400 font-medium">${formatNumber(pending)}</p>
                    </div>
                    <Progress value={percentagePaid} />
                </div>
            </CardContent>
        </Card>
    )
}
