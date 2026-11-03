import { useEffect, useState } from "react";
import { Navigate } from "react-router";
import { toast } from "react-toastify";
import { User } from "lucide-react";
import { customerClientModule } from "@/app/composition/clients";
import DashboardCard from "@/components/dashboard/DashboardCard";
import DashboardCardII from "@/components/dashboard/DashboardCardII";
import { ASSETS_URLS } from "@/config/constants";
import { ClientsPage, type ClientsPageLabels } from "@/features/clients";
import ClinicalAssessment from "@/features/session-plan/ClinicalAssessment";
import { PermissionAction, PermissionResource } from "@/models/permission.enum";
import type { Customer, CustomerDashboard } from "@/services/customer/customer.type";
import { CustomerService } from "@/services/customer/customer.service";
import { usePermissions } from "@/hooks/usePermissions";
import PatientProfile from "../components/PatientProfile";
import { calculateAgeFromString, validateBirthDate } from "@/utils/date.util";
import { validateEmail } from "@/utils/email.util";
import { validatePhoneNumber } from "@/utils/number.util";
import PatientCreateEdit from "../components/PatientCreateEdit";

const labels: ClientsPageLabels = {
  title: "Administración de Pacientes",
  description: "Administra la información de tus pacientes",
  add: "Agregar nuevo paciente",
  search: "Buscar pacientes",
  empty: "No se encontraron pacientes.",
  previous: "Anterior",
  next: "Siguiente",
  profile: "Paciente",
  edit: "Editar",
  emailColumn: "Correo",
  phoneColumn: "Teléfono",
  createTitle: "Nuevo paciente",
  editTitle: "Editar paciente",
  firstName: "Nombre del paciente",
  lastName: "Apellido del paciente",
  email: "Correo electrónico",
  phone: "Teléfono",
  address: "Dirección",
  avatar: "Foto del paciente",
  save: "Guardar paciente",
  saving: "Guardando…",
  cancel: "Cancelar",
};

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
      <ClientsPage<Customer>
        module={customerClientModule}
        labels={labels}
        panelBackdrop={false}
        panelWidthClassName="md:w-7/12 md:max-w-none"
        panelClassName="dark:bg-slate-800"
        canCreate={can(PermissionAction.Create, PermissionResource.Patients)}
        canEdit={can(PermissionAction.Update, PermissionResource.Patients)}
        onSaved={(_customer, wasUpdate) => toast.success(wasUpdate ? "Paciente actualizado correctamente" : "Paciente creado correctamente")}
        onError={(message) => toast.error(message)}
        validateClient={(customer) => {
          if (!customer.dni.trim()) return "La identificación del paciente es requerida.";
          if (!customer.firstName.trim()) return "El nombre del paciente es requerido.";
          if (!customer.lastName.trim()) return "El apellido del paciente es requerido.";
          if (!customer.gender.trim()) return "El género del paciente es requerido.";
          if (customer.birthDate.trim()) {
            const validation = validateBirthDate(new Date(customer.birthDate));
            if (!validation.isValid) return validation.message;
          }
          if (customer.phone.trim() && !validatePhoneNumber(customer.phone.trim())) {
            return "El teléfono no es válido.";
          }
          if (customer.email.trim() && !validateEmail(customer.email.trim())) {
            return "El correo electrónico no es válido.";
          }
          return null;
        }}
        createClient={() => ({
          id: 0,
          dni: "",
          firstName: "",
          lastName: "",
          phone: "",
          email: "",
          address: "",
          birthDate: "",
          gender: "",
        })}
        avatarUrl={(customer) => customer.avatar && !customer.avatar.includes("null") ? `${ASSETS_URLS.avatars}${customer.avatar}` : undefined}
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
            <DashboardCardII title="Pacientes activos" value={100} />
          </div>
        )}
        renderRowDetails={(customer) => (
          <span className="mt-1 block truncate text-xs text-slate-500">
            ID: {customer.dni} · {calculateAgeFromString(customer.birthDate)} años
          </span>
        )}
        renderForm={(formProps) => <PatientCreateEdit {...formProps} />}
        renderProfile={(customer, actions) => (
          <PatientProfile
            customer={customer}
            setIsOpen={(isOpen) => { if (!isOpen) actions.onClose(); }}
            setIsOpenTransition={(isOpen) => { if (isOpen) setAssessmentCustomer(customer); }}
            onEdit={(isEditing) => { if (isEditing) actions.onEdit(); }}
          />
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
