export type StartupMatchResponse = {
  id: string;
  statusMatch: string;
  acceptStartup: string;
  acceptEnterprise: string;
  challengeId: string;
  enterpriseId: string;
  startupId: string;
  type?: "INVITE" | "APPLICATION";
  status?: "PENDING" | "ACCEPTED" | "REJECTED" | "CANCELLED";
  createdAt?: string;
  updatedAt?: string;
  Startup?: {
    id: string;
    name: string;
    logo?: string;
    industry_segment: string;
  };
  Challenge?: {
    id: string;
    name: string;
    description?: string;
    status: string;
  };
  Enterprise?: {
    id: string;
    name: string;
    gestorEmail?: string;
  };
};

export type CreateInvitePayload = {
  challengeId: string;
  enterpriseId: string;
};

export type CreateApplicationPayload = {
  challengeId: string;
  enterpriseId: string;
};

export type MatchStatsResponse = {
  pendingApplications: number;
  receivedInvites: number;
  acceptedMatches: number;
};

export type EnterpriseMatchResponse = {
  id: string;
  statusMatch: string;
  acceptStartup: string;
  acceptEnterprise: string;
  challengeId: string;
  enterpriseId: string;
  startupId: string;
  Startup?: {
    id: string;
    name: string;
    logo?: string;
    industry_segment?: string;
  };
  Challenge?: {
    id: string;
    name: string;
    status?: string;
  };
};

export type StartupWithMatchesResponse = {
  startup: {
    id: string;
    name: string;
    logo?: string;
    industry_segment?: string;
    liderEmail?: string;
  };
  totalMatches: number;
  challenges: Array<{
    matchId: string;
    id: string;
    name: string;
    Enterprise?: {
      name: string;
    };
  }>;
};

export type AcceptedMatchesResponse = {
  totalGeneralMatches: number;
  startups: StartupWithMatchesResponse[];
};
