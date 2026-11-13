import { useEffect, useState } from "react";
import { Navigate } from "react-router";
import { User } from "lucide-react";
import DashboardCard from "@/components/dashboard/DashboardCard";
import { CustomerClientsPage } from "@/app/composition/CustomerClientsPage";
import ClinicalAssessment from "@/features/session-plan/ClinicalAssessment";
import { PermissionAction, PermissionResource } from "@/models/permission.enum";
import type { Customer, CustomerDashboard } from "@/services/customer/customer.type";
import { CustomerService } from "@/services/customer/customer.service";
import { usePermissions } from "@/hooks/usePermissions";
import PatientInfo from "../components/PatientInfo";
import DashboardCardII from "@/components/dashboard/DashboardCardII";

export const usePatients= () => {
  const panelClassName = "dark:bg-slate-800";
  const panelWidthClassName = "md:w-7/12 md:max-w-none";
  const [panelVisible, setPanelVisible] = useState(false);

  return {
    state: {
      panelClassName,
      panelWidthClassName,
      panelVisible
    },
    actions: {
      setPanelVisible
    }
  }
}
export default function PatientListPage() {
  const { can } = usePermissions();
  const [dashboardData, setDashboardData] = useState<CustomerDashboard[]>([]);
  const [selectedPatient, setSelectedPatient] = useState<Customer | null>(null);
  const {state, actions} = usePatients()
  

  useEffect(() => {
    CustomerService.getDashboard()
      .then((data: CustomerDashboard[]) => setDashboardData(data))
      .catch(() => setDashboardData([]));
  }, []);

  if (!can(PermissionAction.View, PermissionResource.Patients)) {
    return <Navigate to="/not-found" replace />;
  }

  return (
    <>
      <CustomerClientsPage
        renderMetrics={(
          <div className="grid grid-cols-[repeat(auto-fit,minmax(80px,1fr))] gap-4">
            {Array.isArray(dashboardData) && dashboardData.map((dashboard, index) => (
              <DashboardCard
                key={`${dashboard.title}-${index}`}
                iconClassName={dashboardData.length > 1 ? "hidden md:block" : ""}
                stat={{
                  title: dashboard.title,
                  value: dashboard.value,
                  change: dashboard.change,
                  trend: dashboard.trend,
                  bgColor: "bg-primary/20",
                  iconColor: "text-primary",
                  textColor: "text-blue-500",
                  color: "from-blue-400 to-blue-600",
                  icon: User,
                }}
              />
            ))}
            {<DashboardCardII title="Pacientes activos" value={100} />}
          </div>
        )}
        renderAdittionalInfo={(client, getProfile, onClose) => (
          <PatientInfo 
            patientId={client.id} 
            getProfile={getProfile} 
            onClose={onClose}
            onStartConsultation={() => actions.setPanelVisible(true)} 
            selectedClient={() => setSelectedPatient(client)} />
        )}
        onCloseAdditionalRender={() => actions.setPanelVisible(false)}
      >
      </CustomerClientsPage>
      <div className="pointer-events-none fixed inset-0 z-50" role="presentation">
          <div
            className={`pointer-events-auto fixed right-0 top-0 z-10 h-full w-full overflow-y-auto bg-white shadow-2xl transition-transform duration-500 ease-in-out dark:bg-slate-900 
              ${state.panelWidthClassName ?? "md:max-w-2xl"} 
              ${state.panelClassName ?? ""} 
              ${state.panelVisible ? "translate-x-0" : "translate-x-full"}`}
              role="dialog"
              aria-modal="true"
              aria-label=""
              inert={!state.panelVisible}
          >
            {selectedPatient &&
          <ClinicalAssessment customer={selectedPatient!} onClose={() => actions.setPanelVisible(false)} />}
        </div>
      </div>
    </>
  );
}
