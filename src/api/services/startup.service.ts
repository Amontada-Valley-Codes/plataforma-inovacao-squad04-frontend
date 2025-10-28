/* eslint-disable @typescript-eslint/no-explicit-any */

import api from "../axios";
import { ENDPOINTS } from "../endpoints";
import {
  CreateStartupPayload,
  CreateStartupResponse,
  ShowAllStartupsResponse,
} from "../payloads/startup.payload";

export const startupService = {
  async showAllStartups(): Promise<ShowAllStartupsResponse[]> {
    try {
      const { data } = await api.get(ENDPOINTS.STARTUP.SHOW_ALL);
      return Array.isArray(data) ? data : [];
    } catch (err: any) {
      const status = err?.response?.status;
      // 🔧 Se o back devolver 404 (por role), tratamos como lista vazia para não quebrar a UI
      if (status === 404) {
        console.warn("[STARTUP] GET /api/startup → 404 (tratado como [])");
        return [];
      }
      console.error("[STARTUP] GET /api/startup falhou:", {
        status,
        url: err?.config?.url,
        baseURL: err?.config?.baseURL,
        data: err?.response?.data,
      });
      throw err;
    }
  },

  async showOneStartup(id: string) {
    try {
      const { data } = await api.get(ENDPOINTS.STARTUP.SHOW_ONE(id));
      return data;
    } catch (err: any) {
      console.error("[STARTUP] GET /api/startup/{id} falhou:", {
        status: err?.response?.status,
        url: err?.config?.url,
        data: err?.response?.data,
      });
      throw err;
    }
  },

  async createStartup(
    payload: CreateStartupPayload
  ): Promise<CreateStartupResponse> {
    try {
      const { data } = await api.post(ENDPOINTS.STARTUP.CREATE, payload);
      return data;
    } catch (err: any) {
      console.error("[STARTUP] POST /api/startup falhou:", {
        status: err?.response?.status,
        url: err?.config?.url,
        data: err?.response?.data,
      });
      throw err;
    }
  },
};
