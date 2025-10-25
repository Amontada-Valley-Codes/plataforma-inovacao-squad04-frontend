// src/lib/axios.ts
import axios from "axios";

const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL, // ex.: http://localhost:3001
    withCredentials: true,                     // 🔑 envia cookies
    headers: { "Content-Type": "application/json" },
});

export default api;
