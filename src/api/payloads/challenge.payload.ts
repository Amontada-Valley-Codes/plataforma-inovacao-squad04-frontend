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
  Enterprise: {
    name: string
  }
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
  visibility: string
  status: string
  createdAt: string
  updatedAt: string
  endDate: string
  impactScore: number | null
  confidenceScore: number | null
  easeScore: number | null
  finalIceScore: number | null
  enterpriseId: string
  usersId: string
  Users: {
    name: string
    image: string | null
  }
  Enterprise: {
    name: string
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

export type PaginatedChallengesParams = {
  page?: number
  limit?: number
  status?: string
  sector?: string
  search?: string
  orderBy?: "createdAt" | "name" | "proponentName" | "proponentArea" | "status"
  orderDirection?: "asc" | "desc"
}


export type PaginatedChallengesResponse = {
  data: ShowAllChallengeResponse[]
  meta: {
    total: number
    page: number
    limit: number
    lastPage: number
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

export type ChallengeFullResponse = {
  name: string;
  problemDescription: string;
  Users: {
    id: string;
    name: string;
    email: string;
    image: string | null;
  };
  forms: {
    id: string;
    version: {
      questions: {
        id: string;
        title: string;
        type: string;
        required: boolean;
        order: number;
        options: string[] | null;
        versionId: string;
      }[];
    };
    responses: {
      id: string;
      challengeFormId: string;
      createdAt: string;
      answers: {
        value: string
      }[]
    }[];
  }[];
};

export type AdvanceStageResponse = {
  id: string;
  ideaIdentifier: string;
  name: string;
  proponentName: string;
  proponentEmail: string;
  proponentArea: string;
  problemDescription: string;
  problemDuration: string;
  currentSolution: string;
  problemRelevance: string;
  currentIndicators: string;
  expectedImpacts: string;
  involvedAreas: string[];
  initialConstraints: string;
  proponentParticipation: string;
  strategic_alignment: string | number | null;
  innovative_potential: string | number | null;
  business_relevance: string | number | null;
  visibility: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  endDate: string;
  impactScore: string | number | null;
  confidenceScore: string | number | null;
  easeScore: string | number | null;
  finalIceScore: string | number | null;
  reportUrl: string | null;
  reportDate: string | null;
  enterpriseId: string;
  usersId: string;
};

export type ReturnStepResponse = AdvanceStageResponse

export type UpdateStrategicObjectivesPayload = {
  strategicObjectiveIds: string[]
}

export type UpdateStrategicObjectivesResponse = {
  message: string
}

export type UpdateChallengePayload = {
  name: string
  problemDescription: string
  problemDuration: string
  currentSolution: string
  problemRelevance: string
  strategicObjectiveIds: string[]
  currentIndicators: string
  expectedImpacts: string
  involvedAreas: string[]
  initialConstraints: string
  proponentParticipation: string
}

export type UpdateChallengeResponse = {
  id: string
  name: string
  problemDescription: string
  status: string
  updatedAt: string
}
export type DeleteChallengeResponse = {
  id: string;
  ideaIdentifier: string;
  name: string;
  proponentName: string;
  proponentEmail: string;
  proponentArea: string;
  problemDescription: string;
  problemDuration: string;
  currentSolution: string;
  problemRelevance: string;
  currentIndicators: string;
  expectedImpacts: string;
  involvedAreas: string[];
  initialConstraints: string;
  proponentParticipation: string;
  strategic_alignment: string | null;
  innovative_potential: string | null;
  business_relevance: string | null;
  visibility: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  endDate: string;
  impactScore: number | null | string;
  confidenceScore: number | null | string;
  easeScore: number | null | string;
  finalIceScore: number | null | string;
  reportUrl: string | null;
  reportDate: string | null;
  enterpriseId: string;
  usersId: string;
};
