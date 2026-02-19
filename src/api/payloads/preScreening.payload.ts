// src/api/payloads/preScreening.payload.ts

export type CreatePreScreeningPayload = {
  alignmentJustification: string
  strategicRelevance: "HIGH" | "MEDIUM" | "LOW"
  notes?: string
}

export type CreatePreScreeningResponse = {
  id: string
  challengeId: string
  alignmentJustification: string
  strategicRelevance: string
  notes: string | null
  createdAt: string
  updatedAt: string
}

export type ShowPreScreeningResponse = {
  id: string
  challengeId: string
  alignmentJustification: string
  strategicRelevance: string
  notes: string | null
  createdAt: string
  updatedAt: string
}

export type UpdatePreScreeningPayload = {
  alignmentJustification?: string
  strategicRelevance?: "HIGH" | "MEDIUM" | "LOW"
  notes?: string
}

export type UpdatePreScreeningResponse = {
  id: string
  alignmentJustification: string
  strategicRelevance: string
  notes: string | null
  updatedAt: string
}

export type PreScreeningDecisionPayload = {
  decision: "DISAPPROVE" | "CHANGES_REQUESTED"
  justification: string
}

export type PreScreeningJustificationResponse = {
  id: string
  status: string
  justification: string
  createdAt: string
  users: {
    name: string
    email: string
  }
}
