export function formatNumber(value: number): string {
  return new Intl.NumberFormat("es-NI", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(value);
}

export function validatePhoneNumber(phone: string): boolean {
  const phoneRegex = /^\d{8}$/;
  return phoneRegex.test(phone);
}

export function formatPhoneNumber(phone: string): string {
  if (phone.trim().length === 8) {
    return `${phone.slice(0, 4)}-${phone.slice(4)}`;
  }
  return phone;
}