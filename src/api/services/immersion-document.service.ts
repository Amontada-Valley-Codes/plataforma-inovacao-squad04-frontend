import api from "../axios";
import { ENDPOINTS } from "../endpoints";
import { CreateImmersionFormData, CreateImmersionResponse, CreateMapEmpathyPayload, CreateMapEmpathyResponse, CreateProblemTreePayload, CreateProblemTreeResponse } from "../payloads/immersionDocument.payload";

export const immersionDocumentService = {

  async createImmersionDocument(id: string, payload: CreateImmersionFormData): Promise<CreateImmersionResponse> {
    const { data } = await api.post(ENDPOINTS.IMMERSION_DOCUMENT.CREATE(id), payload);
    console.log(data)
    return data;
  },

  async updateImmersionDocument(id: string, payload: CreateImmersionFormData): Promise<CreateImmersionResponse> {
    const { data } = await api.put(ENDPOINTS.IMMERSION_DOCUMENT.UPDATE(id), payload);
    console.log(data);
    return data;
  },

  async createProblemTree(id: string, payload: CreateProblemTreePayload): Promise<CreateProblemTreeResponse> {
    const { data } = await api.post(ENDPOINTS.IMMERSION_DOCUMENT.CREATE_PROBLEM_TREE(id), payload);
    console.log(data)
    return data;
  },

  // partial implementation – individual nodes can be updated using this helper
  async updateProblemTreeNode(nodeId: string, payload: CreateProblemTreePayload): Promise<CreateProblemTreeResponse> {
    const { data } = await api.put(ENDPOINTS.IMMERSION_DOCUMENT.UPDATE_PROBLEM_TREE_NODE(nodeId), payload);
    console.log(data);
    return data;
  },

  async createEmpathyMap(id: string, payload: CreateMapEmpathyPayload): Promise<CreateMapEmpathyResponse> {
    const { data } = await api.post(ENDPOINTS.IMMERSION_DOCUMENT.CREATE_MAP_EMPATHY(id), payload);
    console.log(data)
    return data;
  },

  async updateEmpathyMap(id: string, payload: CreateMapEmpathyPayload): Promise<CreateMapEmpathyResponse> {
    const { data } = await api.put(ENDPOINTS.IMMERSION_DOCUMENT.UPDATE_MAP_EMPATHY(id), payload);
    console.log(data);
    return data;
  },

  async showProblemTree(immersionId: string) {
    const { data } = await api.get(ENDPOINTS.IMMERSION_DOCUMENT.SHOW_PROBLEM_TREE(immersionId));
    return data;
  }

}