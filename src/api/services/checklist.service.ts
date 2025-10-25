import api from "../axios";
import { ENDPOINTS } from "../endpoints";
import {
  CreateChecklistPayload, 
  CreateChecklistResponse, 
  DeleteChecklistResponse, 
  ShowAllChecklistsResponse, 
  UpdateChecklistPayload, 
  UpdateChecklistResponse, 
  UpdateStatusChecklistResponse
} from "../payloads/checklist.payload"

export const checklistService = {
  async createChecklist(challengeId: string, createChecklistPayload: CreateChecklistPayload): Promise<CreateChecklistResponse> {
    const response = await api.post(ENDPOINTS.CHECKLIST.CREATE_CHECKLIST(challengeId), createChecklistPayload)
    console.log(response.data)
    return response.data
  },

  async showAllChecklists(challengeId: string): Promise<ShowAllChecklistsResponse[]> {
    const response = await api.get(ENDPOINTS.CHECKLIST.SHOW_CHECKLIST(challengeId))
    console.log(response.data)
    return response.data
  },

  async updateStatusChecklist(checklistId: string): Promise<UpdateStatusChecklistResponse> {
    const response = await api.patch(ENDPOINTS.CHECKLIST.UPDATE_STATUS_CHECKLIST(checklistId))
    console.log(response.data)
    return response.data
  },

  async updateChecklist(checklistId: string, updateChecklistPayload: UpdateChecklistPayload): Promise<UpdateChecklistResponse> {
    const response = await api.put(ENDPOINTS.CHECKLIST.UPDATE_ITEM_CHECKLIST(checklistId), updateChecklistPayload)
    console.log(response.data)
    return response.data
  },

  async deleteChecklist(checklistId: string): Promise<DeleteChecklistResponse> {
    const response = await api.delete(ENDPOINTS.CHECKLIST.DELETE_CHECKLIST(checklistId))
    console.log(response.data)
    return response.data
  }
}