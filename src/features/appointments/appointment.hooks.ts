import { useEffect, useState } from "react";
import type { Paggination } from "../../services/appointment/appointment.types";
import { AppointmentService } from "../../services/appointment/appointment.service"

export const useAppointments = () => {
  const [data, setData] = useState<Paggination | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<any>(null);
  const [currentPage, setCurrentPage] = useState(1)

  useEffect(() => {
    AppointmentService.getAllAppointments()
      .then(setData)
      .catch(setError)
      .finally(() => setLoading(false));
  }, []);

  return { data, loading, error, currentPage };
};