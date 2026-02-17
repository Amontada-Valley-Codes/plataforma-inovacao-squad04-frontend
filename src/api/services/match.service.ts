import api from "../axios";
import { ENDPOINTS } from "../endpoints";
import type {
  StartupMatchResponse,
  CreateApplicationPayload,
  MatchStatsResponse,
} from "../payloads/match.payload";

export const matchService = {
  async acceptInvite(matchId: string): Promise<StartupMatchResponse> {
    const { data } = await api.patch(ENDPOINTS.STARTUP_MATCH.ACCEPT_INVITE(matchId));
    return data;
  },

  async sendApplication(payload: CreateApplicationPayload): Promise<StartupMatchResponse> {
    const { data } = await api.post(
      ENDPOINTS.STARTUP_MATCH.SEND_APPLICATION(payload.challengeId, payload.enterpriseId)
    );
    return data;
  },

  async denyMatch(matchId: string): Promise<StartupMatchResponse> {
    const { data } = await api.patch(ENDPOINTS.STARTUP_MATCH.DENY(matchId));
    return data;
  },

  async getPendingMatches(): Promise<StartupMatchResponse[]> {
    const { data } = await api.get(ENDPOINTS.STARTUP_MATCH.GET_PENDING);
    return Array.isArray(data) ? data : [];
  },

  async getAcceptedMatches(): Promise<StartupMatchResponse[]> {
    const { data } = await api.get(ENDPOINTS.STARTUP_MATCH.GET_ACCEPTED);
    return Array.isArray(data) ? data : [];
  },

  async getMatchStats(): Promise<MatchStatsResponse> {
    const [pending, accepted] = await Promise.all([
      this.getPendingMatches(),
      this.getAcceptedMatches(),
    ]);

    const pendingApplications = pending.filter((m) => m.type === "APPLICATION").length;
    const receivedInvites = pending.filter((m) => m.type === "INVITE").length;
    const acceptedMatches = accepted.length;

    return {
      pendingApplications,
      receivedInvites,
      acceptedMatches,
    };
  },
};
