import { Card, CardContent } from "@/components/ui/card"
import { Calendar, CheckCircle2Icon, Clock } from "lucide-react"

export default function IndicatorsCard() {
    return (
        <Card>
            <CardContent className="p-4 space-y-4">
                <div className="flex items-center justify-between">
                    <h2 className="text-lg font-medium dark:text-slate-200">Indicadores</h2>
                </div>
                <div className="flex gap-2">
                    <div className="flex-1 flex flex-col justify-center items-center border border-slate-300 rounded-lg p-2 gap-3">
                        <div className="flex justify-center items-center bg-primary/10 p-2 w-10 h-10 rounded-full">
                            <Calendar className="text-primary" size={35} />
                        </div>
                        <p className="font-bold text-lg dark:text-slate-200">16</p>
                        <p className="text-sm text-black dark:text-slate-200 font-medium">Citas completadas</p>
                        <p>de 24 programadas</p>
                    </div>
                    <div className="flex-1 flex flex-col justify-center items-center border border-slate-300 rounded-lg p-2 gap-3">
                        <div className="flex justify-center items-center bg-green-400/10 p-2 w-10 h-10 rounded-full">
                            <CheckCircle2Icon className="text-green-500" size={35} />
                        </div>
                        <p className="font-bold text-lg dark:text-slate-200">16</p>
                        <p className="text-sm text-black dark:text-slate-200 font-medium">Citas asistidas</p>
                        <p>de 24 programadas</p>
                    </div>
                    <div className="flex-1 flex flex-col justify-center items-center border border-slate-300 rounded-lg p-2 gap-3">
                        <div className="flex justify-center items-center bg-yellow-400/10 p-2 w-10 h-10 rounded-full">
                            <Clock className="text-yellow-500" size={35} />
                        </div>
                        <p className="font-bold text-lg dark:text-slate-200">16</p>
                        <p className="text-sm text-black dark:text-slate-200 font-medium">Citas completadas</p>
                        <p>de 24 programadas</p>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}
