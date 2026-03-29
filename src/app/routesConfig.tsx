import AppointmentList from "../features/appointments/AppointmentList";
import Invoice from "../features/invoice/pages/InvoiceListPage";
import InvoiceDetailPage from "../features/invoice/pages/InvoiceDetailPage";
import Odontogram from "../features/odontogram/Odontogram";
import DashboardPage from "../pages/DashboardPage";

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
    element: <div>Patients</div>
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
    path: "/invoice/:id/detail",
    title: "Detalle de Factura",
    element: <InvoiceDetailPage />
  },
  {
    path: "/doctors",
    title: "Doctores",
    element: <div>Doctors</div>
  },
  {
    path: "/settings",
    title: "Configuración",
    element: <div>Settings</div>
  }
];