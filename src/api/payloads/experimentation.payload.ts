export type CreateExperimentationResponse = {
  id: string,
  challengeId: string
}

export type ShowExperimentationResponse = {
  id: string,
  challengeId: string,
  poc: {
    id: string,
    objective: string,
    scope: string,
    createdAt: string,
    updatedAt: string,
    experimentationId: string,
    pocHypotheses: {
      id: string,
      description: string,
      status: string,
      pocId: string
    }[],
    poCIndicators: {
      id: string,
      name: string,
      target: string,
      metric: string,
      pocId: string,
      kpiId: string | null,
      createdAt: string
    }[],
    pocResultsReports: {
      id: string,
      executiveSummary: string,
      learnings: string[],
      recommendation: string,
      recommendationTxt: string,
      pocId: string,
      kpis: {
        kpiId: string,
        value: number,
        description: string
      }[],
      createdAt: string,
      updatedAt: string
    }[]
  } | null
}

export type CreatePocPayload = {
  objective: string,
  scope: string
}

export type CreatePocResponse = {
  id: string,
  objective: string,
  scope: string,
  createdAt: string,
  updatedAt: string,
  experimentationId: string
}

export type UpdatePocPayload = CreatePocPayload

export type UpdatePocResponse = CreatePocResponse

export type DeletePocResponse = CreatePocResponse

export type ShowPocResponse = {
  id: string,
  objective: string,
  scope: string,
  createdAt: string,
  updatedAt: string,
  experimentationId: string,
  pocHypotheses: {
    id: string,
    description: string,
    status: string,
    pocId: string
  }[],
  poCIndicators: {
    id: string,
    name: string,
    target: string,
    metric: string,
    pocId: string,
    kpiId: string | null,
    createdAt: string
  }[]
}

export type CreateHypothesesPayload = {
  description: string,
  status: string
}

export type CreateHypothesesResponse = {
  id: string,
  description: string,
  status: string,
  pocId: string
}

export type UpdateHypothesesPayload = CreateHypothesesPayload

export type UpdateHypothesesResponse = CreateHypothesesResponse

export type DeleteHypothesesResponse = CreateHypothesesResponse

export type CreateIndicatorsPayload = {
  kpiId: string | null,
  name: string,
  target: string,
  metric: string
}

export type CreateIndicatorsResponse = {
  id: string,
  name: string,
  target: string,
  metric: string,
  pocId: string,
  kpiId: string | null,
  createdAt: string
}

export type UpdateIndicatorsPayload = CreateIndicatorsPayload

export type UpdateIndicatorsResponse = CreateIndicatorsResponse

export type DeleteIndicatorsResponse = CreateIndicatorsResponse

export type CreateResultsReportPayload = {
  executiveSummary: string,
  learnings: string[],
  recommendation: string,
  recommendationTxt: string,
  kpis: {
    kpiId: string,
    value: number,
    description: string
  }[]
}

export type CreateResultsReportResponse = {
  id: string,
  executiveSummary: string,
  learnings: string[],
  recommendation: string,
  recommendationTxt: string,
  pocId: string,
  kpis: {
    kpiId: string,
    value: number,
    description: string
  }[],
  createdAt: string,
  updatedAt: string
}

export type ShowResultsReportResponse = CreateResultsReportResponse

export type UpdateResultsReportPayload = CreateResultsReportPayload

export type UpdateResultsReportResponse = CreateResultsReportResponse

export type DeleteResultsReportResponse = CreateResultsReportResponse
