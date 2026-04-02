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