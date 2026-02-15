import api from "../axios";
import { ENDPOINTS } from "../endpoints";
import { CreateImmersionFormData, CreateImmersionResponse } from "../payloads/immersionDocument.payload";

export const immersionDocumentService = {

  async createFormTemplateVersion(id: string, payload: CreateImmersionFormData): Promise<CreateImmersionResponse> {
    const { data } = await api.post(ENDPOINTS.IMMERSION_DOCUMENT.CREATE(id), payload);
    console.log(data)
    return data;
  }

}