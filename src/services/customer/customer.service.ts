import type { AppointmentInfoDto } from "@/models/appointment.types";
import { api, ENDPOINTS } from "@/core/api";
import { createHttpClientRepository } from "@/features/clients/infrastructure/http-client.repository";
import type { Customer, CustomerImportDto, CustomerRiskDashboard, ResponseImportResult } from "./customer.type";

const method = ENDPOINTS.CUSTOMERS
export const customerRepository = createHttpClientRepository<Customer>(api, {
    endpoint: method,
    avatarEndpoint: ENDPOINTS.CUSTOMER_AVATAR,
});

export const CustomerService = {
    get: customerRepository.list,
    find: customerRepository.find,
    post: customerRepository.create,
    put: customerRepository.update,
    uploadAvatar: customerRepository.uploadAvatar!,

    getDashboard: async () => {
        const { data } = await api.get(ENDPOINTS.CUSTOMER_DASHBOARD);
        return data;
    },
    getCustomerRisk: async (id: number) : Promise<CustomerRiskDashboard[]> => {
        const { data } = await api.get(ENDPOINTS.CUSTOMER_RISK_DASHBOARD(id));
        return data;
    },
    getCustomerNextAppointment: async (id: number): Promise<AppointmentInfoDto> => {
        const { data } = await api.get(ENDPOINTS.CUSTOMER_NEXT_APPOINTMENT(id));
        return data;
    },
    bulkImport: async (customers: CustomerImportDto[]) : Promise<ResponseImportResult> => {
        const { data } = await api.post(ENDPOINTS.CUSTOMER_BULK_IMPORT, customers);
        return data;
    }
};
