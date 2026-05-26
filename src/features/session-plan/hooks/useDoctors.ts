import { DoctorService } from "@/services/doctor/doctor.service";
import { mapToDropdown } from "@/utils/dropdow.util";
import { useQuery } from "@tanstack/react-query";

export const useDoctors = () => {
    return useQuery({
        queryKey: ["doctors"],
        queryFn: async () => {
            const res = await DoctorService.get({
                page: 1,
                search: "",
            });

            return mapToDropdown(
                res.data,
                x => x.id,
                x => x.firstName
            );
        },
    });
};