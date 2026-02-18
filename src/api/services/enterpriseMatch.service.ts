import api from "../axios";
import { ENDPOINTS } from "../endpoints";
import type {
  EnterpriseMatchResponse,
  StartupWithMatchesResponse,
  AcceptedMatchesResponse,
} from "../payloads/match.payload";

export const enterpriseMatchService = {
  async sendInvite(startupId: string, challengeId: string): Promise<EnterpriseMatchResponse> {
    const { data } = await api.post(ENDPOINTS.ENTERPRISE_MATCH.SEND_INVITE(startupId, challengeId));
    return data;
  },

  async acceptApplication(matchId: string): Promise<EnterpriseMatchResponse> {
    const { data } = await api.patch(ENDPOINTS.ENTERPRISE_MATCH.ACCEPT_APPLICATION(matchId));
    return data;
  },

  async denyMatch(matchId: string): Promise<EnterpriseMatchResponse> {
    const { data } = await api.patch(ENDPOINTS.ENTERPRISE_MATCH.DENY_MATCH(matchId));
    return data;
  },

  async getAcceptedMatches(): Promise<AcceptedMatchesResponse> {
    const { data } = await api.get(ENDPOINTS.ENTERPRISE_MATCH.GET_ACCEPTED);
    return data;
  },

  async getPendingApplications(): Promise<EnterpriseMatchResponse[]> {
    const { data } = await api.get(ENDPOINTS.ENTERPRISE_MATCH.GET_PENDING_APPLICATIONS);
    return Array.isArray(data?.pendings) ? data.pendings : [];
  },

  async getPendingInvites(): Promise<EnterpriseMatchResponse[]> {
    const { data } = await api.get(ENDPOINTS.ENTERPRISE_MATCH.GET_PENDING_INVITES);
    return Array.isArray(data?.pendings) ? data.pendings : [];
  },
};
