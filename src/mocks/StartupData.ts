// mocks/StartupData.ts
export type Startup = {
  id: number;
  nome: string;
  areaAtuacao: string;
  cnpj: string;
  razaoSocial: string;
  email: string;
  setor: string;
  descricao: string;
  logo: string;
  gestor: string;
  tecnologias: string;
  companyId: number; // ✅ novo
};

export const StartupData: Startup[] = [
  {
    id: 1,
    nome: "TechWave",
    areaAtuacao: "Inteligência Artificial",
    cnpj: "12.345.678/0001-90",
    razaoSocial: "TechWave Soluções Digitais LTDA",
    email: "contato@techwave.com",
    setor: "Tecnologia",
    descricao:
      "Desenvolve soluções de IA para otimizar processos empresariais e automação de dados.",
    logo: "/logos/techwave.png",
    gestor: "Marcos Silva",
    tecnologias: "Python, TensorFlow, Node.js, AWS",
    companyId: 1, // ✅ vincula à empresa 1
  },
  {
    id: 2,
    nome: "EcoLife",
    areaAtuacao: "Sustentabilidade",
    cnpj: "98.765.432/0001-10",
    razaoSocial: "EcoLife Ambiental LTDA",
    email: "info@ecolife.com",
    setor: "Meio Ambiente",
    descricao:
      "Foca em tecnologias verdes e projetos sustentáveis para reduzir impactos ambientais.",
    logo: "/logos/ecolife.png",
    gestor: "Laura Fernandes",
    tecnologias: "React, Firebase, IoT, Power BI",
    companyId: 1, // ✅ mesma empresa
  },
  {
    id: 3,
    nome: "MediConnect",
    areaAtuacao: "Saúde Digital",
    cnpj: "11.222.333/0001-44",
    razaoSocial: "MediConnect Serviços Médicos SA",
    email: "suporte@mediconnect.com",
    setor: "Saúde",
    descricao:
      "Plataforma digital que conecta pacientes e profissionais de saúde de forma eficiente.",
    logo: "/logos/mediconnect.png",
    gestor: "Ana Ribeiro",
    tecnologias: "Next.js, TypeScript, PostgreSQL, Docker",
    companyId: 2, // ✅ outra empresa
  },
];
