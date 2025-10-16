export type Companie = {
  id: string;
  name: string;
  cnpj: string;
  gestorEmail: string;
  email: string;
  sector: string;
  description: string;
  logo?: string;
  cover?: string | null;
  gallery?: string[];
  instagram?: string | null;
  whatsapp?: string | null;
  linkedin?: string | null;
  locationUrl?: string | null;
};

const seed: Companie[] = [
  {
    id: '1',
    name: "TechWave",
    cnpj: "12.345.678/0001-90",
    gestorEmail: "Mariana Alves",
    email: "contato@techwave.com",
    sector: "Tecnologia",
    description: "Desenvolve soluções de IA para otimizar processos empresariais e automação de dados.",
    logo: "/logos/techwave.png",
    cover: null,
    gallery: [],
    instagram: null,
    whatsapp: null,
    linkedin: null,
    locationUrl: null,
  },
];

export const companiesData: Companie[] =
  (globalThis as any).__companiesData ??
  ((globalThis as any).__companiesData = seed);

export function getCompanyById(id: number): Companie | null {
  return companiesData.find((c) => c.id === id.toString()) ?? null;
}

export function updateCompanyInMock(id: number, patch: Partial<Companie>): Companie | null {
  const i = companiesData.findIndex((c) => c.id === id.toString());
  if (i === -1) return null;
  companiesData[i] = { ...companiesData[i], ...patch };
  return companiesData[i];
}
