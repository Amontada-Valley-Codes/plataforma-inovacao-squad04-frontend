import api from "../axios";
import { ENDPOINTS } from "../endpoints";
import { CreateImmersionFormData, CreateImmersionResponse, CreateProblemTreePayload, CreateProblemTreeResponse } from "../payloads/immersionDocument.payload";

export const immersionDocumentService = {

  async createImmersionDocument(id: string, payload: CreateImmersionFormData): Promise<CreateImmersionResponse> {
    const { data } = await api.post(ENDPOINTS.IMMERSION_DOCUMENT.CREATE(id), payload);
    console.log(data)
    return data;
  },

  async createProblemTree(id: string, payload: CreateProblemTreePayload): Promise<CreateProblemTreeResponse> {
    const { data } = await api.post(ENDPOINTS.IMMERSION_DOCUMENT.CREATE_PROBLEM_TREE(id), payload);
    console.log(data)
    return data;
  }

}