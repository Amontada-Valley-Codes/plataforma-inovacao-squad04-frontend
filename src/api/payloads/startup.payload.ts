export type ShowAllStartupsResponse = {
  logo?: string;
  id: string;
  name: string;
  description: string;
  cnpj: string;
  email: string;
  industry_segment: string;
  problems_solved: string[];
  technologies_used: string[];
  maturity_stage: string;
  location: string;
  founders: string[];
  pitch: string;
  useful_links: {
    github: string;
    website: string;
    linkedin: string;
  }
}

export type CreateStartupPayload = {
  name: string;
  cnpj: string;
  email: string
  industry_segment: string;
  problems_solved: string[];
  technologies_used: string[];
  maturity_stage: string;
  location: string;
  founders: string[];
  pitch: string;
  useful_links: {
    github: string;
    website: string;
    linkedin: string;
  };
  description: string
  liderEmail: string
  liderPhone: string
}

export type UpdateStartupPayload = Partial<{
  name: string;
  description: string;
  technologies_used: string[]; 
  industry_segment: string;
  founders: string[];   
  cnpj: string;
  website: string;
  instagram: string;
  whatsapp: string;
  linkedin: string;
}>;

export type CreateStartupResponse = {
  startup: {
    id: string;
    name: string;
    cnpj: string;
    industry_segment: string;
    problems_solved: string[];
    technologies_used: string[];
    maturity_stage: string;
    location: string;
    founders: string[];
    pitch: string;
    useful_links: {
      github: string;
      website: string;
      linkedin: string;
    }
    liderEmail: string
    liderPhone: string
    status: string
    description: string
    createdAt: string
    updatedAt: string
    coverImage: null
    profileImage: null
  }
  token: {
    message: string
    inviteId: string
    token: string
    expiresAt: string
    zap: string
  }
}


export type CreatePublicStartupPayload = {
  name: string;
  cnpj: string;
  email: string
  industry_segment: string;
  problems_solved: string[];
  technologies_used: string[];
  maturity_stage: string;
  location: string;
  founders: string[];
  pitch: string;
  useful_links: {
    github: string;
    website: string;
    linkedin: string;
  };
  description: string
  liderEmail: string
  liderPhone: string
}

export type CreatePublicStartupResponse = {
  name: string
  industry_segment: string
  problems_solved: string[]
  technologies_used: string[]
  maturity_stage: string
  location: string
  founders: string[]
  pitch: string
  useful_links: {
    website: string
    linkedin: string
    instagram: string
  }
  liderEmail: string
  liderPhone: string
  status: string
  description: string
  createdAt: string
  updatedAt: string
  coverImage: null
  profileImage: null
}