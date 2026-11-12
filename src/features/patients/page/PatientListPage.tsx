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

export default function PatientListPage() {
  const { can } = usePermissions();
  const [dashboardData, setDashboardData] = useState<CustomerDashboard[]>([]);
  const [assessmentCustomer, setAssessmentCustomer] = useState<Customer | null>(null);

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
        onStartAssessment={(client) => setAssessmentCustomer({
          ...client,
          phone: client.phone ?? "",
          email: client.email ?? "",
          address: client.address ?? "",
        })}
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
        renderAdittionalInfo={(client, getProfile) => (
          <PatientInfo patientId={client.id} getProfile={getProfile} />
        )}
      />

      {assessmentCustomer && (
        <div className="fixed inset-0 z-60">
          <ClinicalAssessment customer={assessmentCustomer} setIsOpen={(isOpen) => { if (!isOpen) setAssessmentCustomer(null); }} />
        </div>
      )}
    </>
  );
}
