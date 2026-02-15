import api from "../axios"
import { ENDPOINTS } from "../endpoints"
import { ShowDetailedScreeningByIdResponse, ShowDetailedScreeningResponse } from "../payloads/detailedScreening.payload"

export const detailedScreeningService = {
  async startDetailedScreening(challengeId: string) {
    const { data } = await api.post(ENDPOINTS.DETAILED_SCREENING.START_DETAILED_SCREENING(challengeId))
    console.log(data)
    return data
  },

  async showDetailedScreeningById(challengeId: string): Promise<ShowDetailedScreeningByIdResponse | null> {
    const { data } = await api.get(ENDPOINTS.DETAILED_SCREENING.SHOW_DETAILED_SCREENING_BY_ID(challengeId))
    console.log(data)
    return data
  },

}

