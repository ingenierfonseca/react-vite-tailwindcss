import { ENDPOINTS } from "../../api/endpoints";
import { createCatalogService } from "../baseCatalogService";
import type { ResourceType } from "../../models/resourceType.type";

export const ResourceTypeService = createCatalogService<ResourceType>(ENDPOINTS.RESOURCETYPE);
