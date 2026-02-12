import api from "../axios";
import { ENDPOINTS } from "../endpoints";
import { 
  CreateMvpPayload,
  CreateMvpResponse,
  DeleteMvpResponse,
  ShowAllMvpResponse,
  ShowMvpById,
  UpdateMvpPayload, 
  UpdateMvpResponse
} from "../payloads/materialization.payload";

export const materializationService = {
  async createMvp(challengeId: string, payload: CreateMvpPayload): Promise<CreateMvpResponse> {
    const response = await api.post(ENDPOINTS.MATERIALIZATION.CREATE_MVP(challengeId), payload)
    console.log(response.data)
    return response.data
  },

  async showAllMvp(): Promise<ShowAllMvpResponse> {
    const response = await api.get(ENDPOINTS.MATERIALIZATION.SHOW_ALL_MVP)
    console.log(response.data)
    return response.data
  },

  async showMvpById(mvpId: string): Promise<ShowMvpById> {
    const response = await api.get(ENDPOINTS.MATERIALIZATION.SHOW_MVP_BY_ID(mvpId))
    console.log(response.data)
    return response.data
  },

  async updateMvp(mvpId: string, payload: UpdateMvpPayload): Promise<UpdateMvpResponse> {
    const response = await api.put(ENDPOINTS.MATERIALIZATION.UPDATE_MVP(mvpId), payload)
    console.log(response.data)
    return response.data
  },

  async deleteMvp(mvpId: string): Promise<DeleteMvpResponse> {
    const response = await api.delete(ENDPOINTS.MATERIALIZATION.DELETE_MVP(mvpId))
    console.log(response.data)
    return response.data
  },
} 