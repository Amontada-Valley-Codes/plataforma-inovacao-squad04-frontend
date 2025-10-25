// src/api/services/enterprise.service.ts
"use client";

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
    payload: Partial<Pick<ShowOneEnterpriseResponse, "sector" | "description" | "address" | "email">>
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

  async getMyEnterprise(): Promise<ShowOneEnterpriseResponse> {
    const { data } = await api.get(ENDPOINTS.ENTERPRISE.GET_MY_ENTERPRISE);
    return data;
  },
};
