import { Phone } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Card } from "../ui/card";
import { CircleDot } from "./CircleDot";
import { Button } from "../ui/button";
import type { Customer } from "@/services/customer/customer.type";
import { ASSETS_URLS } from "@/config/constants";

interface PatientInfoProps {
    customer: Customer
}

export default function PatientInfo({customer}: PatientInfoProps) {
    return (
        <Card className="flex flex-col p-4 md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex items-center gap-4">
                <Avatar className="w-24 h-24 md:w-30 md:h-30 shrink-0">
                    <AvatarImage src={`${ASSETS_URLS.avatars}/${customer.avatar}`} />
                    <AvatarFallback>JP</AvatarFallback>
                </Avatar>
                <div className="flex flex-col gap-2 min-w-0">
                    <div className="flex flex-wrap gap-2 items-center">
                        <h1 className="text-xl md:text-2xl font-bold dark:text-slate-200">{customer.firstName} {customer.lastName}</h1>
                        <div className="bg-green-400/10 text-green-600 font-semibold rounded-2xl px-3">Activo</div>
                    </div>
                    <div className="flex flex-wrap gap-3 items-center text-sm text-slate-800 dark:text-slate-400">
                        <p>23 años</p>
                        <CircleDot />
                        <p>15/03/2001</p>
                        <CircleDot />
                        <p>Masculino</p>
                    </div>
                    <div className="flex gap-3 dark:text-slate-300">
                        <Phone />8642-2597
                    </div>
                </div>
            </div>

            <div className="flex flex-wrap gap-2">
                {/*<Button variant="outline">Enviar recordatorio</Button>*/}
                <Button>Nueva cita</Button>
            </div>
        </Card>
    )
}