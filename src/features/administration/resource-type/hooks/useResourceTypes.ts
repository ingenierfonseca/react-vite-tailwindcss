import { useCatalog } from "../../../../hooks/useCatalog";
import { ResourceTypeService } from "../../../../services/resource-type/resourceType.service";
import type { ResourceType } from "../../../../models/resourceType.type";

export const useResourceTypes = () => {
    const { setItem, ...rest } = useCatalog<ResourceType>({
        fetchFn: ResourceTypeService.get
    });

    const resetItem = () => {
        setItem({
            id: 0, name: ""
        });
    };

    return { resetItem, setItem, ...rest };
};
