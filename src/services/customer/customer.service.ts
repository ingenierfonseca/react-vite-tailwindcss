import type { AppointmentInfoDto } from "@/models/appointment.types";
import api from "../../api/api";
import { ENDPOINTS } from "../../api/endpoints";
import { createCatalogService } from "../baseCatalogService";
import type { Customer, CustomerImportDto, CustomerRiskDashboard, ResponseImportResult } from "./customer.type";

const method = ENDPOINTS.CUSTOMERS
const baseService = createCatalogService<Customer>(method);

export const CustomerService = {
    ...baseService,

    getDashboard: async () => {
        const { data } = await api.get(`${method}${`dashboard`}`);
        return data;
    },
    getCustomerRisk: async (id: number) : Promise<CustomerRiskDashboard[]> => {
        const { data } = await api.get(`${method}${id}/${`risk-dashboard`}`);
        return data;
    },
    getCustomerNextAppointment: async (id: number): Promise<AppointmentInfoDto> => {
        const { data } = await api.get(`${method}${id}/${`next-appointment`}`);
        return data;
    },
    bulkImport: async (customers: CustomerImportDto[]) : Promise<ResponseImportResult> => {
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