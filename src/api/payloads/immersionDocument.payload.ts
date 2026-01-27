export type CreateImmersionPayload = {
  POV: string;
  HMW: string;
  stakeholder: string[];
  evidence: {
    url: string;
    type: string;
    public_id: string;
  }[];
}

export type CreateImmersionResponse = {
  id: string;
  POV: string;
  HMW: string;
  stakeholder: string[];
  evidence: {
    url: string;
    type: string;
    public_id: string;
  }[];
  screeningId: string;
}

export type UpdateImmersionPayload = CreateImmersionPayload

export type UpdateImmersionResponse = CreateImmersionResponse

export type ShowImmersionResponse = {
  id: string;
  POV: string;
  HMW: string;
  stakeholder: string[];
  evidence: {
    url: string;
    type: string;
    public_id: string;
  }[];
  screeningId: string;
  problemTree: ProblemTreeNode[];
  mapEmpathies: {
    id: string;
    listen: string;
    see: string;
    speakAndDo: string;
    pains: string;
    gains: string;
    immersionId: string;
  }[];
}

export type ProblemTreeNode = {
  id: string;
  description: string;
  type: 'PROBLEM' | 'CAUSE' | 'EFFECT';
  immersionId: string;
  parentId: string | null;
};

export type CreateProblemTreePayload = {
  description: string;
  type: 'PROBLEM' | 'CAUSE' | 'EFFECT';
  children: CreateProblemTreePayload[];
}

export type CreateProblemTreeResponse = {
  id: string;
  description: string;
  type: 'PROBLEM' | 'CAUSE' | 'EFFECT';
  immersionId: string;
  parentId: string | null;
  children: CreateProblemTreeResponse[];
};

export type ShowProblemTreeResponse = {
  id: string;
  description: string;
  type: 'PROBLEM' | 'CAUSE' | 'EFFECT';
  immersionId: string;
  parentId: string | null;
  children: ShowProblemTreeResponse[];
};

export type UpdateProblemTreeNodePayload = {
  description: string;
  type: 'PROBLEM' | 'CAUSE' | 'EFFECT';
};

export type UpdateProblemTreeResponse = {
  id: string;
  description: string;
  type: 'PROBLEM' | 'CAUSE' | 'EFFECT';
  immersionId: string;
  parentId: string | null;
};

export type CreateMapEmpathyPayload = {
  listen: string;
  see: string;
  speakAndDo: string;
  pains: string;
  gains: string;
} 

export type CreateMapEmpathyResponse = {
  id: string;
  listen: string;
  see: string;
  speakAndDo: string;
  pains: string;
  gains: string;
  immersionId: string;
}

export type UpdateMapEmpathyPayload = CreateMapEmpathyPayload

export type UpdateMapEmpathyResponse = CreateMapEmpathyResponse

export type ShowMapEmpathyResponse = CreateMapEmpathyResponse