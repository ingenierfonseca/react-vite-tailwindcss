import LabelBadge from "@/components/commons/LabelBadge"
import { Card, CardContent } from "@/components/ui/card"
import { getStatusColor } from "@/features/appointments/components/appointment.utils"
import { AppointmentStatusLabels, type AppointmentInfoDto, type AppointmentStatusType } from "@/models/appointment.types"
import { formatDateToMMDameDDYYYY } from "@/utils/date.util"
import { Calendar } from "lucide-react"

interface NextAppointmentCardProps {
    appointment?: AppointmentInfoDto
}

export default function NextAppointmentCard({appointment}: NextAppointmentCardProps) {
    return (
        <Card>
            <CardContent className="p-4 space-y-4">
                <div className="flex items-center justify-between">
                    <h2 className="text-lg font-medium dark:text-slate-200">Próxima cita</h2>
                </div>
                {appointment !== undefined && appointment ? (
                    <div className="flex gap-3">
                        <div className="text-primary rounded-full bg-primary/10 w-15 h-15 flex items-center justify-center">
                            <Calendar size={40} />
                        </div>
                        <div>
                            <p className="text-sm text-black dark:text-muted-foreground font-medium">
                                {formatDateToMMDameDDYYYY(appointment.date)}
                            </p>
                            <div className="flex gap-4 items-center">
                                <p className="font-medium text-2xl dark:text-slate-200">{appointment.startTime}</p>
                                <LabelBadge 
                                    label={getStatusLabel(appointment.statusId)} className={getStatusColor(appointment.statusId)} />
                            </div>
                            <p className="mt-3 dark:text-slate-300 font-medium">{appointment.typeName}</p>
                            <p className="dark:text-slate-400">Dr(a). {appointment.doctorName}</p>
                        </div>
                    </div>
                ) : (
                    <div>
                        No se agendado ninguna
                    </div>
                )}
            </CardContent>
        </Card>
    )
}

function getStatusLabel(status: number): string {
  return AppointmentStatusLabels[
    status as AppointmentStatusType
  ] ?? "Estado desconocido";
}
