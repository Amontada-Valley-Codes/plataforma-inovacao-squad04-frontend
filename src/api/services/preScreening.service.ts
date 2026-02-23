// src/api/services/preScreening.service.ts
import api from "../axios"
import { ENDPOINTS } from "../endpoints"
import {
  CreatePreScreeningPayload,
  CreatePreScreeningResponse,
  ShowPreScreeningResponse,
  UpdatePreScreeningPayload,
  UpdatePreScreeningResponse,
  PreScreeningDecisionPayload,
  PreScreeningJustificationResponse
} from "../payloads/preScreening.payload"

export const PreScreeningService = {
  async createPreScreening(challengeId: string, payload: CreatePreScreeningPayload): Promise<CreatePreScreeningResponse> {
    const { data } = await api.post<CreatePreScreeningResponse>(
      ENDPOINTS.PRE_SCREENING.CREATE(challengeId),
      payload
    )
    return data
  },

  async getPreScreeningByChallenge(challengeId: string): Promise<ShowPreScreeningResponse> {
    const { data } = await api.get<ShowPreScreeningResponse>(
      ENDPOINTS.PRE_SCREENING.GET_BY_CHALLENGE(challengeId)
    )
    return data
  },

  async updatePreScreening(id: string, payload: UpdatePreScreeningPayload): Promise<UpdatePreScreeningResponse> {
    const { data } = await api.put<UpdatePreScreeningResponse>(
      ENDPOINTS.PRE_SCREENING.UPDATE(id),
      payload
    )
    return data
  },

  async deletePreScreening(id: string): Promise<void> {
    await api.delete(ENDPOINTS.PRE_SCREENING.DELETE(id))
  },

  async registerDecision(id: string, payload: PreScreeningDecisionPayload): Promise<void> {
    await api.post(ENDPOINTS.PRE_SCREENING.DECISION(id), payload)
  },

  async getJustifications(id: string): Promise<PreScreeningJustificationResponse[]> {
    const { data } = await api.get<PreScreeningJustificationResponse[]>(
      ENDPOINTS.PRE_SCREENING.JUSTIFICATIONS(id)
    )
    return data
  }
}
