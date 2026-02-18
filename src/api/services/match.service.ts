import api from "../axios";
import { ENDPOINTS } from "../endpoints";
import type {
  StartupMatchResponse,
  MatchStatsResponse,
} from "../payloads/match.payload";

export const matchService = {
  async acceptInvite(matchId: string): Promise<StartupMatchResponse> {
    const { data } = await api.patch(ENDPOINTS.STARTUP_MATCH.ACCEPT_INVITE(matchId));
    return data;
  },

  async sendApplication(challengeId: string, enterpriseId: string): Promise<StartupMatchResponse> {
    const { data } = await api.post(
      ENDPOINTS.STARTUP_MATCH.SEND_APPLICATION(challengeId, enterpriseId)
    );
    return data;
  },

  async denyMatch(matchId: string): Promise<StartupMatchResponse> {
    const { data } = await api.patch(ENDPOINTS.STARTUP_MATCH.DENY(matchId));
    return data;
  },

  async getPendingMatches(): Promise<StartupMatchResponse[]> {
    const { data } = await api.get(ENDPOINTS.STARTUP_MATCH.GET_PENDING);
    return Array.isArray(data?.pendings) ? data.pendings : [];
  },

  async getReceivedInvites(): Promise<StartupMatchResponse[]> {
    const { data } = await api.get(ENDPOINTS.STARTUP_MATCH.GET_INVITATIONS);
    return Array.isArray(data?.pendings) ? data.pendings : [];
  },

  async getAcceptedMatches(): Promise<StartupMatchResponse[]> {
    const { data } = await api.get(ENDPOINTS.STARTUP_MATCH.GET_ACCEPTED);
    // Backend retorna array de empresas com challenges dentro
    if (!Array.isArray(data)) return [];
    
    const matches: StartupMatchResponse[] = [];
    data.forEach((enterprise: any) => {
      enterprise.challenges?.forEach((challenge: any) => {
        matches.push({
          id: challenge.matchId,
          statusMatch: "ACCEPTED",
          acceptStartup: "ACCEPTED",
          acceptEnterprise: "ACCEPTED",
          challengeId: challenge.id,
          enterpriseId: enterprise.enterprise.id,
          startupId: "",
          Challenge: {
            id: challenge.id,
            name: challenge.name,
            status: "",
          },
          Enterprise: {
            id: enterprise.enterprise.id,
            name: enterprise.enterprise.name,
            gestorEmail: enterprise.enterprise.gestorEmail,
          },
        });
      });
    });
    
    return matches;
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
