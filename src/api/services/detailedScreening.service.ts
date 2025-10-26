import api from "../axios";
import { ENDPOINTS } from "../endpoints";
import {
  CreateDetailedScreeningPayload,
  CreateDetailedScreeningResponse,
  ShowDetailedScreeningResponse,
  UpdateDetailedScreeningPayload,
  UpdateDetailedScreeningResponse,
  VoteDetailedScreeningPayload,
  VoteDetailedScreeningResponse
} from "../payloads/detailedScreening.payload";

export const detailedScreeningService = {
  async createDetailedScreening(challengeId: string, payload: CreateDetailedScreeningPayload): Promise<CreateDetailedScreeningResponse> {
    const response = await api.post(ENDPOINTS.DETAILED_SCREENING.CREATE_DETAILED_SCREENING(challengeId), payload);
    console.log(response.data);
    return response.data;
  },

  async showDetailedScreening(challengeId: string): Promise<ShowDetailedScreeningResponse> {
    const response = await api.get(ENDPOINTS.DETAILED_SCREENING.SHOW_DETAILED_SCREENING(challengeId));
    console.log(response.data);
    return response.data;
  },

  async updateDetailedScreening(triagemId: string, payload: UpdateDetailedScreeningPayload): Promise<UpdateDetailedScreeningResponse> {
    const response = await api.put(ENDPOINTS.DETAILED_SCREENING.UPDATE_DETAILED_SCREENING(triagemId), payload);
    console.log(response.data);
    return response.data;
  },

  async voteDetailedScreening(triagemId: string, payload: VoteDetailedScreeningPayload): Promise<VoteDetailedScreeningResponse> {
    const response = await api.post(ENDPOINTS.DETAILED_SCREENING.VOTE_DETAILED_SCREENING(triagemId), payload);
    console.log(response.data);
    return response.data;
  }
};
