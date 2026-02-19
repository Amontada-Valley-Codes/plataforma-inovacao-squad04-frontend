import api from "../axios"
import { ENDPOINTS } from "../endpoints"
import { CreateObjectivePayload, CreateObjectiveResponse, UpdateObjectivePayload, UpdateObjectiveResponse, StrategicObjectivesByChallengeResponse, ShowAllObjectivesResponse } from "../payloads/strategic-objectives.payload"

export const StrategicObjectivesService = {
  async createObjective(createObjectivePayload: CreateObjectivePayload): Promise<CreateObjectiveResponse>{
    const response = await api.post(ENDPOINTS.STRATEGIC_OBJECTIVES.CREATE_OBJECTIVE, createObjectivePayload)
    return response.data
  },

  async getAllObjectives(): Promise<ShowAllObjectivesResponse> {
    const response = await api.get(ENDPOINTS.STRATEGIC_OBJECTIVES.SHOW_ALL_OBJECTIVES)
    return response.data
  },

  async getOneObjectives(id: string) {
    const response = await api.get(ENDPOINTS.STRATEGIC_OBJECTIVES.SHOW_ONE_OBJECTIVE(id))
    return response.data
  },

  async UpdateObjective(id: string, updateObjectivePayload: UpdateObjectivePayload): Promise<UpdateObjectiveResponse>{
    const response = await api.put(ENDPOINTS.STRATEGIC_OBJECTIVES.UPDATE_OBJECTIVE(id), updateObjectivePayload)
    return response.data
  },

  async DeleteObjective(id: string) {
    const response = await api.delete(ENDPOINTS.STRATEGIC_OBJECTIVES.DELETE_OBJECTIVE(id))
    return response.data
  },

  async getObjectivesByChallenge(challengeId: string): Promise<StrategicObjectivesByChallengeResponse> {
    const response = await api.get(ENDPOINTS.STRATEGIC_OBJECTIVES.GET_BY_CHALLENGE(challengeId))
    return response.data
  }
}