export interface CompanyProfile {
  name: string;
  legalName: string;
  taxId: string;
  email: string;
  phone: string;
  address: string;
}

export interface BrandTheme {
  logoUrl: string;
  faviconUrl: string;
  primaryColor: string;
  primaryDarkColor: string;
  secondaryColor: string;
  borderColor: string;
  borderHover: string;
  sidebarBackground: string;
  sidebarItemBackground: string;
  sidebarText: string;
  sidebarActiveText: string;
  companyNameColor: string;
  companyNameColorDark: string;
  logoBackgroundColor: string;
}

export interface CompanySettings {
  id: number;
  company: CompanyProfile;
  branding: BrandTheme;
  version: string;
}

export function createDefaultCompanySettings(): CompanySettings {
  return {
    id: 1,
    company: {
      name: "Clínica Fonseca",
      legalName: "",
      taxId: "",
      email: "",
      phone: "",
      address: "",
    },
    branding: {
      logoUrl: "",
      faviconUrl: "",
      primaryColor: "#002941",
      primaryDarkColor: "#556ade",
      secondaryColor: "#1765D1",
      borderColor: "#dfeaf2",
      borderHover: "#fbbf24",
      sidebarBackground: "#002941",
      sidebarItemBackground: "#FD6E6E",
      sidebarText: "#CFEBE1",
      sidebarActiveText: "#002941",
      companyNameColor: "#ffffff",
      companyNameColorDark: "#ffffff",
      logoBackgroundColor: "#CFEBE1",
    },
    version: "1.0.0",
  };
}

const HEX_COLOR = /^#(?:[0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/;

export function validateCompanySettings(settings: CompanySettings): string | null {
  if (!settings.company.name.trim()) return "El nombre de la empresa es obligatorio.";
  if (settings.company.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(settings.company.email)) {
    return "El correo de la empresa no es válido.";
  }

  const colors: Array<[string, string]> = [
    ["Color principal", settings.branding.primaryColor],
    ["Color principal oscuro", settings.branding.primaryDarkColor],
    ["Color secundario", settings.branding.secondaryColor],
    ["Color de bordes", settings.branding.borderColor],
    ["Color de hover", settings.branding.borderHover],
    ["Fondo del sidebar", settings.branding.sidebarBackground],
    ["Fondo de elemento del sidebar", settings.branding.sidebarItemBackground],
    ["Texto del sidebar", settings.branding.sidebarText],
    ["Texto activo del sidebar", settings.branding.sidebarActiveText],
    ["Nombre de la empresa", settings.branding.companyNameColor],
    ["Nombre de la empresa en modo oscuro", settings.branding.companyNameColorDark],
    ["Fondo del logo", settings.branding.logoBackgroundColor],
  ];

  const invalidColor = colors.find(([, value]) => !HEX_COLOR.test(value));
  if (invalidColor) return `${invalidColor[0]} debe ser un color hexadecimal válido.`;

  for (const [label, value] of [["Logo", settings.branding.logoUrl], ["Favicon", settings.branding.faviconUrl]]) {
    if (value && !/^(https?:\/\/|\/(?!\/))[^\s]+$/i.test(value)) {
      return `${label}: ingresa una URL http(s) válida o una ruta local.`;
    }
  }

  return null;
}
