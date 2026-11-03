import type { CompanySettings } from "../domain/company-settings";
import { createDefaultCompanySettings } from "../domain/company-settings";

export interface CompanySettingsDto {
  id?: number;
  appName?: string;
  companyName?: string;
  legalName?: string;
  taxId?: string;
  companyEmail?: string;
  companyPhone?: string;
  companyAddress?: string;
  appLogoUrl?: string;
  appFaviconUrl?: string;
  primaryColor?: string;
  primaryDarkColor?: string;
  secondaryColor?: string;
  borderColor?: string;
  borderHover?: string;
  bgSidebar?: string;
  bgSidebarItem?: string;
  sidebarItemText?: string;
  sidebarItemTextActive?: string;
  companyNameColor?: string;
  companyNameColorDark?: string;
  logoBackgroundColor?: string;
  version?: string;
}

export function toCompanySettings(dto: CompanySettingsDto): CompanySettings {
  const defaults = createDefaultCompanySettings();
  return {
    id: dto.id ?? defaults.id,
    version: dto.version ?? defaults.version,
    company: {
      name: dto.companyName ?? dto.appName ?? defaults.company.name,
      legalName: dto.legalName ?? defaults.company.legalName,
      taxId: dto.taxId ?? defaults.company.taxId,
      email: dto.companyEmail ?? defaults.company.email,
      phone: dto.companyPhone ?? defaults.company.phone,
      address: dto.companyAddress ?? defaults.company.address,
    },
    branding: {
      logoUrl: dto.appLogoUrl ?? defaults.branding.logoUrl,
      faviconUrl: dto.appFaviconUrl ?? defaults.branding.faviconUrl,
      primaryColor: dto.primaryColor ?? defaults.branding.primaryColor,
      primaryDarkColor: dto.primaryDarkColor ?? defaults.branding.primaryDarkColor,
      secondaryColor: dto.secondaryColor ?? defaults.branding.secondaryColor,
      borderColor: dto.borderColor ?? defaults.branding.borderColor,
      borderHover: dto.borderHover ?? defaults.branding.borderHover,
      sidebarBackground: dto.bgSidebar ?? defaults.branding.sidebarBackground,
      sidebarItemBackground: dto.bgSidebarItem ?? defaults.branding.sidebarItemBackground,
      sidebarText: dto.sidebarItemText ?? defaults.branding.sidebarText,
      sidebarActiveText: dto.sidebarItemTextActive ?? defaults.branding.sidebarActiveText,
      companyNameColor: dto.companyNameColor ?? defaults.branding.companyNameColor,
      companyNameColorDark: dto.companyNameColorDark ?? defaults.branding.companyNameColorDark,
      logoBackgroundColor: dto.logoBackgroundColor ?? dto.bgSidebarItem ?? defaults.branding.logoBackgroundColor,
    },
  };
}

export function fromCompanySettings(settings: CompanySettings): CompanySettingsDto {
  return {
    id: settings.id,
    appName: settings.company.name,
    companyName: settings.company.name,
    legalName: settings.company.legalName,
    taxId: settings.company.taxId,
    companyEmail: settings.company.email,
    companyPhone: settings.company.phone,
    companyAddress: settings.company.address,
    appLogoUrl: settings.branding.logoUrl,
    appFaviconUrl: settings.branding.faviconUrl,
    primaryColor: settings.branding.primaryColor,
    primaryDarkColor: settings.branding.primaryDarkColor,
    secondaryColor: settings.branding.secondaryColor,
    borderColor: settings.branding.borderColor,
    borderHover: settings.branding.borderHover,
    bgSidebar: settings.branding.sidebarBackground,
    bgSidebarItem: settings.branding.sidebarItemBackground,
    sidebarItemText: settings.branding.sidebarText,
    sidebarItemTextActive: settings.branding.sidebarActiveText,
    companyNameColor: settings.branding.companyNameColor,
    companyNameColorDark: settings.branding.companyNameColorDark,
    logoBackgroundColor: settings.branding.logoBackgroundColor,
    version: settings.version,
  };
}
