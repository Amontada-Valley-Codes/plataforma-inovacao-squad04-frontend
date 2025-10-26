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

export const ChallengeService = {
  async createChallenge(
    createChallengePayload: CreateChallengePayload
  ): Promise<CreateChallengeResponse> {
    const { data } = await api.post(
      ENDPOINTS.CHALLENGE.CREATE,
      createChallengePayload
    );
    return data;
  },

  async showAllChallenges(): Promise<ShowAllChallengeResponse[]> {
    const { data } = await api.get(
      ENDPOINTS.CHALLENGE.SHOW_ENTERPRISE_CHALLENGE
    );
    return data;
  },

  async showAllPublicChallenges(): Promise<ShowAllPubliChallengeResponse> {
    const { data } = await api.get(
      ENDPOINTS.CHALLENGE.SHOW_ALL_PUBLIC_CHALLENGE
    );
    return data;
  },

  async showOneChallenge(id: string): Promise<ShowOneChallengeResponse> {
    const { data } = await api.get(
      ENDPOINTS.CHALLENGE.SHOW_ONE_CHALLENGE(id)
    );
    return data;
  },

  async showOnePublicChallenge(id: string): Promise<ShowOnePublicChallengeResponse> {
    const { data } = await api.get(
      ENDPOINTS.CHALLENGE.SHOW_ONE_PUBLIC_CHALLENGE(id)
    );
    return data;
  },

  async changeStatus(
    id: string,
    changeStatusPayload: ChangeStatusPayload
  ): Promise<ChangeStatusResponse> {
    const { data } = await api.patch(
      ENDPOINTS.CHALLENGE.UPDATE_STATUS(id),
      changeStatusPayload
    );
    return data;
  },

  async changeVisibility(
    id: string,
    changeVisibilityPayload: ChangeVisibilityPayload
  ): Promise<ChangeVisibilityResponse> {
    const { data } = await api.patch(
      ENDPOINTS.CHALLENGE.UPDATE_VISIBILITY(id),
      changeVisibilityPayload
    );
    return data;
  },
};
