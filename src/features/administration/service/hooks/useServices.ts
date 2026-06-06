import { ServiceService } from "@/services/service/service.service";
import { useCatalog } from "../../../../hooks/useCatalog";
import type { Service } from "@/models/service.type";

export const useServices = () => {
    const { setItem, ...rest } = useCatalog<Service>({
        fetchFn: ServiceService.get
    });

    const resetItem = () => {
        setItem({
            id: 0, name: "", isActive: true
        });
    };

    return { resetItem, setItem, ...rest };
};
