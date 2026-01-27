export type CreateConceptionPayload = {
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
}

export type CreateConceptionResponse = {
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
}

export type UpdateConceptionPayload = CreateConceptionPayload

export type UpdateConceptionResponse = CreateConceptionResponse

export type ShowConceptionById = CreateConceptionResponse