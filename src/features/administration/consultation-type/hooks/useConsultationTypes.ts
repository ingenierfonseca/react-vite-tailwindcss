import { useCatalog } from "../../../../hooks/useCatalog";
import { ConsultationTypeService } from "../../../../services/consultation-type/consultationType.service";
import type { ConsultationType } from "../../../../models/consultation.type";

export const useConsultationTypes = () => {
    const { setItem, ...rest } = useCatalog<ConsultationType>({
        fetchFn: ConsultationTypeService.get
    });

    const resetItem = () => {
        setItem({
            id: 0, name: ""
        });
    };

    return { resetItem, setItem, ...rest };
};
