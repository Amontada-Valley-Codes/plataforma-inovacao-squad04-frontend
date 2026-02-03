import api from "../axios"
import { ENDPOINTS } from "../endpoints"
import { CreateObjectivePayload, CreateObjectiveResponse, UpdateObjectivePayload, UpdateObjectiveResponse } from "../payloads/strategic-objectives.payload"

export const StrategicObjectivesService = {
  async createObjective(createObjectivePayload: CreateObjectivePayload): Promise<CreateObjectiveResponse>{
    const response = await api.post(ENDPOINTS.STRATEGIC_OBJECTIVES.CREATE_OBJECTIVE, createObjectivePayload)
    console.log(response.data)
    return response.data
  },

  async getAllObjectives() {
    const response = await api.get(ENDPOINTS.STRATEGIC_OBJECTIVES.SHOW_ALL_OBJECTIVES)
    console.log(response.data)
    return response.data
  },

  async getOneObjectives(id: string) {
    const response = await api.get(ENDPOINTS.STRATEGIC_OBJECTIVES.SHOW_ONE_OBJECTIVE(id))
    console.log(response.data)
    return response.data
  },

  async UpdataObjective(id: string, updateObjectivePayload: UpdateObjectivePayload): Promise<UpdateObjectiveResponse>{
    const response = await api.put(ENDPOINTS.STRATEGIC_OBJECTIVES.UPDATE_OBJECTIVE(id), updateObjectivePayload)
    console.log(response.data)
    return response.data
  },

  async DeleteObjective(id: string) {
    const response = await api.delete(ENDPOINTS.STRATEGIC_OBJECTIVES.DELETE_OBJECTIVE(id))
    console.log(response.data)
    return response.data
  }

  
}