import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { BanknoteArrowDownIcon, CreditCard, FileSpreadsheet, FileText, Notebook, Phone, SquareChartGantt, TrendingUp } from "lucide-react";
import ResumeHistorial from "./components/ResumeHistorial";
import { CircleDot } from "@/components/commons/CircleDot";

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
    {
        value: "payment",
        label: "Pagos",
        icon: <BanknoteArrowDownIcon />
    },
    {
        value: "documents",
        label: "Documentos",
        icon: <FileSpreadsheet />
    },
    {
        value: "notes",
        label: "Notas",
        icon: <Notebook />
    }
]
export default function CustomerClinicalHistoryDashboard() {
  return (
    <div className="w-full p-3 space-y-3 dark:bg-slate-900">
      {/* Header */}
      <Card className="flex flex-col p-4 md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex items-center gap-4">
          <Avatar className="w-30 h-30">
            <AvatarImage src="https://i.pravatar.cc/150" />
            <AvatarFallback>JP</AvatarFallback>
          </Avatar>
          <div className="flex flex-col gap-2">
            <div className="flex gap-3 items-center">
                <h1 className="text-xl md:text-2xl font-bold dark:text-slate-200">Juan Pérez García</h1>
                <div className="bg-green-400/10 text-green-600 font-semibold rounded-2xl px-3">Activo</div>
            </div>
            <div className="flex gap-3 items-center text-sm text-slate-800 dark:text-slate-400">
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
          <Button variant="outline">Enviar recordatorio</Button>
          <Button>Nueva cita</Button>
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
            <ResumeHistorial />
        </TabsContent>

        {/* Evolución */}
        <TabsContent value="evolution">
        </TabsContent>

        {/* Pagos */}
        <TabsContent value="payment">
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
        </TabsContent>

        {/* Documentos */}
        <TabsContent value="documents">
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
        </TabsContent>
      </Tabs>
    </div>
  );
}
