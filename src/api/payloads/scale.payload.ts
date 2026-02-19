export type createScalePayload = {
  totalCost: number
  expectedFinancialBenefit: number
  benefitDescription: string
  risksAndMitigations: string[]  
}

export type UpdateRolloutPayload = {
  rolloutScope: string
  stakeholderIds: string[]
}

export type UpdateExecutiveSummaryPayload = {
  executiveSummary: string
}