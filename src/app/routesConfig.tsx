import AppointmentList from "../features/appointments/AppointmentList";
import Invoice from "../features/invoice/pages/InvoiceListPage";
import Odontogram from "../features/odontogram/Odontogram";
import DashboardPage from "../pages/DashboardPage";
import PatientListPage from "../features/patients/page/PatientListPage";
import SettingsPage from "../features/settings/SettingsPage";
import AppointmentTypeListPage from "../features/administration/apointment-type/AppointmentTypeListPage";
import PatientBulkUploadPage from "../features/upload-data/patient/PatientBulkUploadPage";
import CustomerClinicalHistoryDashboard from "@/features/clinical-history/CustomerClinicalHistoryPage";
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
    path: "/imports/patients",
    title: "Importacion de Pacientes",
    element: <PatientBulkUploadPage />
  },
  {
    path: "/patients/:id/treatment-history/:treatmentId",
    title: "Historial clinico",
    element: <CustomerClinicalHistoryDashboard />
  }
];