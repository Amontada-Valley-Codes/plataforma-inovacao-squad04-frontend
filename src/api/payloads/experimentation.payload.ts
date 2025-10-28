export type CreateExperimentationPayload = {
  objective: string;
  minDelivery: string;
  deadline: string;
  testEnvironment: string;
  maturityLevel: number;
  responsible: {
    empresa: string;
    startup: string;
  }[];
}

export type CreateExperimentationResponse = {
  id: string;
  objective: string;
  minDelivery: string;
  deadline: string;
  testEnvironment: string;
  maturityLevel: number;
  responsible: {
    empresa: string;
    startup: string;
  }[];
  challengeId: string;
  usersId: string;
}

export type ShowExperimentationResponse = {
  id: string;
  objective: string;
  minDelivery: string;
  deadline: string;
  testEnvironment: string;
  maturityLevel: number;
  responsible: {
    empresa: string;
    startup: string;
  }[];
  challengeId: string;
  usersId: string;
  Kpis: {
    id: string;
    name: string;
    target: string;
  }[];
}

export type UpdateExperimentationPayload = {
  objective: string;
  minDelivery: string;
  deadline: string;
  testEnvironment: string;
  maturityLevel: number;
  responsible: {
    empresa: string;
    startup: string;
  }[];
}

export type UpdateExperimentationResponse = {
  id: string;
  objective: string;
  minDelivery: string;
  deadline: string;
  testEnvironment: string;
  maturityLevel: number;
  responsible: {
    empresa: string;
    startup: string;
  }[];
  challengeId: string;
  usersId: string;
}