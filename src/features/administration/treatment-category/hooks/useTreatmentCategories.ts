import { useCatalog } from "../../../../hooks/useCatalog";
import { TreatmentCategoryService } from "../../../../services/treatmentCategory.service";
import type { TreatmentCategory } from "../../../../models/treatmentCategory.type";

export const useTreatmentCategories = () => {
    const { setItem, ...rest } = useCatalog<TreatmentCategory>({
        fetchFn: TreatmentCategoryService.get
    });

    const resetItem = () => {
        setItem({
            id: 0, name: "", description: "", isActive: true
        });
    };

    return { resetItem, setItem, ...rest };
};
