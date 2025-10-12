export type Companie = {
  id: number;
  nome: string;
  areaAtuacao: string;
  cnpj: string;
  gestor: string;
  email: string;
  setor: string;
  descricao: string;
  logo: string;
  cover?: string | null;
  gallery?: string[];
  instagram?: string | null;
  whatsapp?: string | null;
  linkedin?: string | null;
  locationUrl?: string | null;
};

const seed: Companie[] = [
  {
    id: 1,
    nome: "TechWave",
    areaAtuacao: "Inteligência Artificial",
    cnpj: "12.345.678/0001-90",
    gestor: "Mariana Alves",
    email: "contato@techwave.com",
    setor: "Tecnologia",
    descricao: "Desenvolve soluções de IA para otimizar processos empresariais e automação de dados.",
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
  return companiesData.find((c) => c.id === id) ?? null;
}

export function updateCompanyInMock(id: number, patch: Partial<Companie>): Companie | null {
  const i = companiesData.findIndex((c) => c.id === id);
  if (i === -1) return null;
  companiesData[i] = { ...companiesData[i], ...patch };
  return companiesData[i];
}
