import { useCatalog } from "../../../../hooks/useCatalog";
import { TreatmentPlanService } from "../../../../services/treatment-plan/treatmentPlan.service";
import type { TreatmentPlan } from "../../../../services/treatment-plan/treatmentPlan.type";

export const useTreatmentPlans = () => {
    const { setItem, ...rest } = useCatalog<TreatmentPlan>({
        fetchFn: TreatmentPlanService.get
    });

    const resetItem = () => {
        setItem({
            id: 0, title: "", description: "", categoryId: 1,
            currencyId: 1, complexity: "Media",
            estimatedDurationMonths: 1, basePrice: 0,
            version: 1, isActive: true,
            items: [],
            currency: { id: 1, name: "Córdoba", code: "NIO", symbol: "C$" }
        });
    };

    return { resetItem, setItem, ...rest };
};
