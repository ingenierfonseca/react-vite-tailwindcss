import { useCatalog } from "../../../../hooks/useCatalog";
import { AppointmentTypeService } from "../../../../services/appointment-type/appointmentType.service";
import type { AppointmentType } from "../../../../models/appointmentType.type";

export const useAppointmentTypes = () => {
    const { setItem, ...rest } =  useCatalog<AppointmentType>({
        fetchFn: AppointmentTypeService.get
    })

    const resetItem = () => {
        setItem({
            id: 0,
            name: '',
            description: '',
            durationMinutes: 30
        })
    }

    return {
        resetItem,
        setItem,
        ...rest
    }
};