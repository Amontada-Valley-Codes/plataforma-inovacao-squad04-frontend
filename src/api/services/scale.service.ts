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
}