import { useCatalog } from "../../../../hooks/useCatalog";
import { AppointmentTypeService } from "../../../../services/appointment-type/appointmentType.service";
import type { AppointmentType } from "../../../../services/types/appointmentType.type";

export const useAppointmentTypes = () => {
    return useCatalog<AppointmentType>({
        fetchFn: AppointmentTypeService.get
    })
};