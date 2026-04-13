import { useEffect, useState } from "react";
import { AuthService } from "../../services/auth/auth.service";

export const useLayout = () => {
    const [token] = useState(localStorage.getItem("token"));
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<any>(null);

    useEffect(() => {
        if (token === null || token === undefined) {
            console.log("Token en Layout: null o undefined ", token);
            AuthService.get()
                .then()
                .catch(setError)
                .finally(() => setLoading(false));
        }
    }, []);

    return {
        loading,
        error
    };
};