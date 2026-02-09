export type createBuyMaterializationPayload = {
  hmwProblem: string
  selectionCriteria: {
    criterio: string
    peso: number
  }[]
  challengeRules: string
  editalFileUrl: string
  status: string
}

export type showBuyMaterializationResponse = {
  id: string
  challengeId: string
  hmwProblem: string
  selectionCriteria: {
    criterio: string
    peso: number
  }[]
  challengeRules: string
  editalFileUrl: string
  status: string
  createdAt: string
  updatedAt: string
}