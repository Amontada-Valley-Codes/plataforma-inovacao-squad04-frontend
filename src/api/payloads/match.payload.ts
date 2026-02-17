export type StartupMatchResponse = {
  id: string;
  startupId: string;
  challengeId: string;
  enterpriseId: string;
  status: "PENDING" | "ACCEPTED" | "REJECTED" | "CANCELLED";
  type: "INVITE" | "APPLICATION";
  createdAt: string;
  updatedAt: string;
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
