import api from "../axios";
import { ENDPOINTS } from "../endpoints";
import { 
  CreateExperimentationPayload,
  CreateExperimentationResponse,
  ShowExperimentationResponse,
  UpdateExperimentationPayload,
  UpdateExperimentationResponse
 } from "../payloads/experimentation.payload";

export const experimentationService = {
  async createExperimentation(challengeId: string, payload: CreateExperimentationPayload): Promise<CreateExperimentationResponse> {
    const response = await api.post(ENDPOINTS.EXPERIMENTATION.CREATE_EXPERIMENTATION(challengeId), payload)
    console.log(response.data)
    return response.data
  },

  async showExperimentation(challengeId: string): Promise<ShowExperimentationResponse> {
    const response = await api.get(ENDPOINTS.EXPERIMENTATION.SHOW_EXPERIMENTATION(challengeId))
    console.log(response.data)
    return response.data
  },

  async updateExperimentation(challengeId: string, payload: UpdateExperimentationPayload): Promise<UpdateExperimentationResponse> {
    const response = await api.put(ENDPOINTS.EXPERIMENTATION.UPDATE_EXPERIMENTATION(challengeId), payload)
    console.log(response.data)
    return response.data
  }
}