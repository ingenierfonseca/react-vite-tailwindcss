import { useEffect, useState } from "react";
import { AppointmentService } from "../../services/appointment/appointment.service"
import type { PaginatedResponse } from "../../models/paginatedResponse";
import type { Appointment } from "../../services/appointment/appointment.types";

export const useAppointments = () => {
  const [data, setData] = useState<PaginatedResponse<Appointment> | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<any>(null);
  const [currentPage] = useState(1)

  useEffect(() => {
    AppointmentService.getAllAppointments()
      .then(setData)
      .catch(setError)
      .finally(() => setLoading(false));
  }, []);

  return { data, loading, error, currentPage };
};