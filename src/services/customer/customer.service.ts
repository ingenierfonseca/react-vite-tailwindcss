import api from "../../api/api";
import { ENDPOINTS } from "../../api/endpoints";
import type { CustomerExcelRow } from "../../models/customerExcelRow.type";
import { createCatalogService } from "../baseCatalogService";
import type { Customer } from "./customer.type";

const method = ENDPOINTS.CUSTOMERS
const baseService = createCatalogService<Customer>(method);

export const CustomerService = {
    ...baseService,

    getDashboard: async () => {
        const { data } = await api.get(`${method}${`dashboard`}`);
        return data;
    },
    bulkImport: async (customers: CustomerExcelRow[]) => {
        const { data } = await api.post(`${method}${`bulk-import`}`, customers);
        return data;
    },
    uploadAvatar: async (id: number, file: any) => {
        const formData = new FormData();
        formData.append('file', file);
        const { data } = await api.post(`${method}${id}${'/upload-avatar'}`, formData, {
            headers: {
                "Content-Type": undefined
            }
        });
        return data;
    }
};