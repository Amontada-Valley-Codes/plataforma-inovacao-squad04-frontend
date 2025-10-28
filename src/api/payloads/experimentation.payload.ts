export type CreateExperimentationPayload = {
  objective: string;
  minDelivery: string;
  deadline: string;
  testEnvironment: string;
  maturityLevel: number;
}

export type CreateExperimentationResponse = {
  id: string;
  objective: string;
  minDelivery: string;
  deadline: string;
  testEnvironment: string;
  maturityLevel: number;
  challengeId: string;
}

export type ShowExperimentationResponse = {
  id: string;
  objective: string;
  minDelivery: string;
  deadline: string;
  testEnvironment: string;
  maturityLevel: number;
  challengeId: string;
  Kpis: {
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
}

export type UpdateExperimentationResponse = {
  id: string;
  objective: string;
  minDelivery: string;
  deadline: string;
  testEnvironment: string;
  maturityLevel: number;
  challengeId: string;
}

export type CreateKPIsPayload = {
  name: string;
  target: string;
}

export type CreateKPIsResponse = {
  id: string;
  name: string;
  target: string;
  experimentationId: string;
}