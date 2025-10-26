// src/api/services/enterprise.service.ts
import api from "../axios";
import { ENDPOINTS } from "../endpoints";
import {
  CreateEnterprisePayload,
  CreateEnterpriseResponse,
  ShowAllEnterpriseResponse,
  ShowOneEnterpriseResponse,
} from "../payloads/enterprise.payload";

export const enterpriseService = {
  async createEnterprise(payload: CreateEnterprisePayload): Promise<CreateEnterpriseResponse> {
    const { data } = await api.post(ENDPOINTS.ENTERPRISE.CREATE, payload);
    return data;
  },

  async showAllEnterprises(): Promise<ShowAllEnterpriseResponse[]> {
    const { data } = await api.get(ENDPOINTS.ENTERPRISE.SHOW_ALL);
    return data;
  },

  async showOneEnterprise(id: string): Promise<ShowOneEnterpriseResponse> {
    const { data } = await api.get(ENDPOINTS.ENTERPRISE.SHOW_ONE_ENTERPRISE(id));
    return data;
  },

  async updateEnterprise(
    id: string,
    payload: Partial<{ sector: string; description: string; address: string; email: string }>
  ): Promise<ShowOneEnterpriseResponse> {
    const { data } = await api.put(`/enterprise/${id}`, payload);
    return data;
  },

  async updateCoverImage(file: File): Promise<void> {
    if (typeof window === "undefined") return;
    const formData = new FormData();
    formData.append("coverImage", file);
    await api.patch("/enterprise/coverImage", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },

  async updateProfileImage(file: File): Promise<void> {
    if (typeof window === "undefined") return;
    const formData = new FormData();
    formData.append("profileImage", file);
    await api.patch("/enterprise/profileImage", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },

  // 👇 robusto: 404 -> null; tenta fallback de rota alternativa, se existir
  async getMyEnterprise(): Promise<ShowOneEnterpriseResponse | null> {
  try {
    console.log("GET enterpriseMe ->", api.defaults.baseURL,
      "hasToken?", !!(typeof window !== "undefined" && localStorage.getItem("access_token")));
    const { data } = await api.get("/enterprise/user/enterpriseMe");
    return data;
  } catch (err: any) {
    console.log("enterpriseMe ERR:", err?.response?.status, err?.response?.data);
    if (err?.response?.status === 404) return null;
    throw err;
  }
}
};
