import type { Treatment } from "../../../../services/treatment/treatment.type";
import { TreatmentService } from "../../../../services/treatment/treatment.service";
import { useCatalog } from "@/hooks/useCatalog";

export const useTreatments = () => {
    const { setItem, ...rest } = useCatalog<Treatment>({
        fetchFn: TreatmentService.get
    });

    const resetItem = () => {
        setItem({
            id: 0, name: "", description: "",
            currencyId: 1, price: 0,
            isActive: true, durationMinutes: 30,
            currency: { id: 1, name: "Córdoba", code: "NIO", symbol: "C$" }
        });
    };

    return { resetItem, setItem, ...rest };
};