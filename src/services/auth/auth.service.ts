import api from "../../api/api";

const method = `/auth/`
export const AuthService = {
    get: async () => {
        const { data } = await api.get(`${method}`);
        console.log(data);
        localStorage.setItem("token", data.token);
        return data;
    }
}