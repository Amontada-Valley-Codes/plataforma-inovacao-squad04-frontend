export type CreateDetailedScreeningPayload = {
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

export type CreateDetailedScreeningResponse = {
  data: {
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
  },
  porcentagemMedia: string;
}

export type ShowDetailedScreeningResponse = {
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
  TriagemVoto: {
    viabilidade_tecnica: number;
    impacto_financeiro: number;
    aderencia_estrategica: number;
    risco: number;
  }[];
  porcentagemMedia: string;
}

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