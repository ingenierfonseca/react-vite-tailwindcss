import { useCatalog } from "@/hooks/useCatalog";
import type { Staff } from "@/models/staff.type";
import { StaffService } from "@/services/staff/staff.service";

export const useStaffList = () => {
    const { setItem, ...rest } = useCatalog<Staff>({ fetchFn: StaffService.get });
    const resetItem = () => {
        setItem({ id: 0, firstName: "", lastName: "", birthDate: "", gender: "", email: "", phone: "", address: "", avatar: "" });
    };
    return { resetItem, setItem, ...rest };
};
