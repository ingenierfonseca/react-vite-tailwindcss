export function formatDate(strDate?: string) {
    const date = strDate!= null ? new Date(strDate) : new Date();

    const formatted = `${date.getDate().toString().padStart(2, "0")}/${
    (date.getMonth() + 1).toString().padStart(2, "0")
    }/${date.getFullYear()}`;

    return formatted
}

export function formatDateToYYYYMMDD(date?: string | Date) {
  if (!date) return "";
  return new Date(date).toISOString().split("T")[0];
}

export function formatNumber(value: number): string {
  return new Intl.NumberFormat("es-NI", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(value);
}