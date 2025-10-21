export type CreateEnterprisePayload = {
  name: string;
  cnpj: string;
  sector: string;
  description: string;
  address: string;
  email: string;
  gestorEmail: string;
};

export type CreateEnterpriseResponse = {
  enterprises: {
    id?: string; // opcional — algumas APIs retornam o ID
    name: string;
    cnpj: string;
    sector: string;
    description: string;
    address: string;
    email: string;
    gestorEmail: string;
    status: string;
    createdAt: string;
    updatedAt: string;
  };
  token: {
    message: string;
    inviteId: string;
    token: string;
    expiresAt: string;
  };
};

export type ShowAllEnterpriseResponse = {
  id: string;
  name: string;
  cnpj: string;
  sector: string;
  description: string;
  address: string;
  email: string;
  gestorEmail: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  logo?: string;
  cover?: string | null;
  gallery?: string[];
  instagram?: string | null;
  whatsapp?: string | null;
  linkedin?: string | null;
  locationUrl?: string | null;
};
