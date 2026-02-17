export type AddSponsorPayload = {
  challengeId: string
  userId: string
}

export type AddSponsorResponse = {
  id: string
  challengeId: string
  sponsorId: string
  createdAt: string
  updatedAt: string
  challenge: {
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
  }
  sponsor: {
    id: string
    name: string
    email: string
    sector: string
    phone: string
    password: string
    googleId: string | null
    lastAccessAt: string | null
    type_user: string
    createdAt: string
    enterpriseId: string
    image: string | null
    startupId: string | null
  }
}

export type ShowSponsorsResponse = AddSponsorResponse[]

export type UpdateSponsorPayload = AddSponsorPayload

export type UpdateSponsorResponse = AddSponsorResponse

export type DeleteSponsorResponse = {
  id: string
  challengeId: string
  sponsorId: string
  createdAt: string
  updatedAt: string
}