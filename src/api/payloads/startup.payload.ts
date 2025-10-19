export type ShowAllStartupsResponse = {
  logo?: string;
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

export type CreateStartupPayload = {
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
  };
}

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