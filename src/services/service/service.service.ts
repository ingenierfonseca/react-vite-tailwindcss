import { ENDPOINTS } from "../../api/endpoints";
import { createCatalogService } from "../baseCatalogService";
import type { Service } from "@/models/service.type";

export const ServiceService = createCatalogService<Service>(ENDPOINTS.SERVICE);
