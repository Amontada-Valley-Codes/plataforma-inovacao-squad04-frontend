
export type CreateEnterprisePayload = {
  name: string
  cnpj: string
  sector: string
  description: string
  address: string
  email: string
  gestorEmail: string
  numeroGestor: string
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
    zap: string
    expiresAt: string
  }
}


export type CloudinaryImage = {
  public_id: string
  url: string
}

export type ShowAllEnterpriseResponse = {
  id: string
  name: string
  cnpj: string
  companyCode: string
  sector: string
  description: string
  address: string
  email: string
  gestorEmail: string
  numeroGestor: string
  coverImage: CloudinaryImage | null
  profileImage: CloudinaryImage | null
  status: string
  createdAt: string
  updatedAt: string
  logo?: string
  cover?: string | null
  gallery?: string[]
  instagram?: string | null
  whatsapp?: string | null
  linkedin?: string | null
  locationUrl?: string | null
}

export type ShowOneEnterpriseResponse = {
  id: string
  name: string
  cnpj: string
  companyCode: string
  sector: string
  description: string
  address: string
  email: string
  gestorEmail: string
  numeroGestor: string
  coverImage: CloudinaryImage | null
  profileImage: CloudinaryImage | null
  status: string
  createdAt: string
  updatedAt: string

  User?: any[]
  _count?: { Users: number }

  logo?: string
  cover?: string | null
  gallery?: string[]
  instagram?: string | null
  whatsapp?: string | null
  linkedin?: string | null
  locationUrl?: string | null
}