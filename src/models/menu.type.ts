import { BarChart3, Calendar, LayoutDashboard, Receipt, Settings, Users, type LucideProps } from "lucide-react";

export interface SubMenuAppModel {
    id: string,
    label: string
}

export interface MenuAppModel {
    id: string,
    icon: React.ForwardRefExoticComponent<Omit<LucideProps, "ref"> & React.RefAttributes<SVGSVGElement>>,
    label: string,
    path?: string,
    badge?: string,
    count?: string,
    submenu?: SubMenuAppModel[]
}

export function getMenuData() {
    const data: MenuAppModel[] = [
        {
            id: "dashboard",
            icon: LayoutDashboard,
            label: "Dashboard",
            path: "/dashboard",
            badge: "New"
        },
        {
            id: "appointments",
            icon: Calendar,
            label: "Citas",   //"Appointments",
            path: "/appointments",
            badge: "3"
        },
        {
            id: "patients",
            icon: Users,
            label: "Pacientes",   //"Patients",
            count: "2.4k",
            path: "/patients"
        },
        {
            id: "treatments",
            icon: BarChart3,
            label: "Tratamientos y expedientes",   //"Treatments and Records",
        },
        {
            id: "invoice",
            icon: Receipt,
            label: "Facturación y pagos",   //"Billing and Insurance",
            path: "/invoice"
        },
        {
            id: "performance",
            icon: BarChart3,
            label: "Desempeño de la clínica",   //"Clinic Performance"
        },
        {
            id: "odontogram",
            icon: Users,
            label: "Odontograma",
            path: "/odontogram",
        },
        {
            id: "reports",
            icon: BarChart3,
            label: "Reportes",  //"Reports",
        },
        {
            id: "configurations",
            icon: Settings,
            label: "Configuraciones",  //"Settings",
            count: "2.4k",
            submenu: [
                { id: "app", label: "app" },
                { id: "users", label: "users" }
            ]
        },
    ]
    return data
}