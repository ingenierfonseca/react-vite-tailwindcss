export const PermissionAction = {
  View: "view",
  Create: "create",
  Update: "update",
} as const;

export type PermissionAction = (typeof PermissionAction)[keyof typeof PermissionAction];

export const PermissionResource = {
  Appointments: "appointments",
  Patients: "patients",
  PatientsTreatmentPlans: "patientstreatmentplans",
  Doctors: "doctors",
  Treatments: "treatments",
  TreatmentPlans: "treatmentplans",
  Currencies: "currencies",
  TreatmentCategories: "treatmentcategories",
  ExchangeRates: "exchangerates",
  AppointmentTypes: "appointmenttypes",
  Users: "users",
  RolePermissions: "rolepermissions",
  Roles: "roles",
  Permissions: "permissions",
  Invoice: "invoice",
  ConsultationHistory: "consultationhistory",
  ResourceTypes: "resourcetypes",
  Resources: "resources",
  AppointmentStatuses: "appointmentstatuses",
  ConsultationTypes: "consultationtypes",
  Specialties: "specialties",
  Services: "services",
  Staff: "staff",
  Uploads: "uploads",
  Odontogram: "odontogram",
  UserRoles: "userroles",
} as const;

export type PermissionResource = (typeof PermissionResource)[keyof typeof PermissionResource];
