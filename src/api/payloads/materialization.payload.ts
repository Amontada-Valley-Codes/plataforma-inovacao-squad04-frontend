export type CreateMvpPayload = {
  targetAudience: string;
  valueProposal: string;
  features: string[];
  resources: {
    type: string;
    description: string;
  }[];
  kpis: {
    name: string;
    metric: string;
    target: string;
  }[];
}

export type CreateMvpResponse = {
  id: string,                 
  targetAudience: string,      
  valueProposal: string,      
  features: string[],           
  resources: {                 
    type: string,
    description: string
  }[],
  challengeId: string,          
  createdAt: string,
  updatedAt: string,    
  kpis: [             
    {
      id: string,
      name: string,
      metric: string,
      target: string,
      createdAt: string,
      mvpCanvasId: string
    }
  ]
}

export type ShowAllMvpResponse = {
  id: string;
  targetAudience: string;
  valueProposal: string;
  features: string[];
  resources: {
    type: string;
    description: string;
  }[];
  challengeId: string;
  createdAt: string;
  updatedAt: string;
  kpis: {
    id: string;
    name: string;
    metric: string;
    target: string;
    createdAt: string;
    mvpCanvasId: string;
  }[];
  challenge: {
    id: string;
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
    enterpriseId: string;
    usersId: string;
  };
}[];

export type ShowMvpById = {
  id: string;
  targetAudience: string;
  valueProposal: string;
  features: string[];
  resources: {
    type: string;
    description: string;
  }[];
  challengeId: string;
  createdAt: string;
  updatedAt: string;
  kpis: {
    id: string;
    name: string;
    metric: string;
    target: string;
    createdAt: string;
    mvpCanvasId: string;
  }[];
  challenge: {
    id: string;
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
    enterpriseId: string;
    usersId: string;
  };
};

export type UpdateMvpPayload = CreateMvpPayload

export type UpdateMvpResponse = CreateMvpResponse

export type DeleteMvpResponse = CreateMvpResponse