import api from "../axios";
import { ENDPOINTS } from "../endpoints";
import { createScalePayload, UpdateExecutiveSummaryPayload, UpdateRolloutPayload } from "../payloads/scale.payload";

export const ScaleService = {
  async createScale(challengeId: string, createScalePayload: createScalePayload) {
    const response = await api.post(ENDPOINTS.SCALE.CREATE_SCALE(challengeId), createScalePayload);
    console.log(response.data);
    return response.data;
  },

  async updateExecutiveSummary(scaleId: string, updateExecutiveSummaryPayload: UpdateExecutiveSummaryPayload) {
    const response = await api.patch(ENDPOINTS.SCALE.UPDATE_EXECUTIVE_SUMMARY(scaleId), updateExecutiveSummaryPayload);
    console.log(response.data);
    return response.data;
  },

  async updateRollOutPlan(scaleId: string, updateScalePayload: UpdateRolloutPayload) {
    const response = await api.patch(ENDPOINTS.SCALE.UPDATE_ROLLOUT_PLAN(scaleId), updateScalePayload);
    console.log(response.data);
    return response.data;
  },

  async getStakeholders(challengeId: string) {
    const response = await api.get(ENDPOINTS.SCALE.GET_STAKEHOLDERS(challengeId));
    console.log(response.data);
    return response.data;
  },

  async getScaleByChallenge(challengeId: string) {
    try {
      const response = await api.get(ENDPOINTS.SCALE.GET_SCALE_BY_CHALLENGE_ID(challengeId));
      return response.data;
    } catch (err: any) {
      if (err?.response?.status === 404) {
        return null;
      }
      throw err;
    }
  },

  async updateScale(solutionId: string, payload: createScalePayload) {
    const response = await api.patch(ENDPOINTS.SCALE.PATCH_ALL_SCALE(solutionId), payload);
    console.log(response.data);
    return response.data;
  },
}