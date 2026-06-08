import LabelBadge from "@/components/commons/LabelBadge"
import { Card, CardContent } from "@/components/ui/card"
import { Calendar } from "lucide-react"

export default function NextAppointmentCard() {
    return (
        <Card>
            <CardContent className="p-4 space-y-4">
                <div className="flex items-center justify-between">
                    <h2 className="text-lg font-medium dark:text-slate-200">Próxima cita</h2>
                </div>
                <div className="flex gap-3">
                    <Calendar className="text-primary p-2.5 rounded-full bg-primary/10" size={60} />
                    <div>
                        <p className="text-sm text-black dark:text-muted-foreground font-medium">
                            Miercoles, 28 de Mayo 2026
                        </p>
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
    )
}
