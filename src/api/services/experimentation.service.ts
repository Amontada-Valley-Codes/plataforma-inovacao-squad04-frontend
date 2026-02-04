import api from "../axios";
import { ENDPOINTS } from "../endpoints";
import { 
  CreateExperimentationResponse,
  ShowExperimentationResponse,
  CreatePocPayload,
  CreateHypothesesPayload,
  CreateHypothesesResponse,
  CreateIndicatorsPayload,
  CreateIndicatorsResponse,
  CreatePocResponse,
  ShowPocResponse,
  UpdateHypothesesPayload,
  UpdateHypothesesResponse,
  UpdateIndicatorsPayload,
  UpdateIndicatorsResponse,
  UpdatePocPayload,
  UpdatePocResponse,
  DeleteHypothesesResponse,
  DeleteIndicatorsResponse,
  DeletePocResponse,
 } from "../payloads/experimentation.payload";

export const experimentationService = {
  async createExperimentation(challengeId: string): Promise<CreateExperimentationResponse> {
    const response = await api.post(ENDPOINTS.EXPERIMENTATION.CREATE_EXPERIMENTATION(challengeId))
    console.log(response.data)
    return response.data
  },

  async showExperimentation(challengeId: string): Promise<ShowExperimentationResponse> {
    const response = await api.get(ENDPOINTS.EXPERIMENTATION.SHOW_EXPERIMENTATION(challengeId))
    console.log(response.data)
    return response.data
  },

  async createPoc(experimentationId: string, payload: CreatePocPayload): Promise<CreatePocResponse> {
    const response = await api.post(ENDPOINTS.EXPERIMENTATION.CREATE_POC(experimentationId), payload)
    console.log(response.data)
    return response.data
  },

  async showPoc(pocId: string): Promise<ShowPocResponse> {
    const response = await api.get(ENDPOINTS.EXPERIMENTATION.SHOW_POC(pocId))
    console.log(response.data)
    return response.data
  },

  async updatePoc(pocId: string, payload: UpdatePocPayload): Promise<UpdatePocResponse> {
    const response = await api.put(ENDPOINTS.EXPERIMENTATION.UPDATE_POC(pocId), payload)
    console.log(response.data)
    return response.data
  },

  async deletePoc(pocId: string): Promise<DeletePocResponse> {
    const response = await api.delete(ENDPOINTS.EXPERIMENTATION.DELETE_POC(pocId))
    console.log(response.data)
    return response.data
  },

  async createHypothesis(pocId: string, payload: CreateHypothesesPayload): Promise<CreateHypothesesResponse> {
    const response = await api.post(ENDPOINTS.EXPERIMENTATION.CREATE_HYPOTHESES(pocId), payload)
    console.log(response.data)
    return response.data
  },

  async updateHypothesis(hypothesisId: string, payload: UpdateHypothesesPayload): Promise<UpdateHypothesesResponse> {
    const response = await api.put(ENDPOINTS.EXPERIMENTATION.UPDATE_HYPOTHESES(hypothesisId), payload)
    console.log(response.data)
    return response.data
  },

  async deleteHypothesis(hypothesisId: string): Promise<DeleteHypothesesResponse> {
    const response = await api.delete(ENDPOINTS.EXPERIMENTATION.DELETE_HYPOTHESES(hypothesisId))
    console.log(response.data)
    return response.data
  },
  
  async createIndicators(pocId: string, payload: CreateIndicatorsPayload): Promise<CreateIndicatorsResponse> {
    const response = await api.post(ENDPOINTS.EXPERIMENTATION.CREATE_INDICATORS(pocId), payload)
    console.log(response.data)
    return response.data
  },

  async updateIndicators(indicatorId: string, payload: UpdateIndicatorsPayload): Promise<UpdateIndicatorsResponse> {
    const response = await api.put(ENDPOINTS.EXPERIMENTATION.UPDATE_INDICATORS(indicatorId), payload)
    console.log(response.data)
    return response.data
  },

  async deleteIndicators(indicatorId: string): Promise<DeleteHypothesesResponse> {
    const response = await api.delete(ENDPOINTS.EXPERIMENTATION.DELETE_INDICATORS(indicatorId))
    console.log(response.data)
    return response.data
  },
}