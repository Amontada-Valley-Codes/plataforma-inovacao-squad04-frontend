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
      pocId: string,
      kpiId: null,
      createdAt: string
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
    pocId: string,
    kpiId: null,
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
  target: string
}

export type CreateIndicatorsResponse = {
  id: string,
  name: string,
  target: string,
  pocId: string,
  kpiId: string | null,
  createAt: string
}

export type UpdateIndicatorsPayload = CreateIndicatorsPayload

export type UpdateIndicatorsResponse = CreateIndicatorsResponse

export type DeleteIndicatorsResponse = CreateIndicatorsResponse