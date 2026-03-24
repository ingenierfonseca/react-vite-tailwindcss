import api from "../../api/api";

const method = `/appointment/`
export const AppointmentService = {
    getAllAppointments: async () => {
        const { data } = await api.get(`${method}`);
        return data;
    },
    /*getToothHistory: async (patientId: string, toothId: string) => {
        const { data } = await api.get(`/${method}/${patientId}/${toothId}`);
        return data;
    },
    updateSurface: async (payload: ToothUpdate) => {
        const { data } = await api.post('/teeth/update-surface', payload);
        return data;
    }*/
};