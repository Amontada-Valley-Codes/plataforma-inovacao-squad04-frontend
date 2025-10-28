/* eslint-disable @typescript-eslint/no-explicit-any */

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

export type ShowAllEnterpriseResponse = {
  id: string
  name: string
  cnpj: string
  sector: string
  description: string
  address: string
  email: string
  gestorEmail: string
  coverImage: null
  profileImage: null
  status: string
  createdAt: string
  updatedAt: string
  logo?: string;
  cover?: string | null | undefined;
  gallery?: string[] | undefined;
  instagram?: string | null | undefined;
  whatsapp?: string | null | undefined;
  linkedin?: string | null | undefined;
  locationUrl?: string | null | undefined
}

export type ShowOneEnterpriseResponse = {
  id: string
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
  
  User?: any[];            
  _count?: { Users: number };
  
  logo?: string;
  cover?: string | null | undefined;
  gallery?: string[] | undefined;
  instagram?: string | null | undefined;
  whatsapp?: string | null | undefined;
  linkedin?: string | null | undefined;
  locationUrl?: string | null | undefined
}