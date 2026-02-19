export type CreateObjectivePayload = {
  title: string
  description: string
} 

export type CreateObjectiveResponse = {
  id: string
  title: string
  description: string
  createdAt: string
  updatedAt: string
} 

export type UpdateObjectivePayload = {
  title?: string
  description?: string
}

export type UpdateObjectiveResponse = {
  id: string
  title: string
  description: string
  createdAt: string
  updatedAt: string
}

export type StrategicObjectivesByChallengeResponse = {
  strategicObjective: Array<{
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
  }>
}

export type ShowAllObjectivesResponse = Array<{
  id: string
  title: string
  description: string
  createdAt: string
  updatedAt: string
}> 