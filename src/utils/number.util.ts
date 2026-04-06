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