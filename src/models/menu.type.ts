import { BarChart3, Calendar, LayoutDashboard, Receipt, Settings, Upload, Users, type LucideProps } from "lucide-react";

export interface SubMenuAppModel {
    id: string,
    label: string,
    path: string,
    resource?: string
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
            path: "treatments"
        },
        {
            id: "invoice",
            icon: Receipt,
            label: "Facturación y pagos",   //"Billing and Insurance",
            path: "/invoice"
        },
        /*{
            id: "performance",
            icon: BarChart3,
            label: "Desempeño de la clínica",   //"Clinic Performance"
        },*/
        {
            id: "odontogram",
            icon: Users,
            label: "Odontograma",
            path: "/odontogram",
        },
        {
            id: "superAdmin",
            icon: Settings,
            label: "Administración",
            submenu: [
                { id: "doctors", label: "Doctores", path: "doctors", resource: "doctors" },
                { id: "treatments", label: "Tratamientos", path: "treatments", resource: "treatments" },
                { id: "treatment-plans", label: "Planes de Tratamiento", path: "treatment-plans", resource: "treatmentplans" },
                { id: "currencies", label: "Monedas", path: "currencies", resource: "currencies" },
                { id: "treatmentCategories", label: "Categorías de Tratamiento", path: "treatment-categories", resource: "treatmentcategories" },
                { id: "exchangeRates", label: "Tipos de Cambio", path: "exchange-rates", resource: "exchangerates" },
                { id: "appointmentType", label: "Tipos de cita", path: "appointment-types", resource: "appointmenttypes" },
                { id: "users", label: "Usuarios", path: "users", resource: "users" },
                { id: "rolePermissions", label: "Roles y Permisos", path: "role-permissions", resource: "rolepermissions" },
                { id: "roles", label: "Roles", path: "roles", resource: "roles" },
                { id: "permissions", label: "Permisos", path: "permissions", resource: "permissions" },
                { id: "resourceTypes", label: "Tipos de Recurso", path: "resource-types", resource: "resourcetypes" },
                { id: "resources", label: "Recursos", path: "resources", resource: "resources" },
                { id: "appointmentStatuses", label: "Estados de Cita", path: "appointment-statuses", resource: "appointmentstatuses" },
                { id: "consultationTypes", label: "Tipos de Consulta", path: "consultation-types", resource: "consultationtypes" },
                { id: "specialties", label: "Especialidades", path: "specialties", resource: "specialties" }
            ]
        },
        {
            id: "import",
            icon: Upload,
            label: "Carga de Datos",
            submenu: [
                { id: "patients", label: "Importar Pacientes", path: "imports/patients" }
            ]
        }
        /*{
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
        },*/
    ]
    return data
}