import { BarChart3, BriefcaseMedical, Calendar, LayoutDashboard, Receipt, Settings, Users, type LucideProps } from "lucide-react";

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
            label: "Appointments",
            path: "/appointments",
            badge: "3"
        },
        {
            id: "patients",
            icon: Users,
            label: "Patients",
            count: "2.4k",
            submenu: [
                { id: "new", label: "new" },
                { id: "reports", label: "reports" }
            ]
        },
        {
            id: "invoice",
            icon: Receipt,
            label: "Factura",
            path: "/invoice"
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
            label: "Reports"
        },
        {
            id: "configurations",
            icon: Settings,
            label: "Configurations",
            count: "2.4k",
            submenu: [
                { id: "app", label: "app" },
                { id: "users", label: "users" }
            ]
        },
    ]
    return data
}