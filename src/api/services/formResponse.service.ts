import api from "../axios";
import { ENDPOINTS } from "../endpoints";
import { FormResponsePayload } from "../payloads/formResponse.payload";

export const formResponseService = {

  async sendFormResponse(payload: FormResponsePayload) {
    const { data } = await api.post(ENDPOINTS.FORM_RESPONSES.SEND_RESPONSE, payload);
    return data;
  },

  async getFormResponses(id: string) {
    const { data } = await api.get(ENDPOINTS.FORM_RESPONSES.GET_RESPONSES(id));
    return data;
  }

}