import api from "../axios"
import { ENDPOINTS } from "../endpoints"
import { adminDasboardResponse, gestorDasboardResponse } from "../payloads/dashboard.payload";

export const dashboardService = {
  async getAdminDashboard(): Promise<adminDasboardResponse>{
    const response = await api.get(ENDPOINTS.DASHBOARD.ADMIN);
    console.log(response.data);
    return response.data
  },

  async getGestorDashboard(): Promise<gestorDasboardResponse>{
    const response = await api.get(ENDPOINTS.DASHBOARD.GESTOR);
    console.log(response.data);
    return response.data
  }
}