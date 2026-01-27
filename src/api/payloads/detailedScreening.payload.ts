export type StartDetailedScreeningPayload = {
  id: string; 
}

export type StartDetailedScreeningResponse = {
  id: string;
}

export type ShowDetailedScreeningByIdResponse = {
  id: string,
  challengeId: string,
  enterpriseId: string,
  immersionDocument: {
    id: string;
    POV: string;
    HMW: string;
    stakeholder: string[];
    evidence: {
      url: string;
      type: string;
      public_id: string;
    }[];
    screeningId: string;
  }[],
  conceptionDocument: {
    id: string;
    ProductOverview: {
      summary: string;
      targetAudience: string;
      valueProposition: string;
    };
    SolutionAlternatives: string;
    MakeorBuy: {
      type: string;
      justification: string;
    };
    InitialRisks: string;
    TechnicalCapability: string;
    FinancialCapacity: string;
    screeningId: string;
  }[]
}

export type ShowDetailedScreeningResponse = ShowDetailedScreeningByIdResponse[]

export type UpdateDetailedScreeningPayload = {
  problema: string;
  solucao: string;
  beneficios: string;
  api: string;
  tipoApi: string;
  stackes: string;
  numeroDeSprints: string;
  investimento: string;
  custo: string;
  beneficiosMensal: string;
  pilarEstrategico: string;
  principalRisco: string;
  mitigacao: string;
  responsavel: string;
  prazo: string;
}

export type UpdateDetailedScreeningResponse = {
  id: string;
  api: string;
  tipoApi: string;
  stackes: string;
  numeroDeSprints: number;
  investimento: string;
  custo: string;
  beneficiosMensal: string;
  pilarEstrategico: string;
  principalRisco: string;
  mitigacao: string;
  responsavel: string;
  prazo: string;
  problema: string;
  solucao: string;
  beneficios: string;
  challengeId: string;
  userId: string;
}

export type VoteDetailedScreeningPayload = {
  viabilidade_tecnica: number;
  impacto_financeiro: number;
  aderencia_estrategica: number;
  risco: number;
}

export type VoteDetailedScreeningResponse = {
  message: string;
  data: {
    id: string;
    userId: string;
    triagemId: string;
    viabilidade_tecnica: number;
    impacto_financeiro: number;
    aderencia_estrategica: number;
    risco: number;
  };
  porcentagemMedia: string;
}