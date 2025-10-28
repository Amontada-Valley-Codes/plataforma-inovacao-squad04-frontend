import api from "../axios";
import { ENDPOINTS } from "../endpoints";
import { 
  CreateKPIsPayload,
  CreateKPIsResponse,
  DeleteKPIsResponse,
  ShowKPIsResponse,
  UpdateKPIsPayload,
  UpdateKPIsResponse
 } from "../payloads/kpis.payload";

export const kpisService = {
  async createKpi(experimentationId: string, payload: CreateKPIsPayload): Promise<CreateKPIsResponse> {
    const response = await api.post(ENDPOINTS.KPIS.CREATE_KPI(experimentationId), payload)
    console.log(response.data)
    return response.data
  },

  async showKpi(kpiId: string): Promise<ShowKPIsResponse> {
    const response = await api.get(ENDPOINTS.KPIS.SHOW_KPI(kpiId))
    console.log(response.data)
    return response.data
  },

  async updateKpi(kpiId: string, payload: UpdateKPIsPayload): Promise<UpdateKPIsResponse> {
    const response = await api.patch(ENDPOINTS.KPIS.UPDATE_KPI(kpiId), payload)
    console.log(response.data)
    return response.data
  },

  async deleteKpi(kpiId: string): Promise<DeleteKPIsResponse> {
    const response = await api.delete(ENDPOINTS.KPIS.DELETE_KPI(kpiId))
    console.log(response.data)
    return response.data
  }
}