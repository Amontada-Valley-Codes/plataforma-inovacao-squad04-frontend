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