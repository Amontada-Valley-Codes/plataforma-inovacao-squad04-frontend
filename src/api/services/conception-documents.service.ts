import api from "../axios"
import { ENDPOINTS } from "../endpoints"
import { CreateConceptionPayload } from "../payloads/conceptionDocument.payload"

export const ConceptionDocumentsService = {
  async CreateConceptionDocument(challengeId: string, payload: CreateConceptionPayload) {
    const { data } = await api.post(ENDPOINTS.CONCEPTION_DOCUMENT.CREATE(challengeId), payload)
    console.log(data)
    return data
  },
}