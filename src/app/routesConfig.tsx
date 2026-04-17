import AppointmentList from "../features/appointments/AppointmentList";
import Invoice from "../features/invoice/pages/InvoiceListPage";
import Odontogram from "../features/odontogram/Odontogram";
import DashboardPage from "../pages/DashboardPage";
import PatientListPage from "../features/patients/page/PatientListPage";
import SettingsPage from "../features/settings/SettingsPage";
import TreatmentListPage from "../features/administration/treatments/TreatmentListPage";

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
    element: <div>Doctors</div>
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
  }
];