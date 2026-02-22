// src/api/services/challenge.service.ts

import api from "@/api/axios";
import { ENDPOINTS } from "../endpoints";
import {
  ChangeStatusPayload,
  ChangeStatusResponse,
  ChangeVisibilityPayload,
  ChangeVisibilityResponse,
  CreateChallengePayload,
  CreateChallengeResponse,
  CreateVotePreScreeningPayload,
  CreateVotePreScreeningResponse,
  GanttChartResponse,
  ShowAllChallengeResponse,
  ShowAllPubliChallengeResponse,
  ShowOneChallengeResponse,
  ShowOnePublicChallengeResponse,
  ShowPercentageVoteResponse,
  UpdateEndDatePayload,
  UpdateEndDateResponse,
  ChallengesByStageResponse,
  PaginatedChallengesParams,
  PaginatedChallengesResponse,
  ChallengeFullResponse,
  AdvanceStageResponse,
  ReturnStepResponse,
  UpdateStrategicObjectivesPayload,
  UpdateStrategicObjectivesResponse,
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

  async paginatedChallenges(params: PaginatedChallengesParams): Promise<PaginatedChallengesResponse> {
    const { data } = await api.get<PaginatedChallengesResponse>(ENDPOINTS.CHALLENGE.PAGINATED(params))
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

  async createVote(challengeId: string, payload: CreateVotePreScreeningPayload): Promise<CreateVotePreScreeningResponse> {
    const { data } = await api.post<CreateVotePreScreeningResponse>(ENDPOINTS.CHALLENGE.VOTE_PRE_SCREENING(challengeId), payload)
    return data
  },

  async ShowPercentage(challengeId: string): Promise<ShowPercentageVoteResponse> {
    const { data } = await api.get<ShowPercentageVoteResponse>(ENDPOINTS.CHALLENGE.SHOW_PRE_SCREENING_VOTES(challengeId))
    return data
  },

  async updateEndDate(id: string, payload: UpdateEndDatePayload): Promise<UpdateEndDateResponse> {
    const { data } = await api.patch<UpdateEndDateResponse>(ENDPOINTS.CHALLENGE.UPDATE_END_DATE(id), payload)
    return data
  },

  async getGanttChart(): Promise<GanttChartResponse> {
    const { data } = await api.get<GanttChartResponse>(ENDPOINTS.CHALLENGE.GANTT_CHART)
    return data
  },

  async getChallengesByStage(): Promise<ChallengesByStageResponse> {
    const { data } = await api.get<ChallengesByStageResponse>(ENDPOINTS.CHALLENGE.CHALLENGES_BY_STAGE)
    return data
  },

  async fullChallenge(challengeId: string): Promise<ChallengeFullResponse> {
    const { data } = await api.get<ChallengeFullResponse>(ENDPOINTS.CHALLENGE.FULL(challengeId))
    return data
  },

  async filterByArea(area: string): Promise<ShowAllChallengeResponse[]> {
    const { data } = await api.get<ShowAllChallengeResponse[]>(ENDPOINTS.CHALLENGE.FILTER_BY_AREA(area))
    return data
  },

  async filterByDate(startDate: string, endDate: string): Promise<ShowAllChallengeResponse[]> {
    const { data } = await api.get<ShowAllChallengeResponse[]>(ENDPOINTS.CHALLENGE.FILTER_BY_DATE(startDate, endDate))
    return data
  },

  async filterByKeyword(keyword: string): Promise<ShowAllChallengeResponse[]> {
    const { data } = await api.get<ShowAllChallengeResponse[]>(ENDPOINTS.CHALLENGE.FILTER_BY_KEYWORD(keyword))
    return data
  },

  async filterByStrategicObjective(ids: string): Promise<ShowAllChallengeResponse[]> {
    const { data } = await api.get<ShowAllChallengeResponse[]>(ENDPOINTS.CHALLENGE.FILTER_BY_STRATEGIC_OBJECTIVE(ids))
    return data
  },

  async searchByStatus(status: string): Promise<ShowAllChallengeResponse[]> {
    const { data } = await api.get<ShowAllChallengeResponse[]>(ENDPOINTS.CHALLENGE.SEARCH_BY_STATUS(status))
    return data
  },

  async advanceStage(challengeId: string, status: ChangeStatusPayload): Promise<AdvanceStageResponse> {
    const { data } = await api.put(ENDPOINTS.CHALLENGE.ADVANCE(challengeId), status)
    return data
  },

  async returnStep(challengeId: string, status: ChangeStatusPayload): Promise<ReturnStepResponse> {
    const { data } = await api.patch(ENDPOINTS.CHALLENGE.RETURN(challengeId), status)
    return data
  },

  async updateStrategicObjectives(challengeId: string, payload: UpdateStrategicObjectivesPayload): Promise<UpdateStrategicObjectivesResponse> {
    const { data } = await api.patch<UpdateStrategicObjectivesResponse>(ENDPOINTS.CHALLENGE.UPDATE_STRATEGIC_OBJECTIVES(challengeId), payload)
    return data
  },
};
