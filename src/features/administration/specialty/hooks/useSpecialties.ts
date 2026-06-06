import { useCatalog } from "../../../../hooks/useCatalog";
import { SpecialtyService } from "../../../../services/specialty/specialty.service";
import type { Specialty } from "../../../../models/specialty.type";

export const useSpecialties = () => {
    const { setItem, ...rest } = useCatalog<Specialty>({
        fetchFn: SpecialtyService.get
    });

    const resetItem = () => {
        setItem({
            id: 0, name: ""
        });
    };

    return { resetItem, setItem, ...rest };
};
