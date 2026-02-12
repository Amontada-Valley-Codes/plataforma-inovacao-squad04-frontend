// src/api/payloads/challenge.payload.ts

export type CreateChallengePayload = {
  name: string;
  problemDescription: string;
  problemDuration: string;
  currentSolution: string;
  problemRelevance: string;
  strategicObjectiveIds: string[];
  currentIndicators: string;
  expectedImpacts: string;
  involvedAreas: string[];          
  initialConstraints: string;
  proponentParticipation: string;   
};

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
  ideaIdentifier: string          
  name: string
  proponentName: string
  proponentEmail: string
  proponentArea: string
  problemDescription: string
  problemDuration: string
  currentSolution: string
  problemRelevance: string
  currentIndicators: string
  expectedImpacts: string
  involvedAreas: string[]
  initialConstraints: string
  proponentParticipation: string
  strategic_alignment: string | null
  innovative_potential: string | null
  business_relevance: string | null
  impactScore: number | null       
  confidenceScore: number | null  
  easeScore: number | null         
  finalIceScore: number | null     
  visibility: string
  status: string
  createdAt: string
  endDate: string                 
  updatedAt: string
  enterpriseId: string
  usersId: string
  Users: {
    name: string
    image: string | null
  }
  strategicObjective: {
    id: string
    challengeId: string
    strategicObjectiveId: string
    createdAt: string
    strategicObjective: {
      id: string
      title: string
      description: string
      createdAt: string
      updatedAt: string
    }
  }[]
}


export type ShowOneChallengeResponse = {
  id: string
  ideaIdentifier: string
  name: string
  proponentName: string
  proponentEmail: string
  proponentArea: string
  problemDescription: string
  problemDuration: string
  currentSolution: string
  problemRelevance: string
  currentIndicators: string
  expectedImpacts: string
  involvedAreas: string[]
  initialConstraints: string
  proponentParticipation: string
  strategic_alignment: string | null
  innovative_potential: string | null
  business_relevance: string | null
  impactScore: number | null
  confidenceScore: number | null
  easeScore: number | null
  finalIceScore: number | null
  visibility: string
  status: string
  createdAt: string
  endDate: string
  updatedAt: string
  enterpriseId: string
  usersId: string
  Users: {
    name: string
    image?: string | null
  }
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

export type CreateVotePreScreeningPayload = {
  strategicAlignment: number
  innovativePotential: number
  businessRelevance: number
}

export type CreateVotePreScreeningResponse = {
  id: string
  challengeId: string
  userId: string
  strategicAlignmentScore: number
  innovativePotentialScore: number
  businessRelevanceScore: number
  createdAt: string
}

export type ShowPercentageVoteResponse = {
  percentage: number
  voters: {
    name: string,
    image: null
  }[]
}

export type UpdateEndDatePayload = {
  endDate: string
}

export type UpdateEndDateResponse = {
  id: string
  name: string
  endDate: string
  status: string
  updatedAt: string
}

export type GanttChartItem = {
  id: string
  ideaIdentifier: string
  name: string
  problemDescription: string
  status: string
  startDate?: string
  createdAt: string
  endDate: string
}

export type GanttChartResponse = GanttChartItem[]

export type ChallengesByStageItem = {
  stage: string
  total: number
}

export type ChallengesByStageResponse = ChallengesByStageItem[]