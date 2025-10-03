import { MoreHorizontal, Settings, TriangleAlert, User } from "lucide-react";
import Image from "next/image";

export default function CompanieCard() {

  type Companie = {
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

  const companies: Companie[] = [
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


  return (
    <div className="flex flex-col gap-6 w-full p-4">
      {companies.map((companie) => (
        <div
          key={companie.id}
          className="w-full bg-[#F9FAFB] dark:bg-gray-900 rounded-xl shadow-md border border-[#E5E7EB] dark:border-gray-800 p-6 hover:scale-[1.01] transition transform"
        >
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            {/* Imagem + Nome */}
            <div className="flex flex-col md:flex-row items-center md:items-start gap-4 w-full md:w-[30%] justify-center md:justify-start">
              <div className="w-16 h-16 bg-[#E5E7EB] dark:bg-gray-700 rounded-md flex-shrink-0 flex items-center justify-center">
                <Image
                  src={companie.logo}
                  alt={''}
                  width={14}
                  height={14}
                  className="object-contain"
                />
              </div>
              <div className="text-center md:text-left">
                <h2 className="font-semibold text-[#15358D] dark:text-blue-500">
                  {companie.nome}
                </h2>
                <p className="text-sm text-[#98A2B3]">{companie.areaAtuacao}</p>
              </div>
            </div>

            {/* Infos */}
            <div className="flex flex-col md:flex-row items-center justify-between w-full md:w-[50%] mt-4 md:mt-0 text-sm text-[#344054] dark:text-[#ced3db]">
              <div className="flex flex-col items-center md:items-start gap-2">
                {/* CNPJ */}
                <div className="flex w-full items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#15358D]"></span>
                  <span>{companie.cnpj}</span>
                </div>

                {/* Razão social */}
                <div className="flex w-full items-center gap-2">
                  <User size={15} className="text-[#98A2B3]" />
                  {companie.gestor}
                </div>

                {/* Email */}
                <div className="flex w-full items-center gap-2">
                  <TriangleAlert size={15} className="text-[#98A2B3]" />
                  {companie.email}
                </div>

                {/* Setor */}
                <div className="flex w-full items-center gap-2">
                  <Settings size={15} className="text-[#98A2B3]" />
                  {companie.setor}
                </div>
              </div>
            </div>

            {/* Descrição */}
            <div className="flex items-center text-sm text-[#344054] dark:text-[#ced3db] md:w-[30%]">
              {companie.descricao}
            </div>

            {/* Menu */}
            <div className="flex justify-center md:justify-end w-full md:w-[10%]">
              <button>
                <MoreHorizontal
                  size={36}
                  className="p-2 text-[#344054] dark:text-[#ced3db] hover:bg-[#E5E7EB] dark:hover:bg-gray-700 rounded-full cursor-pointer"
                />
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
