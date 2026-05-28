import { useCatalog } from "../../../../hooks/useCatalog";
import { DoctorService } from "../../../../services/doctor/doctor.service";
import type { Doctor } from "../../../../services/doctor/doctor.type";

export const useDoctors = () => {
    const { setItem, ...rest } = useCatalog<Doctor>({
        fetchFn: DoctorService.get
    });

    const resetItem = () => {
        setItem({
            id: 0, firstName: "", lastName: "", age: 0, specialist: "", phone: ""
        });
    };

    return { resetItem, setItem, ...rest };
};
