export type CreateChallengePayload = {
  name: string
  startDate: string
  endDate: string
  area: string
  description: string
  strategic_alignment: string
  innovative_potential: string
  business_relevance: string
}

export type CreateChallengeResponse = {
  id: string
  name: string
  startDate: string
  endDate: string
  area: string
  description: string
  visibility: string
  status: string
  createdAt: string
  strategic_alignment: string
  innovative_potential: string
  business_relevance: string
  updatedAt: string
  enterpriseId: string
  usersId: string
}

export type ShowAllChallengeResponse = {
  id: string
  name: string
  startDate: string
  endDate: string
  area: string
  description: string
  visibility: string
  status: string
  strategic_alignment: string
  innovative_potential: string
  business_relevance: string
  updatedAt: string
  enterpriseId: string
  usersId: string
  Users: {
    name: string
    image: null
  }
}

export type ShowOneChallengeResponse = {
  id: string
  name: string
  startDate: string
  endDate: string
  area: string
  description: string
  visibility: string
  status: string
  strategic_alignment: string
  innovative_potential: string
  business_relevance: string
  updatedAt: string
  enterpriseId: string
  usersId: string
}

export type ChangeStatusPayload = {
  status: string
}

export type ChangeStatusResponse = {
  id: string
  name: string
  startDate: string
  endDate: string
  area: string
  description: string
  visibility: string
  status: string
  strategic_alignment: string
  innovative_potential: string
  business_relevance: string
  updatedAt: string
  enterpriseId: string
  usersId: string
}

export type ChangeVisibilityPayload = {
  visibility: string
}

export type ChangeVisibilityResponse = {
  id: string
  name: string
  startDate: string
  endDate: string
  area: string
  description: string
  visibility: string
  status: string
  strategic_alignment: string
  innovative_potential: string
  business_relevance: string
  updatedAt: string
  enterpriseId: string
  usersId: string
}