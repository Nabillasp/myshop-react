import axios from "axios";

// Membaca VITE_API_URL dari environment variable dengan fallback localhost untuk development
const rawApiUrl = (import.meta.env.VITE_API_URL || "http://127.0.0.1:8000/api").trim();
const cleanUrl = rawApiUrl.replace(/\/+$/, "");
const apiBaseUrl = cleanUrl.endsWith("/api") ? cleanUrl : `${cleanUrl}/api`;

const apiClient = axios.create({
    baseURL: apiBaseUrl,
    headers: {
        Accept: "application/json",
    },
});

apiClient.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");

    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
});

export default apiClient;