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
  // Criar empresa
  async createEnterprise(
    createEnterprisePayload: CreateEnterprisePayload
  ): Promise<CreateEnterpriseResponse> {
    const response = await api.post(ENDPOINTS.ENTERPRISE.CREATE, createEnterprisePayload);
    return response.data;
  },

  // Listar todas
  async showAllEnterprises(): Promise<ShowAllEnterpriseResponse[]> {
    const response = await api.get(ENDPOINTS.ENTERPRISE.SHOW_ALL);
    return response.data;
  },

  // Buscar uma empresa
  async showOneEnterprise(id: string): Promise<ShowOneEnterpriseResponse> {
    const response = await api.get(ENDPOINTS.ENTERPRISE.SHOW_ONE_ENTERPRISE(id));
    return response.data;
  },

  // Atualizar dados principais
  async updateEnterprise(
    id: string,
    payload: Partial<{
      sector: string;
      description: string;
      address: string;
      email: string;
    }>
  ): Promise<ShowOneEnterpriseResponse> {
    const response = await api.put(`/enterprise/${id}`, payload);
    return response.data;
  },

  // Atualizar capa (PATCH /enterprise/coverImage)
  async updateCoverImage(file: File): Promise<void> {
    if (typeof window === "undefined") return; // garante que não rode no SSR
    const formData = new FormData();
    formData.append("coverImage", file);
    await api.patch("/enterprise/coverImage", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },

  // Atualizar imagem de perfil (PATCH /enterprise/profileImage)
  async updateProfileImage(file: File): Promise<void> {
    if (typeof window === "undefined") return; // idem
    const formData = new FormData();
    formData.append("profileImage", file);
    await api.patch("/enterprise/profileImage", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },
};
