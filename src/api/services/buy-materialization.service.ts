import api from "../axios";
import { ENDPOINTS } from "../endpoints";
import { createBuyMaterializationPayload, showBuyMaterializationResponse } from "../payloads/buy-materialization.payload";

export const BuyMaterializationService = {

  async createMaterialization(id: string, payload: createBuyMaterializationPayload) {
    const { data } = await api.post(ENDPOINTS.BUY_MATERIALIZATION.CREATE_MATERIALIZATION(id), payload);
    return data;
  },

  async getMaterializationById(id: string): Promise<showBuyMaterializationResponse> {
    const { data } = await api.get(ENDPOINTS.BUY_MATERIALIZATION.GET_MATERIALIZATION_BY_ID(id))
    return data
  },

  async getMaterialization(): Promise<showBuyMaterializationResponse> {
    const { data } = await api.get(ENDPOINTS.BUY_MATERIALIZATION.GET_MATERIALIZATION)
    return data
  }
}