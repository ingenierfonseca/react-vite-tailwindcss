const MAX_VALID_AGE = 120;
export const validateBirthDate = (birthDate: Date): { isValid: boolean; message: string } => {
  const today = new Date();
  
  const todayNoTime = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  const birthDateNoTime = new Date(birthDate.getFullYear(), birthDate.getMonth(), birthDate.getDate());

  if (birthDateNoTime > todayNoTime) {
    return { isValid: false, message: "La fecha de nacimiento no puede ser una fecha futura." };
  }

  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  const dayDiff = today.getDate() - birthDate.getDate();

  if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
    age--;
  }

  if (age > MAX_VALID_AGE) {
    return { 
      isValid: false, 
      message: `La fecha de nacimiento es inválida (edad máxima permitida: ${MAX_VALID_AGE} años).` 
    };
  }

  return { isValid: true, message: "OK" };
};

export const calculateAgeFromString = (dateString: string) => {
  const fechaNacimiento = new Date(dateString);
  const hoy = new Date();

  if (isNaN(fechaNacimiento.getTime())) {
    return "";
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

export function minutesToTime(minutes: number) {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  const secs = 0;

  return `${String(hours).padStart(2, '0')}:` +
         `${String(mins).padStart(2, '0')}:` +
         `${String(secs).padStart(2, '0')}`;
}

export function timeToMinutes(time: string) {
  const [hours, minutes, seconds] = time.split(':').map(Number);
  return hours * 60 + minutes + Math.floor(seconds / 60);
}

export function addDays(dateString: string, days: number): string {
  const date = new Date(dateString);
  date.setDate(date.getDate() + days);

  return date.toISOString().split("T")[0];
}

export function calculateMonthsBetweenDates(startDate: string, endDate: string): number {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const yearsDifference = end.getFullYear() - start.getFullYear();
  const monthsDifference = end.getMonth() - start.getMonth();
  return yearsDifference * 12 + monthsDifference;
}