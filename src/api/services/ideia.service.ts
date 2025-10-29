import api from "../axios";
import { ENDPOINTS } from "../endpoints";
import {
  CreateIdeiaPayload,
  CreateIdeiaResponse,
  UpdateIdeiaPayload,
  UpdateIdeiaResponse,
  DeleteIdeiaResponse,
  LikeIdeiaResponse,
  ShowAllIdeiasResponse,
  ApproveIdeiaResponse,
  RejectIdeiaResponse
} from "../payloads/ideia.payload";

export const ideiaService = {
  async createIdeia(challengeId: string, createIdeiaPayload: CreateIdeiaPayload): Promise<CreateIdeiaResponse> {
    const response = await api.post(ENDPOINTS.IDEIA.CREATE_IDEIA(challengeId), createIdeiaPayload);
    console.log(response.data);
    return response.data;
  },

  async updateIdeia(ideiaId: string, updateIdeiaPayload: UpdateIdeiaPayload): Promise<UpdateIdeiaResponse> {
    const response = await api.put(ENDPOINTS.IDEIA.UPDATE_IDEIA(ideiaId), updateIdeiaPayload);
    console.log(response.data);
    return response.data;
  },

  async deleteIdeia(ideiaId: string): Promise<DeleteIdeiaResponse> {
    const response = await api.delete(ENDPOINTS.IDEIA.DELETE_IDEIA(ideiaId));
    console.log(response.data);
    return response.data;
  },

  async likeIdeia(ideiaId: string): Promise<LikeIdeiaResponse> {
    const response = await api.post(ENDPOINTS.IDEIA.LIKE_IDEIA(ideiaId));
    console.log(response.data);
    return response.data;
  },

  async showIdeias(challengeId: string): Promise<ShowAllIdeiasResponse> {

    const response = await api.get(`/ideia/${challengeId}/ideias`); 
    console.log(response.data);
    return response.data;
  },

  async approveIdeia(ideiaId: string): Promise<ApproveIdeiaResponse> {
    const response = await api.patch(ENDPOINTS.IDEIA.APPROVE_IDEIA(ideiaId));
    console.log(response.data);
    return response.data;
  },

  async rejectIdeia(ideiaId: string): Promise<RejectIdeiaResponse> {
    const response = await api.patch(ENDPOINTS.IDEIA.REJECT_IDEIA(ideiaId));
    console.log(response.data);
    return response.data;
  },
};