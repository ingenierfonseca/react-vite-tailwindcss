export const calculateAgeFromString = (dateString: string) => {
  const fechaNacimiento = new Date(dateString);
  const hoy = new Date();

  if (isNaN(fechaNacimiento.getTime())) {
    return "Fecha inválida";
  }

  let edad = hoy.getFullYear() - fechaNacimiento.getFullYear();
  const mes = hoy.getMonth() - fechaNacimiento.getMonth();

  // 2. Ajustar si aún no ha cumplido años este año
  if (mes < 0 || (mes === 0 && hoy.getDate() < fechaNacimiento.getDate())) {
    edad--;
  }

  return edad;
};

export function formatDateDDMMYYYY(strDate?: string) {
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

export const formatDateToMMDameDDYYYY = (strDate: string) => {
  const date = new Date(strDate);

  const formatted = new Intl.DateTimeFormat("en-US", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(date);

  return formatted.replace(",", ",");
};

export const formatDateToMMDameDDYYYYTime = new Date().toLocaleString("en-US", {
  month: "short",
  day: "numeric",
  year: "numeric",
  hour: "numeric",
  minute: "2-digit",
  hour12: true,
});