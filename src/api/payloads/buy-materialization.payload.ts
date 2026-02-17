export type createBuyMaterializationPayload = {
  hmwProblem: string
  selectionCriteria: string[]
  challengeRules: string
  edital: File
}

export type CreateBuyMaterializationResponse = {
  id: string
  challengeId: string
  hmwProblem: string
  selectionCriteria: string[]
  challengeRules: string
  editalFileUrl: {
    files: {
      url: string
      type: string
      public_id: string
    }[]
    provider: string
    uploadedAt: string
  }
  status: string
  createdAt: string
  updatedAt: string
}

export type CreateBuyMaterializationFormData = FormData;

export type showBuyMaterializationResponse = {
  id: string;
  challengeId: string;
  hmwProblem: string;
  selectionCriteria: string[];
  challengeRules: string;
  editalFileUrl: {
    files: {
      url: string
      type: string
      public_id: string
    }[]
    provider: string
    uploadedAt: string
  }
  status: string;
  createdAt: string;
  updatedAt: string;
}[];

export type UpdateBuyPayload = createBuyMaterializationPayload
export type UpdateBuyResponse = CreateBuyMaterializationResponse
export type DeleteBuyResponse = CreateBuyMaterializationResponse