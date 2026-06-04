import { useCatalog } from "../../../../hooks/useCatalog";
import { ResourceService } from "../../../../services/resource/resource.service";
import type { Resource } from "../../../../models/resource.type";

export const useResources = () => {
    const { setItem, ...rest } = useCatalog<Resource>({
        fetchFn: ResourceService.get
    });

    const resetItem = () => {
        setItem({
            id: 0, resourceTypeId: 0, name: "", description: "",
            capacity: 1, color: "#3b82f6", isActive: true
        });
    };

    return { resetItem, setItem, ...rest };
};
