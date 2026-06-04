import { useCatalog } from "../../../../hooks/useCatalog";
import { AppointmentStatusService } from "../../../../services/appointment-status/appointmentStatus.service";
import type { AppointmentStatus } from "../../../../models/appointmentStatus.type";

export const useAppointmentStatuses = () => {
    const { setItem, ...rest } = useCatalog<AppointmentStatus>({
        fetchFn: AppointmentStatusService.get
    });

    const resetItem = () => {
        setItem({
            id: 0, name: ""
        });
    };

    return { resetItem, setItem, ...rest };
};
