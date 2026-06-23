import { BarChart3, Calendar, LayoutDashboard, Receipt, Settings, Upload, Users, type LucideProps } from "lucide-react";
import { PermissionResource } from "./permission.enum";

export interface SubMenuAppModel {
    id: string,
    label: string,
    path: string,
    resource?: PermissionResource
}

export interface MenuAppModel {
    id: string,
    icon: React.ForwardRefExoticComponent<Omit<LucideProps, "ref"> & React.RefAttributes<SVGSVGElement>>,
    label: string,
    path?: string,
    badge?: string,
    count?: string,
    resource?: PermissionResource,
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
            badge: "3",
            resource: PermissionResource.Appointments
        },
        {
            id: "patients",
            icon: Users,
            label: "Pacientes",   //"Patients",
            count: "2.4k",
            path: "/patients",
            resource: PermissionResource.Patients
        },
        {
            id: "treatments",
            icon: BarChart3,
            label: "Tratamientos y expedientes",   //"Treatments and Records",
            path: "treatments",
            resource: PermissionResource.Treatments
        },
        {
            id: "invoice",
            icon: Receipt,
            label: "Facturación y pagos",   //"Billing and Insurance",
            path: "/invoice",
            resource: PermissionResource.Invoice
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
            resource: PermissionResource.Odontogram
        },
        {
            id: "superAdmin",
            icon: Settings,
            label: "Administración",
            submenu: [
                { id: "doctors", label: "Doctores", path: "doctors", resource: PermissionResource.Doctors },
                { id: "treatments", label: "Tratamientos", path: "treatments", resource: PermissionResource.Treatments },
                { id: "treatment-plans", label: "Planes de Tratamiento", path: "treatment-plans", resource: PermissionResource.TreatmentPlans },
                { id: "currencies", label: "Monedas", path: "currencies", resource: PermissionResource.Currencies },
                { id: "treatmentCategories", label: "Categorías de Tratamiento", path: "treatment-categories", resource: PermissionResource.TreatmentCategories },
                { id: "exchangeRates", label: "Tipos de Cambio", path: "exchange-rates", resource: PermissionResource.ExchangeRates },
                { id: "appointmentType", label: "Tipos de cita", path: "appointment-types", resource: PermissionResource.AppointmentTypes },
                { id: "users", label: "Usuarios", path: "users", resource: PermissionResource.Users },
                { id: "rolePermissions", label: "Roles y Permisos", path: "role-permissions", resource: PermissionResource.RolePermissions },
                { id: "roles", label: "Roles", path: "roles", resource: PermissionResource.Roles },
                { id: "permissions", label: "Permisos", path: "permissions", resource: PermissionResource.Permissions },
                { id: "userRoles", label: "Roles de Usuario", path: "user-roles", resource: PermissionResource.UserRoles },
                { id: "resourceTypes", label: "Tipos de Recurso", path: "resource-types", resource: PermissionResource.ResourceTypes },
                { id: "resources", label: "Recursos", path: "resources", resource: PermissionResource.Resources },
                { id: "appointmentStatuses", label: "Estados de Cita", path: "appointment-statuses", resource: PermissionResource.AppointmentStatuses },
                { id: "consultationTypes", label: "Tipos de Consulta", path: "consultation-types", resource: PermissionResource.ConsultationTypes },
                { id: "specialties", label: "Especialidades", path: "specialties", resource: PermissionResource.Specialties },
                { id: "staff", label: "Staff", path: "staff", resource: PermissionResource.Staff }
            ]
        },
        {
            id: "import",
            icon: Upload,
            label: "Carga de Datos",
            resource: PermissionResource.Uploads,
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