import AppointmentList from "../features/appointments/AppointmentList";
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