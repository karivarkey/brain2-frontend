import axios, { type InternalAxiosRequestConfig } from "axios";
import { auth } from "./firebase";

export const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || "http://localhost:3000",
    headers: {
        "Content-Type": "application/json",
    },
});

// Optionally attach the Firebase auth token if needed by the backend
api.interceptors.request.use(async (config: InternalAxiosRequestConfig) => {
    const user = auth.currentUser;
    if (user) {
        const token = await user.getIdToken();
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});
