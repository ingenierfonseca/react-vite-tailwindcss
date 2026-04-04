import api from "../../api/api";
import { data, type Settings } from "./settigns.type";

const method = `/settings/`
export const SettingsService = {
    getSettings: async ():Promise<Settings> => {
        //const { data } = await api.get(`${method}${1}`);
        return data();
    },
    updateSettings: async (payload: Settings | null) => {
        const { data } = await api.put(`${method}`, payload);
        return data;
    }
};