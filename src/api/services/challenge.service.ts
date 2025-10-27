// src/api/services/challenge.service.ts
import api from "../axios";
import { ENDPOINTS } from "../endpoints";
import {
  ChangeStatusPayload,
  ChangeStatusResponse,
  ChangeVisibilityPayload,
  ChangeVisibilityResponse,
  CreateChallengePayload,
  CreateChallengeResponse,
  ShowAllChallengeResponse,
  ShowAllPubliChallengeResponse,
  ShowOneChallengeResponse,
  ShowOnePublicChallengeResponse,
} from "../payloads/challenge.payload";

type HistoricalParams = {
  enterpriseId?: string;
  createdById?: string;
  status?: "Completed" | "Archived";
};

export const ChallengeService = {
  async createChallenge(payload: CreateChallengePayload): Promise<CreateChallengeResponse> {
    const { data } = await api.post(ENDPOINTS.CHALLENGE.CREATE, payload);
    return data;
  },

  async showAllChallenges(): Promise<ShowAllChallengeResponse[]> {
    const { data } = await api.get<ShowAllChallengeResponse[]>(ENDPOINTS.CHALLENGE.SHOW_ENTERPRISE_CHALLENGE);
    return data;
  },

  async showAllPublicChallenges(): Promise<ShowAllPubliChallengeResponse> {
    const { data } = await api.get<ShowAllPubliChallengeResponse>(ENDPOINTS.CHALLENGE.SHOW_ALL_PUBLIC_CHALLENGE);
    return data;
  },

  async showOneChallenge(id: string): Promise<ShowOneChallengeResponse> {
    const { data } = await api.get<ShowOneChallengeResponse>(ENDPOINTS.CHALLENGE.SHOW_ONE_CHALLENGE(id));
    return data;
  },

  async showOnePublicChallenge(id: string): Promise<ShowOnePublicChallengeResponse> {
    const { data } = await api.get<ShowOnePublicChallengeResponse>(ENDPOINTS.CHALLENGE.SHOW_ONE_PUBLIC_CHALLENGE(id));
    return data;
  },

  async changeStatus(id: string, payload: ChangeStatusPayload): Promise<ChangeStatusResponse> {
    const { data } = await api.patch<ChangeStatusResponse>(ENDPOINTS.CHALLENGE.UPDATE_STATUS(id), payload);
    return data;
  },

  async changeVisibility(id: string, payload: ChangeVisibilityPayload): Promise<ChangeVisibilityResponse> {
    const { data } = await api.patch<ChangeVisibilityResponse>(ENDPOINTS.CHALLENGE.UPDATE_VISIBILITY(id), payload);
    return data;
  },

  async myHistory(): Promise<ShowAllChallengeResponse[]> {
    const { data } = await api.get<ShowAllChallengeResponse[]>(
      ENDPOINTS.CHALLENGE.HISTORICAL.MY_HISTORY
    );
    return data;
  },

  async showHistorical(params?: HistoricalParams): Promise<ShowAllChallengeResponse[]> {
    const { data } = await api.get<ShowAllChallengeResponse[]>(
      ENDPOINTS.CHALLENGE.SHOW_CHALLENGE_HISTORICAL_ENTERPRISE,
      { params: params ?? {} }
    );
    
    return data ?? [];
  },

  
};
