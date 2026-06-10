import { useState } from "react";
import { useCatalog } from "../../../../hooks/useCatalog";
import { DoctorService } from "../../../../services/doctor/doctor.service";
import type {  DoctorInfoDTO } from "../../../../services/doctor/doctor.type";

export const useDoctors = () => {
    const [id, setId] = useState(0)
    const { ...rest } = useCatalog<DoctorInfoDTO>({
        fetchFn: DoctorService.get
    });

    return { id, setId, ...rest };
};
