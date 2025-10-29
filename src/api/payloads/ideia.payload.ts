export type IdeiaStatus = "PENDING" | "APPROVED" | "REJECTED";

export type CreateIdeiaPayload = {
  ideia: string;
};

export type CreateIdeiaResponse = {
  id: string;
  ideia: string;
  status: IdeiaStatus;
  createdAt: string;
  challengeId: string;
  userId: string;
};

export type UpdateIdeiaPayload = {
  ideia: string;
};

export type UpdateIdeiaResponse = {
  id: string;
  ideia: string;
  status: IdeiaStatus;
  createdAt: string;
  challengeId: string;
  userId: string;
};

export type DeleteIdeiaResponse = {
  message: string;
};

export type LikeIdeiaResponse = {
  curtida: boolean;
  message: string;
};


export type ShowAllIdeiasResponse = {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  area: string;
  description: string;
  visibility: string;
  status: string;
  ideas: {
    id: string;
    status: IdeiaStatus;
    ideia: string;
    userName: string;
    likesCount: number;
  }[];
};

export type ApproveIdeiaResponse = {
  id: string;
  ideia: string;
  status: "APPROVED";
  createdAt: string;
  challengeId: string;
  userId: string;
};

export type RejectIdeiaResponse = {
  id: string;
  ideia: string;
  status: "REJECTED";
  createdAt: string;
  challengeId: string;
  userId: string;
};