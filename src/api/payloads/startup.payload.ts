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
}

// src/api/payloads/startup.payload.ts
export type UpdateStartupPayload = Partial<{
  name: string;
  description: string;
  technologies_used: string[]; // era string
  industry_segment: string;
  founders: string[];          // era string
  cnpj: string;
  website: string;
  instagram: string;
  whatsapp: string;
  linkedin: string;
}>;

export type CreateStartupResponse = {
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
}