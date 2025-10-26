// src/api/payloads/challenge.payload.ts

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
  createdAt: string
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
  enterpriseName?: string
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
  enterpriseName?: string
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

export type PublicChallengeItem = {
  id: string
  name: string
  endDate: string
  status: string
  visibility: string
  startDate?: string
  Enterprise: {
    name: string
  }
}

export type ShowAllPubliChallengeResponse = PublicChallengeItem[]

export type ShowOnePublicChallengeResponse = {
  id: string
  name: string
  startDate?: string
  endDate: string
  area?: string
  description?: string
  visibility: string
  status: string
  strategic_alignment?: string
  innovative_potential?: string
  business_relevance?: string
  updatedAt?: string
  enterpriseId?: string
  usersId?: string
  Enterprise?: {
    name: string
  }
  enterpriseName?: string
}
