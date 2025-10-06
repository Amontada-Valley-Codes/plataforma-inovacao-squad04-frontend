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
};

export const companiesData: Companie[] = [
  {
    id: 1,
    nome: "TechWave",
    areaAtuacao: "Inteligência Artificial",
    cnpj: "12.345.678/0001-90",
    gestor: "Mariana Alves",
    email: "contato@techwave.com",
    setor: "Tecnologia",
    descricao:
      "Desenvolve soluções de IA para otimizar processos empresariais e automação de dados.",
    logo: "/logos/techwave.png",
  },
  {
    id: 2,
    nome: "EcoLife",
    areaAtuacao: "Sustentabilidade",
    cnpj: "98.765.432/0001-10",
    gestor: "Rafael Souza",
    email: "info@ecolife.com",
    setor: "Meio Ambiente",
    descricao:
      "Foca em tecnologias verdes e projetos sustentáveis para reduzir impactos ambientais.",
    logo: "/logos/ecolife.png",
  },
  {
    id: 3,
    nome: "MediConnect",
    areaAtuacao: "Saúde Digital",
    cnpj: "11.222.333/0001-44",
    gestor: "Carla Fernandes",
    email: "suporte@mediconnect.com",
    setor: "Saúde",
    descricao:
      "Plataforma digital que conecta pacientes e profissionais de saúde de forma eficiente.",
    logo: "/logos/mediconnect.png",
  },
  {
    id: 4,
    nome: "AgroSmart",
    areaAtuacao: "Agrotech",
    cnpj: "55.666.777/0001-22",
    gestor: "João Pereira",
    email: "contato@agrosmart.com",
    setor: "Agronegócio",
    descricao:
      "Fornece soluções tecnológicas para monitoramento de plantações e otimização da produção agrícola.",
    logo: "/logos/agrosmart.png",
  },
  {
    id: 5,
    nome: "FintechX",
    areaAtuacao: "Serviços Financeiros",
    cnpj: "88.999.000/0001-55",
    gestor: "Fernanda Lima",
    email: "suporte@fintechx.com",
    setor: "Financeiro",
    descricao:
      "Oferece plataformas digitais de pagamento, crédito e análise financeira para pequenas empresas.",
    logo: "/logos/fintechx.png",
  },
];
