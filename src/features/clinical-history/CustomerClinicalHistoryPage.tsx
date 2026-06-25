import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Notebook, Phone, SquareChartGantt, TrendingUp } from "lucide-react";
import { useEffect, useState } from "react";
import { useParams } from "react-router";
import { CustomerService } from "@/services/customer/customer.service";
import type { Customer } from "@/services/customer/customer.type";
import { formatPhoneNumber } from "@/utils/number.util";
import { ASSETS_URLS } from "@/config/constants";
import ResumeHistoryTab from "./components/ResumeHistoryTab";
import EvolutionTab from "./components/EvolutionTab";
import type { SessionPlan } from "@/services/treatment-plan/treatmentPlan.type";
import { SessionPlanService } from "@/services/session-plan/sessionPlan.service";
import NotesTab from "./components/NotesTab";
import { calculateAgeFromString } from "@/utils/date.util";
import QuickAppointmentCreate from "../appointments/components/QuickAppointmentCreate";
import { Bounce, ToastContainer } from "react-toastify";

const tabs = [
  {
    value: "resume",
    label: "Resumen",
    icon: <SquareChartGantt />
  },
  {
    value: "evolution",
    label: "Evolución",
    icon: <TrendingUp />
  },
  /*{
    value: "payment",
    label: "Pagos",
    icon: <BanknoteArrowDownIcon />
  },
  {
    value: "documents",
    label: "Documentos",
    icon: <FileSpreadsheet />
  },*/
  {
    value: "notes",
    label: "Notas",
    icon: <Notebook />
  }
]
export default function CustomerClinicalHistoryDashboard() {
  const [customer, setCustomer] = useState<Customer>()
  const [treatment, setTreatment] = useState<SessionPlan>()
  const { id, treatmentId } = useParams();
  const [isOpenQuickAppointment, setIsOpenQuickAppointment] = useState(false)
  const [reloadNexAppointment, setReloadNexAppointment] = useState(0)

  useEffect(() => {
    CustomerService.find(Number(id)!)
      .then((response) => {
        setCustomer(response);
      })
      .catch((error) => {
        console.error("Error fetching customer data:", error);
      });

    SessionPlanService.find(Number(treatmentId)!)
      .then((response) => {
        setTreatment(response)
      })
      .catch((error) => {
        console.error("Error fetching treatment history:", error);
      });
  }, [id, treatmentId])

  return (
    <div className="w-full p-3 space-y-3 dark:bg-slate-900">
      {/* Header */}
      <Card className="flex flex-col p-4 md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex items-center gap-4">
          <Avatar className="w-30 h-30">
            <AvatarImage src={`${ASSETS_URLS.avatars}/${customer?.avatar}`} />
            <AvatarFallback>{customer?.firstName.charAt(0)}{customer?.lastName.charAt(0)}</AvatarFallback>
          </Avatar>
          <div className="flex flex-col gap-2">
            <div className="flex gap-3 items-center">
              <h1 className="text-xl md:text-2xl font-bold dark:text-slate-200">{customer?.firstName} {customer?.lastName}</h1>
              <div className="bg-green-400/10 text-green-600 font-semibold rounded-2xl px-3">Activo</div>
            </div>
            <div className="flex gap-3 items-center text-sm text-slate-800 dark:text-slate-400">
              <p>{calculateAgeFromString(customer?.birthDate!)} años</p>
              {/*<CircleDot />
              <p>{customer?.birthDate}</p>
              <CircleDot />
              <p>{customer?.gender}</p>*/}
            </div>
            <div className="flex gap-3 dark:text-slate-300">
              <Phone />{formatPhoneNumber(customer?.phone || "")}
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <Button className="hidden" variant="outline">Enviar recordatorio</Button>
          <Button onClick={() => setIsOpenQuickAppointment(true)}>Nueva cita</Button>
        </div>
      </Card>

      {/* Tabs */}
      <Tabs defaultValue="resume" className="w-full">
        <TabsList className="w-full overflow-x-auto flex">
          {tabs.map((tab, index) => (
            <TabsTrigger key={index} value={tab.value} className={`
                border-b-2 border-transparent
                data-[state=active]:border-b-primary-dark
                data-[state=active]:text-primary-dark
            `}>
              {tab.icon}{tab.label}
            </TabsTrigger>
          ))}
        </TabsList>

        {/* Resume */}
        <TabsContent value="resume">
          <ResumeHistoryTab treatment={treatment} customerId={customer?.id} reloadNexAppointment={reloadNexAppointment} />
        </TabsContent>

        {/* Evolución */}
        <TabsContent value="evolution">
          <EvolutionTab sessionPlan={treatment} setSessionPlan={setTreatment} />
        </TabsContent>

        {/* Notas */}
        <TabsContent value="notes">
          <NotesTab sessionPlan={treatment} />
        </TabsContent>

        {/* Pagos */}
        {/*<TabsContent value="payment">
          <div className="grid md:grid-cols-3 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <CreditCard size={16} />
                  <span>Total</span>
                </div>
                <p className="text-xl font-semibold mt-2">$2,800</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <CreditCard size={16} />
                  <span>Pagado</span>
                </div>
                <p className="text-xl font-semibold mt-2 text-green-600">$1,680</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <CreditCard size={16} />
                  <span>Pendiente</span>
                </div>
                <p className="text-xl font-semibold mt-2 text-red-500">$1,120</p>
              </CardContent>
            </Card>
          </div>

          <div className="mt-4">
            <Button className="w-full md:w-auto">Registrar pago</Button>
          </div>
        </TabsContent>*/}

        {/* Documentos */}
        {/*<TabsContent value="documents">
          <div className="space-y-3">
            {["Radiografía", "Fotografías", "Plan tratamiento"].map((doc) => (
              <Card key={doc}>
                <CardContent className="p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <FileText size={18} />
                    <span>{doc}</span>
                  </div>
                  <Button variant="outline" size="sm">Ver</Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>*/}
      </Tabs>
      <ToastContainer
        position="bottom-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick={false}
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        transition={Bounce}
      />
      {isOpenQuickAppointment && <QuickAppointmentCreate
        customer={customer!}
        isOpen={isOpenQuickAppointment}
        onSuccess={() => setReloadNexAppointment(reloadNexAppointment+1)}
        setIsOpen={setIsOpenQuickAppointment}
      />}
    </div>
  );
}
