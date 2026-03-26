export function formatDate(strDate: string) {
    const date = new Date(strDate);

    /*const formatted = date.toLocaleString("es-NI", {
    dateStyle: "medium",
    timeStyle: "short"
    });*/

    const formatted = `${date.getDate().toString().padStart(2, "0")}/${
    (date.getMonth() + 1).toString().padStart(2, "0")
    }/${date.getFullYear()}`;

    return formatted
}

export function formatNumber(value: number): string {
  return new Intl.NumberFormat("es-NI", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(value);
}