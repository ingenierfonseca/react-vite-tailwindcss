import AppointmentList from "../features/appointments/AppointmentList";
import Invoice from "../features/invoice/pages/InvoiceListPage";
import Odontogram from "../features/odontogram/Odontogram";
import DashboardPage from "../pages/DashboardPage";
import PatientListPage from "../features/patients/page/PatientListPage";
import SettingsPage from "../features/settings/SettingsPage";
import AppointmentTypeListPage from "../features/administration/apointment-type/AppointmentTypeListPage";
import PatientBulkUploadPage from "../features/upload-data/patient/PatientBulkUploadPage";
import CustomerClinicalHistoryDashboard from "@/features/clinical-history/CustomerClinicalHistoryPage";
import ConsultationHistoryDetailPage from "@/features/clinical-history/ConsultationHistoryDetailPage";
import TreatmentListPage from "@/features/administration/treatments/TreatmentListPage";
import DoctorListPage from "@/features/administration/doctors/DoctorListPage";
import TreatmentPlanListPage from "@/features/administration/treatment-plans/TreatmentPlanListPage";
import CurrencyListPage from "@/features/administration/currencies/CurrencyListPage";
import TreatmentCategoryListPage from "@/features/administration/treatment-category/TreatmentCategoryListPage";
import ExchangeRateListPage from "@/features/administration/exchange-rate/ExchangeRateListPage";
import UsersListPage from "@/features/administration/users/UsersListPage";
import RolePermissionListPage from "@/features/administration/role-permissions/RolePermissionListPage";
import RolesListPage from "@/features/administration/roles/RolesListPage";
import PermissionListPage from "@/features/administration/permissions/PermissionListPage";
import ResourceTypeListPage from "@/features/administration/resource-type/ResourceTypeListPage";
import ResourceListPage from "@/features/administration/resource/ResourceListPage";
import AppointmentStatusListPage from "@/features/administration/appointment-status/AppointmentStatusListPage";
import SpecialtyListPage from "@/features/administration/specialty/SpecialtyListPage";
import ServiceListPage from "@/features/administration/service/ServicesListPage";
import ConsultationTypeListPage from "@/features/administration/consultation-type/ConsultationTypeListPage";
import StaffListPage from "@/features/administration/staff/StaffListPage";

export const routesConfig = [
  {
    path: "/dashboard",
    title: "Dashboard",
    element: <DashboardPage />,
  },
  {
    path: "/appointments",
    title: "Citas",
    element: <AppointmentList />,
  },
  {
    path: "/patients",
    title: "Pacientes",
    element: <PatientListPage />
  },
  {
    path: "/odontogram",
    title: "Odontograma",
    element: <Odontogram />
  },
  {
    path: "/invoice",
    title: "Factura",
    element: <Invoice />
  },
  {
    path: "/doctors",
    title: "Doctores",
    element: <DoctorListPage />
  },
  {
    path: "/treatment-plans",
    title: "Planes de Tratamiento",
    element: <TreatmentPlanListPage />
  },
  {
    path: "/currencies",
    title: "Monedas",
    element: <CurrencyListPage />
  },
  {
    path: "/settings",
    title: "Configuración",
    element: <SettingsPage />
  },
  {
    path: "/treatments",
    title: "Tratamientos",
    element: <TreatmentListPage />
  },
  {
    path: "/appointment-types",
    title: "Tipo de Citas",
    element: <AppointmentTypeListPage />
  },
  {
    path: "/treatment-categories",
    title: "Categorías de Tratamiento",
    element: <TreatmentCategoryListPage />
  },
  {
    path: "/exchange-rates",
    title: "Tipos de Cambio",
    element: <ExchangeRateListPage />
  },
  {
    path: "/users",
    title: "Usuarios",
    element: <UsersListPage />
  },
  {
    path: "/role-permissions",
    title: "Roles y Permisos",
    element: <RolePermissionListPage />
  },
  {
    path: "/roles",
    title: "Roles",
    element: <RolesListPage />
  },
  {
    path: "/permissions",
    title: "Permisos",
    element: <PermissionListPage />
  },
  {
    path: "/resource-types",
    title: "Tipos de Recurso",
    element: <ResourceTypeListPage />
  },
  {
    path: "/resources",
    title: "Recursos",
    element: <ResourceListPage />
  },
  {
    path: "/appointment-statuses",
    title: "Estados de Cita",
    element: <AppointmentStatusListPage />
  },
  {
    path: "/consultation-types",
    title: "Tipos de Consulta",
    element: <ConsultationTypeListPage />
  },
  {
    path: "/services",
    title: "Servicios",
    element: <ServiceListPage />
  },
  {
    path: "/specialties",
    title: "Especialidades",
    element: <SpecialtyListPage />
  },
  {
    path: "/staff",
    title: "Staff",
    element: <StaffListPage />
  },
  {
    path: "/imports/patients",
    title: "Importacion de Pacientes",
    element: <PatientBulkUploadPage />
  },
  {
    path: "/patients/:id/treatment-plan/:treatmentId",
    title: "Historial clinico",
    element: <CustomerClinicalHistoryDashboard />
  },
  {
    path: "/patients/:id/consultation-history/:consultationId",
    title: "Detalle de consulta",
    element: <ConsultationHistoryDetailPage />
  }
];