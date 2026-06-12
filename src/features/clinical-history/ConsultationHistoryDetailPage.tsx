import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Phone, Calendar, Stethoscope, FileText } from "lucide-react";
import { useEffect, useState } from "react";
import { useParams } from "react-router";
import { CustomerService } from "@/services/customer/customer.service";
import type { Customer } from "@/services/customer/customer.type";
import { formatPhoneNumber } from "@/utils/number.util";
import { ASSETS_URLS } from "@/config/constants";
import { ClinicalSessionService } from "@/services/clinical-session/clinicalSession.service";
import type { ClinicalSession } from "@/services/clinical-session/clinicalSession.type";
import { formatDateToMMDameDDYYYY, calculateAgeFromString } from "@/utils/date.util";

export default function ConsultationHistoryDetailPage() {
  const [customer, setCustomer] = useState<Customer>();
  const [session, setSession] = useState<ClinicalSession>();
  const { id, consultationId } = useParams();

  useEffect(() => {
    if (id) {
      CustomerService.find(Number(id))
        .then(setCustomer)
        .catch(console.error);
    }
    if (consultationId) {
      ClinicalSessionService.find(Number(consultationId))
        .then(setSession)
        .catch(console.error);
    }
  }, [id, consultationId]);

  return (
    <div className="w-full p-3 space-y-3 dark:bg-slate-900">
      <Card className="flex flex-col p-4 md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex items-center gap-4">
          <Avatar className="w-30 h-30">
            <AvatarImage src={`${ASSETS_URLS.avatars}/${customer?.avatar}`} />
            <AvatarFallback>{customer?.firstName?.charAt(0)}{customer?.lastName?.charAt(0)}</AvatarFallback>
          </Avatar>
          <div className="flex flex-col gap-2">
            <h1 className="text-xl md:text-2xl font-bold dark:text-slate-200">{customer?.firstName} {customer?.lastName}</h1>
            <div className="flex gap-3 items-center text-sm text-slate-800 dark:text-slate-400">
              <p>{customer ? calculateAgeFromString(customer.birthDate) : ""} años</p>
            </div>
            <div className="flex gap-3 dark:text-slate-300">
              <Phone />{formatPhoneNumber(customer?.phone || "")}
            </div>
          </div>
        </div>
      </Card>

      {session && (
        <Card className="p-6 space-y-6">
          <div className="flex items-center gap-3 border-b pb-4 dark:border-slate-700">
            <Calendar className="w-5 h-5 text-primary" />
            <div>
              <p className="text-sm text-slate-500 dark:text-slate-400">Fecha de consulta</p>
              <p className="font-semibold dark:text-slate-200">{formatDateToMMDameDDYYYY(session.date)}</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <Stethoscope className="w-5 h-5 text-primary mt-1" />
            <div>
              <p className="text-sm text-slate-500 dark:text-slate-400">Motivo de visita</p>
              <p className="font-semibold dark:text-slate-200">{session.reasonForVisit}</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <FileText className="w-5 h-5 text-primary mt-1" />
            <div>
              <p className="text-sm text-slate-500 dark:text-slate-400">Notas clínicas</p>
              <p className="dark:text-slate-300 whitespace-pre-wrap">{session.clinicalNotes}</p>
            </div>
          </div>
        </Card>
      )}

      {!session && (
        <Card className="p-6 text-center text-slate-500 dark:text-slate-400">
          Cargando detalle de consulta...
        </Card>
      )}
    </div>
  );
}
