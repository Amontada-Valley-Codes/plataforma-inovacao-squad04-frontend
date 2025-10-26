import axios from "axios";

const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL || "",
    timeout: 10000,
    headers: { "Content-Type": "application/json" },
    withCredentials: false,
});

// Interceptor seguro (não roda em SSR)
api.interceptors.request.use(
    (config) => {
        if (typeof window !== "undefined") {
            const token = localStorage.getItem("access_token");
            if (token) {
                config.headers = config.headers ?? {};
                (config.headers as Record<string, string>).Authorization = `Bearer ${token}`;
            }
        }
        return config;
    },
    (error) => Promise.reject(error)
);

export default api;
