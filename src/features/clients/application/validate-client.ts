import type { Client } from "../domain/client";
import { validateBirthDate } from "@/utils/date.util";
import { validateEmail } from "@/utils/email.util";
import { validatePhoneNumber } from "@/utils/number.util";

export interface ClientValidationMessages {
  idRequired: string;
  invalidIdentityCard: string;
  invalidPassport: string;
  firstNameRequired: string;
  lastNameRequired: string;
  genderRequired: string;
  departmentRequired: string;
  cityRequired: string;
  addressRequired: string;
  birthDateRequired: string;
  invalidBirthDate: string;
  invalidPhone: string;
  invalidEmail: string;
  avatarUploadUnavailable: string;
}

export function validateClient(
  client: Client,
  messages: ClientValidationMessages,
): string | null {
  if (!client.dni.trim()) return messages.idRequired;
  if (client.idType === 1 && !/^\d{3}-\d{6}-\d{4}[A-Z]$/.test(client.dni.trim().toUpperCase())) {
    return messages.invalidIdentityCard;
  }
  if (client.idType === 2 && !/^[A-Z0-9]{1,9}$/i.test(client.dni.trim())) {
    return messages.invalidPassport;
  }
  if (!client.firstName.trim()) return messages.firstNameRequired;
  if (!client.lastName.trim()) return messages.lastNameRequired;
  if (!client.gender.trim()) return messages.genderRequired;
  if (!client.birthDate.trim()) return messages.birthDateRequired;

  const birthDateValidation = validateBirthDate(new Date(client.birthDate));
  if (!birthDateValidation.isValid) return messages.invalidBirthDate;

  if (client.departmentId == null || client.departmentId <= 0) return messages.departmentRequired;
  if (client.cityId == null || client.cityId <= 0) return messages.cityRequired;
  if (!client.address!.trim()) return messages.addressRequired;
  

  if (client.phone?.trim() && !validatePhoneNumber(client.phone.trim())) {
    return messages.invalidPhone;
  }
  if (client.email?.trim() && !validateEmail(client.email.trim())) {
    return messages.invalidEmail;
  }

  return null;
}
