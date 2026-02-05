import api from "../axios"
import { ENDPOINTS } from "../endpoints"
import {
  ShowDetailedScreeningByIdResponse,
  ShowDetailedScreeningResponse,
} from "../payloads/detailedScreening.payload"

export const detailedScreeningService = {
  async startDetailedScreening(
    challengeId: string
  ): Promise<ShowDetailedScreeningByIdResponse> {
    const { data } = await api.post(
      ENDPOINTS.DETAILED_SCREENING.START_DETAILED_SCREENING(challengeId)
    )
    return data
  },
  async showDetailedScreeningByChallenge(
  challengeId: string
): Promise<ShowDetailedScreeningByIdResponse | null> {
  const { data } = await api.get<ShowDetailedScreeningResponse>(
    ENDPOINTS.DETAILED_SCREENING.SHOW_DETAILED_SCREENING
  )

  const screening = data.find(
    (item) => item.challengeId === challengeId
  )

  return screening ?? null
},
  async showAll(): Promise<ShowDetailedScreeningResponse> {
    const { data } = await api.get(
      ENDPOINTS.DETAILED_SCREENING.SHOW_DETAILED_SCREENING
    )
    return data
  },

  async deleteDetailedScreening(id: string): Promise<void> {
    await api.delete(
      ENDPOINTS.DETAILED_SCREENING.DELETE_DETAILED_SCREENING(id)
    )
  },
  async getOrCreateDetailedScreening(
  challengeId: string
): Promise<ShowDetailedScreeningByIdResponse> {
  const existing =
    await detailedScreeningService.showDetailedScreeningByChallenge(challengeId)

  if (existing) {
    return existing
  }

  return detailedScreeningService.startDetailedScreening(challengeId)
}

}

