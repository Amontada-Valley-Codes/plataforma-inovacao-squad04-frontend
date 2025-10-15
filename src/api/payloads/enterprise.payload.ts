export type CreateEnterprisePayload = {
  name: string
  cnpj: string
  sector: string
  description: string
  address: string
  email: string
  gestorEmail: string
}

export type CreateEnterpriseResponse = {
  enterprises: {
    name: string
    cnpj: string
    sector: string
    description: string
    address: string
    email: string
    gestorEmail: string
    status: string
    createdAt: string
    updatedAt: string
  },
  
  token: {
    message: string
    inviteId: string
    token: string
    expiresAt: string
  }
}