import api from "../axios";
import { ENDPOINTS } from "../endpoints";
import { ChangeStatusPayload, ChangeStatusResponse, ChangeVisibilityPayload, ChangeVisibilityResponse, CreateChallengePayload, CreateChallengeResponse, ShowAllChallengeResponse, ShowAllPubliChallengeResponse, ShowOneChallengeResponse } from "../payloads/challenge.payload";

export const ChallengeService = {
  async createChallenge(createChallengePayload: CreateChallengePayload): Promise<CreateChallengeResponse> {
    const response = await api.post(ENDPOINTS.CHALLENGE.CREATE, createChallengePayload);
    console.log(response.data);
    return response.data;
  },

  async showAllChallenges(): Promise<ShowAllChallengeResponse[]> {
    const response = await api.get(ENDPOINTS.CHALLENGE.SHOW_ENTERPRISE_CHALLENGE);
    console.log(response.data);
    return response.data;
  },

  async showOneChallenge(id: string): Promise<ShowOneChallengeResponse> {
    const response = await api.get(ENDPOINTS.CHALLENGE.SHOW_ONE_CHALLENGE(id));
    console.log(response.data);
    return response.data;
  },

  async changeStatus(id: string, changeStatusPayload: ChangeStatusPayload): Promise<ChangeStatusResponse> {
    const response = await api.patch(ENDPOINTS.CHALLENGE.UPDATE_STATUS(id), changeStatusPayload);
    console.log(response.data);
    return response.data
  },

  async changeVisibility(id: string, changeVisibilityPayload: ChangeVisibilityPayload): Promise<ChangeVisibilityResponse> {
    const response = await api.patch(ENDPOINTS.CHALLENGE.UPDATE_VISIBILITY(id), changeVisibilityPayload);
    console.log(response.data);
    return response.data
  },

  async showAllPublicChallenges(): Promise<ShowAllPubliChallengeResponse> {
    const response = await api.get(ENDPOINTS.CHALLENGE.SHOW_ALL_PUBLIC_CHALLENGE);
    console.log(response.data);
    return response.data;
  },
}