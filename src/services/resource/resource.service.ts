import { ENDPOINTS } from "../../api/endpoints";
import { createCatalogService } from "../baseCatalogService";
import type { Resource } from "../../models/resource.type";

export const ResourceService = createCatalogService<Resource>(ENDPOINTS.RESOURCE);
