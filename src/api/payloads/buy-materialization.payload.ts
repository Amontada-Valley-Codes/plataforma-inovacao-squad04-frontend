export type createBuyMaterializationPayload = {
  hmwProblem: string
  selectionCriteria: string[]
  challengeRules: string
  edital: File
}

export type CreateBuyMaterializationFormData = FormData;

export type showBuyMaterializationResponse = {
  id: string
  challengeId: string
  hmwProblem: string
  selectionCriteria: string[]
  challengeRules: string
  editalFileUrl: File
  createdAt: string
  updatedAt: string
}