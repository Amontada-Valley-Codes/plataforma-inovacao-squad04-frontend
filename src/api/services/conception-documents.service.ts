import api from "../axios"
import { ENDPOINTS } from "../endpoints"
import { CreateConceptionPayload } from "../payloads/conceptionDocument.payload"

export const ConceptionDocumentsService = {
  async CreateConceptionDocument(challengeId: string, payload: CreateConceptionPayload) {
    const { data } = await api.post(ENDPOINTS.CONCEPTION_DOCUMENT.CREATE(challengeId), payload)
    console.log(data)
    return data
  },

  async updateConceptionDocument(id: string, payload: CreateConceptionPayload) {
    const { data } = await api.put(ENDPOINTS.CONCEPTION_DOCUMENT.UPDATE(id), payload);
    console.log(data);
    return data;
  },

  async showConceptionDocument(id: string) {
    const { data } = await api.get(ENDPOINTS.CONCEPTION_DOCUMENT.SHOW_ONE(id));
    return data;
  },
}